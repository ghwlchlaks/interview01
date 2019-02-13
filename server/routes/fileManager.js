const express = require('express');
const router = express.Router();

const Users = require('../models/users');

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.send({stats: false, msg: '로그인 필요'});
}

/* GET home page. */
router.post('/upload', async (req, res) => {
})

module.exports = router;
