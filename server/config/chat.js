
const User = require('../models/users');
const {PublicRoom} = require('../models/messages')

module.exports = function(io) {
  // 클라이언트가 접속 했을때의 이벤트
  io.on('connection', (socket) => {
      console.log('user connected: ', socket.id);


      // 로그인시 참여자로 설정
      socket.on('enter public room', (username) => {
        console.log('username : ' + username );
        console.log('socket id : ' + socket.id);

        User.findOne({username: username}, (err, user) => {
          if(err) throw err;
          if(!user) console.log('존재하는 유저가 아닙니다.');
          else {

            //유저가 존재하면 publicRoom에 참여자로 저장
            const publicRoom = new PublicRoom({
              username: username,
              socketId: socket.id,
              userId: user._id,
              accessTime: Date.now()
            });

            // const publicRoom = new PublicRoom()
            // publicRoom.participants.push({
            //   socketId: socket.id,
            //   userId: user._id,
            //   accessTime: Date.now
            // })

            publicRoom.save((err) => {
              if (err) throw err;
              // 참여자로 저장이 됐다면
              io.emit('success public room')
            })
          }
        })
      })
      
      // 참여자 목록
      socket.on('get all users', () => {
        console.log('get all users : ' + socket.id);
        const query = PublicRoom.find().ne('socketId', socket.id);
        query.exec((err, allUsers) => {
          console.log(allUsers)
          //자신을 제외한 모든 유저 정보 보내기
          io.emit('success get users', allUsers);
        })
        
      })

      // 클라이언트에게 전체 메시지를 받으면
      socket.on('allSendMsg', (msg) => {
          io.emit('receive message', msg);
      })

      // 연결 끊겼을때
      socket.on('disconnect', () => {
          console.log('user disconnected: ', socket.id);
      })
  })
}