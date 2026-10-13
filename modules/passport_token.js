const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy

// 写死几个固定的 Token 作为演示
const tokens = {
  'aaa': { name: 'aaa' },
  'bbb': { name: 'bbb' }
}

// Token 验证策略
passport.use(new BearerStrategy(
  function (token, done) {
    console.log('passport.use', tokens[token]);


    // 这里查询 Token 是否有效
    if (tokens[token]) {
      // 如果有效，则将 done 方法的第二个参数传递用户对象，然后路由的 req.user 对象即为当前对象
      done(null, tokens[token])
    } else {
      done(null, false)
    }
  }
))


// module.exports = passport.authenticate('bearer', {session: false})
module.exports.tokenAuth = function (req, res, next) {
  console.log('tokenAuth');
  passport.authenticate('bearer', { session: false },
    function (err, tokenData) {
      console.log('authenticate');
      console.log(err, tokenData);
      if (err) return res.sendResult(null, 400, '无效 token');
      if (!tokenData) return res.sendResult(null, 400, '无效 token')
      // next()
      return res.sendResult(tokenData, 200, 'success')
    }
  )(req, res, next)
}
