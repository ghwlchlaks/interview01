const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const dbName = 'myProject';

const mongoose = require('mongoose');
const socketIO = require('socket.io');
const server = require('../server')
const io  = socketIO(server);

const {PublicMessage, PrivateMessage} = require('../models/messages')
const User = require('../models/users');

mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${dbName}`, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (err) throw err;

    // 클라이언트가 접속했을때의 이벤트
    // io.on('connection', (socket) => {
    //     console.log('user connection : ', socket.id)
        
    //     // 전체 채팅 보냈을때 이벤트
    //     socket.on('public message', (msg, from) => {
    //         console.log(`${from} 님이 ${msg} 메시지를 보냈습니다.`);

    //         // 유저 조회
    //         User.findOne({username: from}, (err, user) => {
    //             if (err) throw err;
    //             if (!user) console.log('해당 유저가 없습니다.');
    //             else {
    //                 // 유저 존재 한다면 
    //                 const publicMessage =  new PublicMessage({
    //                     sender : user._id,
    //                     message : msg, 
    //                     createDate : Date.now
    //                 })

    //                 // 메시지 저장
    //                 publicMessage.save((err) => {
    //                     if(err) throw err;

    //                     // 메시지 저장된다면 저장된 메시지 _id 값 push
    //                     user.publicMessages.push(publicMessage._id)
    //                     // user collection에 message _id값 저장
    //                     user.save((err) => {
    //                         if (err) throw err;

    //                         // 모든 저장이 끝난 후 클라이언트에게 socket 메시지 전송
    //                         io.emit('public message', msg, from);
    //                     })
    //                 })  
    //             } 
    //         })
    //     })

    //     // 귓속말 메시지 보냈을때 이벤트
    //     socket.on('private message', (msg, from, to) => {
    //         console.log(`${from} 님이 ${msg} 메시지를 ${to} 님에게 보냈습니다. `);
            
    //         // 송신자 검색
    //         User.findOne({username: from}, (err, sendUser) => {
    //             if (err) throw err;
    //             if (!sendUser) console.log('해당 송신자는 존재 하지 않습니다.');
    //             else {
    //                 // 송신자 유저가 존재하지 않다면 
    //                 // 수신자 유저 검색
    //                 User.findOne({username: to}, (err, receiveUser) => {
    //                     if(err) throw err;
    //                     if(!receiveUser) console.log('해당 수신자는 존재 하지 않습니다.');
    //                     else {
    //                         // 수신자 유저가 존재하면
    //                         const privateMessage = new PrivateMessage({
    //                             sender: sendUser._id,
    //                             message: msg, 
    //                             receiver: receiveUser._id,
    //                             createDate: Date.now
    //                         })

    //                         // private 메시지 저장
    //                         privateMessage.save((err) => {
    //                             if(err) throw err;
                                
    //                             // 보낸 사람의 privateMessage._id 저장
    //                             sendUser.privateMessages.push(privateMessage._id);
    //                             sendUser.save((err) => {
    //                                 if (err) throw err;

    //                                 // 모든 저장이 끝난 후
                                      
    //                             })
    //                         })
    //                     }
    //                 })
    //             }
    //         })
    //     })

    //     // 클라이언트가 접속을 끊었을때 이벤트
    //     socket.on('disconnect', () => {
    //         console.log('user dissconnected : ', socket.id);
    //     })
    // })

});

module.exports = mongoose;