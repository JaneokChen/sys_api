const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require("passport-http-bearer").Strategy
var jwt = require("jsonwebtoken")
var jwt_config = require('config').get("jwt_config")


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

  // token校验策略
  passport.use(new BearerStrategy(
    function (token, done) {
      // 查询token是否有效
      // if (token === "aaa") {
      //     done(null, "获取到用户信息")
      // } else {
      //     done("token验证错误")
      // }
      jwt.verify(token, jwt_config.get("secretKey"), function (err, decode) {
        if (err) return done("token验证错误");
        return done(null, decode)
      })
    }
  ))


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

    const token = jwt.sign({ 'uid': req.username, "rid": req.username }, jwt_config.get('secretKey'), { "expiresIn": jwt_config.get('expiresIn') })

    user.token = 'Bearer' + token
    return res.sendResult(user, 200, '登录成功')
  })(req, res, next)
}

// Token 验证函数
module.exports.tokenAuth = function (req, res, next) {
  passport.authenticate('bearer', { session: false },
    function (err, tokenData) {
      if (err) return res.sendResult(null, 400, '无效 token')
      if (!tokenData) return res.sendResult(null, 400, '无效 token')

      next()
      // 返回仅仅是为了测试， 其它接口验证要放行
      // return res.sendResult(tokenData, 200, 'success')
    })(req, res, next)
}