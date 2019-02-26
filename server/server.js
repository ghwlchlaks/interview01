const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const createError = require('http-errors');
const session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);
const passport = require('passport');

// controller files
const authRouter = require('./controller/auth');
const fileManagerRouter = require('./controller/fileManager');

const redis = require('./config/redis');
const mongoose = require('./config/mongoose');
const passportConfig = require('./config/passport');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('mongoose connection!');
});

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = socketIO(server);
require('./controller/chat')(io);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public/')));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'session',
    cookie: { maxAge: 1000 * 60 * 60 }, //유효시간 60분
    store: new RedisStore({
      client: redis
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use(express.static(path.join(__dirname, '..', 'public/')));

app.use('/api/auth', authRouter);
app.use('/api/fileManager', fileManagerRouter);

server.listen(PORT, () => {
  console.log(`Check out the app at http://localhost:${PORT}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send(err);
});

module.exports = server;
