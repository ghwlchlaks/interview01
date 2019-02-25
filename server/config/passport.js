const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("../models/users");

module.exports = () => {
  //로그인시 세션저장
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // 세션 정보 비교
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // 로그인 전략
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        session: true,
        passReqToCallback: true
      },
      (req, username, password, done) => {
        const userData = req.body;
        Users.findOne({ username: userData.username }, (findError, user) => {
          if (findError) return done(findError);
          if (!user)
            return done(null, false, { message: "존재하지않는 아이디" });
          if (!user.comparePassword(userData.password, user.password))
            return done(null, false, { message: "비밀번호가 다릅니다." });
          Users.updateOne(
            { username: user.username },
            {
              currentDate: Date.now()
            },
            (updateError, updateResult) => {
              if (updateError) return done(updateError);
              return done(null, user);
            }
          );
        });
      }
    )
  );

  // 회원가입 전략
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, username, password, done) => {
        const userData = req.body;
        Users.findOne(
          { $or: [{ username: userData.username }, { email: userData.email }] },
          (findError, user) => {
            if (findError) return done(findError);
            if (user)
              return done(null, false, {
                message: "존재하는 아이디 혹은 이메일입니다."
              });
            const newUser = new Users();
            newUser.username = userData.username;
            newUser.password = newUser.generateHash(userData.password);
            newUser.email = userData.email;
            newUser.sex = userData.sex;
            newUser.save(saveError => {
              if (saveError) throw saveError;
              return done(null, newUser);
            });
          }
        );
      }
    )
  );
};
