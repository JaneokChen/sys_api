const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// 写死固定用户作为演示
const user = {
  username: '123',
  password: '123'
}

// local 验证策略
passport.use('local', new LocalStrategy(
  function (username, password, done) { // done 为 authenticate 的回调函数
    if (username !== user.username) {
      return done(null, false, { message: '用户名不正确' })
    }

    if (password !== user.password) {
      return done(null, false, user)
    }

    // 验证成功后， 传入后面的流程
    return done(null, true, user)
  }
))

module.exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, suc, obj) {
    console.log(err, suc, obj);
    if (suc) {
      return res.sendResult(obj, 200, '获得成功')
    } else {
      return res.sendResult(null, 500, obj.message)
    }
  })(req, res, next)
}

