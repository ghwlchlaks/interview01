const express = require('express');
const path = require('path');
const os = require("os");
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = socketIO(server);

// 클라이언트가 접속 했을때의 이벤트
io.on('connection', (socket) => {
    console.log('user connected');

    // 클라이언트에게 전체 메시지를 받으면
    socket.on('allSendMsg', (msg) => {
        console.log('send to : ' + msg);
        io.emit('allSendMsg', msg);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

app.use(express.static(path.join(__dirname, '..', 'public/')));

// if you need api routes add them here
app.get("/api/getUsername", function(req, res, next){
res.send({ username: os.userInfo().username });
});

server.listen(PORT, () => {
console.log(`Check out the app at http://localhost:${PORT}`);
});
