const express = require('express');
const router = express.Router();
const passport = require('passport');

const Users = require('../models/users');

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.send({stats: false, msg: '로그인 필요'});
}

/* GET home page. */
router.get('/',isAuthentication, (req, res) => {
  res.status(200).send('login success ' + req.user.username);
});

router.put('/login', passport.authenticate('login'),
  (req, res) => {
  res.status(200).send({status: true, msg: req.user.username});
})

router.post('/signup', passport.authenticate('signup'),
 (req, res) => {
  res.status(200).send({status: true, msg: req.user.username});
})

router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send({status: true, msg:'logout success'});
})

router.put('/update', isAuthentication, async (req, res) => {
  try {
    const newData = req.body;
    const oldData = req.user;
    let user = await Users.findOne({username: oldData.username});
    user.password = user.generateHash(newData.password);
    user.updateDate = Date.now();
    user = await user.save();
    req.login(user, (err) => {
      if (err) throw err;
    });
    res.status(200).send({status: true, msg: '갱신 성공'});
  } catch (err) {
    console.error(err);
    res.status(500).send({status : false, msg: '에러 발생'});
  }
})

module.exports = router;
