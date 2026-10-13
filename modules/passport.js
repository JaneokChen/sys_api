const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// 初始化 passport 中间件，将登录函数提取出来放在外层控制
module.exports.setup = function (app, loginFunc, callback) {
  // local 验证策略
  passport.use(new LocalStrategy(
    function (username, password, done) {
      // done 是 authenticate 的回调函数
      if (!loginFunc) return done('登录验证函数未设置');
      loginFunc(username, password, function (err, user) {
        if (err) return done(err);
        return done(null, user);
      })
    }
  ))

  // Token 验证策略

  // 初始化 passport 模块
  // app.use(passport.initialize())

  if (callback) callback()
}


// 登录验证逻辑
module.exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    console.log(err, user, info);
    if (err) return res.sendResult(null, 400, err);
    if (!user) return res.sendResult(null, 400, '参数错误')

    // 临时写死
    const token = 'aaa'
    user.token = 'Bearer' + token
    return res.sendResult(user, 200, '登录成功')
  })(req, res, next)
}