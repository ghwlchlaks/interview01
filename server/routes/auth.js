const express = require('express');
const router = express.Router();
const passport = require('passport');

const Users = require('../models/users');

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.status(200).send({status: false, msg: 'unauthorized'});
}

/* GET home page. */
router.get('/',isAuthentication, (req, res) => {
  res.status(200).send({status: true, msg: req.user.username});
});

router.put('/login', (req, res,) =>{
  passport.authenticate('login', (err, user, info) => {
    if (err) return res.status(500).send({status: false, msg: 'login server error'})
    if (!user) {
      return res.status(200).send({status: false, msg: info})
    } else {
      req.login(user, err => {
        if (err) return res.status(500).send({status: false, msg: 'login sessin save error'})
      })
      return res.status(200).send({status: true, msg: '로그인성공'});
    }
  })(req, res)
})

router.post('/signup', (req, res) => {
  passport.authenticate('signup', (err, user, info) => {
    if (err) return res.status(500).send({status: false, msg: 'login server error'})
    if (!user) {
      return res.status(200).send({status: false, msg: info});
    } else {
      return res.status(200).send({status: true, msg: '회원가입 성공'})
    }
  })(req, res)
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
