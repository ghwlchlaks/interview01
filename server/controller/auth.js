const express = require("express");
const router = express.Router();
const passport = require("passport");

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.status(200).send({ status: false, msg: "unauthorized" });
};

/* GET home page. */
router.get("/", isAuthentication, (req, res) => {
  res.status(200).send({ status: true, msg: req.user.username });
});

// 로그인
router.put("/login", (req, res) => {
  passport.authenticate("login", (err, user, info) => {
    if (err)
      return res.status(500).send({ status: false, msg: "login server error" });
    if (!user) {
      return res.status(200).send({ status: false, msg: info });
    } else {
      req.login(user, err => {
        if (err)
          return res
            .status(500)
            .send({ status: false, msg: "login sessin save error" });
      });
      return res.status(200).send({ status: true, msg: "로그인성공" });
    }
  })(req, res);
});

//회원가입
router.post("/signup", (req, res) => {
  passport.authenticate("signup", (err, user, info) => {
    if (err)
      return res.status(500).send({ status: false, msg: "login server error" });
    if (!user) {
      return res.status(200).send({ status: false, msg: info });
    } else {
      return res.status(200).send({ status: true, msg: "회원가입 성공" });
    }
  })(req, res);
});

// 로그아웃
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).send({ status: true, msg: "logout success" });
});

module.exports = router;
