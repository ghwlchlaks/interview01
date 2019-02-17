
const User = require('../models/users');
const {PublicRoom, PublicMessage} = require('../models/messages')

module.exports = function(io) {
  // 클라이언트가 접속 했을때의 이벤트
  io.on('connection', (socket) => {
      console.log('user connected: ', socket.id);


      // 로그인시 참여자로 설정
      socket.on('enter public room', (username) => {

        User.findOne({username: username}, (err, user) => {
          if(err) throw err;
          if(!user) console.log('존재하는 유저가 아닙니다.');
          else {

            
            PublicRoom.findOne({username: username}, (err, participant) => {
              if (err) throw err;
              if (!participant) {
                //유저가 존재하고 디비에 정보가 없다면 publicRoom에 참여자로 저장
                const publicRoom = new PublicRoom({
                  username: username,
                  socketId: socket.id,
                  userId: user._id,
                  accessTime: Date.now()
                });
                publicRoom.save((err) => {
                  if (err) throw err;
                  // 참여자로 저장이 됐다면
                  io.emit('success public room')
                })
              } else {
                // 만약 이전에 참여한 이력이 존재한다면
                participant.socketId = socket.id;
                participant.accessTime = Date.now()
                participant.save((err) => {
                  io.emit('success public room')
                })
              }
            })     
          }
        })
      })
      
      // 참여자 목록
      socket.on('get all users', () => {
        // console.log('get all users : ' + socket.id);
        const query = PublicRoom.find().ne('socketId', socket.id);
        query.exec((err, allUsers) => {
          // console.log(allUsers)
          //자신을 제외한 모든 유저 정보 보내기
          io.emit('success get users', allUsers);
        })
      })

      // 클라이언트에게 전체 메시지를 받으면
      socket.on('public send message', (username, msg) => {
        User.findOne({username: username}, (err, user) => {
          if (err) throw err;
          if (!user) console.log('해당 유저가 없습니다. ' +  username);
          else {
            //송신자가 회원이 등록되어있다면
            PublicRoom.findOne({username: username}, (err, participant) => {
              if (err) throw err;
              if (!participant) console.log('전체 채팅 참여자가 아닙니다. '+ participant)
              else {
                // 유저이면서 채팅 참여자이면 
                // 전체 채팅 내용 저장
                const publicMessage = new PublicMessage({
                  sender: user._id,
                  username: username,
                  message: msg,
                  createDate: Date.now,
                });

                publicMessage.save((err) => {
                  if (err) throw err;
                  else {
                    // 채팅 내용이 저장 됐다면
                    io.emit('public message',username, msg);
                  }
                })
              }
            })
          }
        })
      })

      //모든 전체 채팅 내용
      socket.on('get public message', (username) => {
        // 요청한 사용자의 socket id검색
        PublicRoom.findOne({username: username}, (err, user) => {
          if (err) throw err;
          if(!user) console.log('전체 채팅 참여자가 아닙니다.');
          else {
            // 전체 채팅에 참여한 유저라면
            //전체 채팅 컬렉션에서 최근 100개 데이터 가져오기
            PublicMessage.find({})
            .limit(100)
            .sort({'createdDate': 'acs'})
            .exec((err, messages) => {
              if(err) throw err;
              // 요청한 클라이언트에게 전달 채팅 내역 전달
              console.log(messages);
              io.to(user.socketId).emit('public all message', messages);
            })
          }
        })   
      })



      // 연결 끊겼을때
      socket.on('disconnect', () => {
          PublicRoom.deleteOne({socketId: socket.id}, (err) => {
            if (err) throw err;
            else {
              console.log('user disconnected: ', socket.id);
            }
          })
      })
  })
}