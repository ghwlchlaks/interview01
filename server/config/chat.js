
const User = require('../models/users');
const {PublicRoom, PublicMessage, PrivateMessage} = require('../models/messages')

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
      
      function findClientsSocketByRoomId(roomId) {
        let res = []
        , room = io.sockets.adapter.rooms[roomId];
        if (room) {
            for (let id in room) {
            res.push(io.sockets.adapter.nsp.connected[id]);
            }
        }
        return res;
        }


      function findConnectedClient (socketConnectedUsers) {
        return new Promise((resolve, reject) => {
          var user = []
          for (let key in socketConnectedUsers) {
            // console.log(key);
            (function () {
              PublicRoom.findOne({socketId : key}, (err, connectedUser) => {
                if (err) reject(err);
                if (connectedUser) {
                  // console.log(connectedUser)
                  user.push(connectedUser)
                }
              })(key)
            })
              
          }
          console.log(user)
          resolve(user)
        })
      }

      getClientList = () => {
        const socketConnectedUsers = io.sockets.clients().connected;
        let connectedSockets = []
        for (let id in socketConnectedUsers) {
          connectedSockets.push(id)
        }

        PublicRoom.find({})
          .exec((err, user) => {
            if (err) throw err;
            let connectedUser = []
            user.forEach((value) => {
              connectedSockets.forEach((value1) => {
                if (value.socketId === value1) {
                  connectedUser.push(value);
                }
              })
            });
          // console.log(connectedUser)
          io.emit('success get users', connectedUser);
        })
      }

      // 참여자 목록
      socket.on('get all users', () => {   
        getClientList()
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
                  createdDate: Date.now(),
                });

                publicMessage.save((err) => {
                  if (err) throw err;
                  else {
                    // 채팅 내용이 저장 됐다면
                    io.emit('public message', publicMessage);
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
            .sort({'createdDate': 'asc'})
            .exec((err, messages) => {
              if(err) throw err;
              // 요청한 클라이언트에게 전달 채팅 내역 전달
              io.to(user.socketId).emit('public all message', messages);
            })
          }
        })   
      })

      // 귓속말 채팅 보내기
      socket.on('private send message', (from, to, msg) => {
        console.log(`${from} 님이 ${to}님에게 ${msg} 를 보냈습니다.`);

        // 두 유저가 존재하는 유저인지 확인
        Promise.all([
          User.findOne({username: from}),
          User.findOne({username: to}),
        ]).then((users) => {
          const [fromUser, toUser] = users;

          if (fromUser.length !== 0 && toUser.length !== 0) {
            //두 유저가 존재한다면
            const privateMessage = new PrivateMessage({
              sender: fromUser._id,
              username: from,
              message: msg,
              receiver: toUser._id,
              receiverName: to,
              createdDate: Date.now(),
            })
            // 귓속말 저장
            privateMessage.save((err) => {
              if (err) throw err;
              else {
                // 저장이 완료되면 귓속말 보내기
                io.to(socket.id).emit('private message', privateMessage)

                PublicRoom.findOne({username: to})
                  .select('socketId')
                  .exec((err, toSocketId)=> {
                    if (err) throw err;
                    else {
                      io.to(toSocketId.socketId).emit('private message', privateMessage);
                    }
                  })
              }
            })

          } else {
            //둘 중한명이라도 존재 하지 않는다면
            console.log('존재 하지 않는 유저입니다.');
          }

        }).catch((err) => {
          throw err;
        })
        
      })

      // 귓속말 채팅 내용
      socket.on('get private message', (from, to) => {
        console.log(`${from} 님과 ${to}님의 모든 대화 내용`);

        // 존재하는 유저인지 파악
        Promise.all([
          User.findOne({username: from}),
          User.findOne({username: to}),
        ]).then((users) => {
          const [fromUser, toUser] = users;
          if (fromUser.length !== 0 && toUser.length !== 0) {
            // 존재하는 유저라면

            Promise.all([
              PrivateMessage.find({sender: fromUser._id, receiver: toUser._id}),
              PrivateMessage.find({sender: toUser._id, receiver: fromUser._id}),
            ]).then((messages) => {
              const [fromMsg, toMsg] = messages;
              const message = [...fromMsg, ...toMsg]
            
              const dateSort = (a, b) => {
                if(a.createdDate == b.createdDate) { return 0 } return a.createdDate > b.createdDate ? 1: -1;
              }

              message.sort(dateSort);

              io.to(socket.id).emit('private get message', (message))
            })

          } else {
            // 존재하지 않는 유저라면
            console.log('존재하지 않는 유저입니다.');
          }
        })
        
      })

      // 연결 끊겼을때
      socket.on('disconnect', () => {
          PublicRoom.deleteOne({socketId: socket.id}, (err) => {
            if (err) throw err;
            else {
              console.log('user disconnected: ', socket.id);
              getClientList()
            }
          })
      })
  })
}