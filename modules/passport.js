const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken')
const jwt_config = require('config').get('jwt_config')

// Token 验证策略
passport.use(new BearerStrategy(
  function (token, done) {
    const tokenG = jwt.sign({ 'uid': 'chen', "rid": 'chen' }, jwt_config.get('secretKey'), { "expiresIn": jwt_config.get('expiresIn') })
    const userToken = "Bearer" + tokenG;
    console.log('userToken', userToken);


    jwt.verify(token, jwt_config.get('secretKey'), function (err, decode) {
      if (err) { return done('token 验证错误') }
      return done(null, decode)
    })
    // if (token === 'aaa') {
    //   return done(null, '取得用户信息')
    // } else {
    //   return done('token 验证错误')
    // }
  }
))

// Token 验证函数
module.exports.tokenAuth = function (req, res, next) {
  passport.authenticate('bearer', { session: false },
    function (err, tokenData) {
      if (err) return res.sendResult(null, 400, '无效 token')
      if (!tokenData) return res.sendResult(null, 400, '无效 token')

      // next()
      // 返回仅仅是为了测试， 其它接口验证要放行
      return res.sendResult(tokenData, 200, 'success')
    })(req, res, next)
}