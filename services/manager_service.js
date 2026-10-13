// 管理员登录 
module.exports.login = function (username, passport, cb) {
  // 暂时写死作为演示，后续从数据库中读取
  const tempuser = {
    username: '123',
    password: '123'
  }

  if (username !== tempuser.username) {
    return cb('用户名不存在')
  }

  if (username !== tempuser.password) {
    return cb('密码不正确')
  }

  // 模拟从数据库查询中返回用户信息
  const user = {
    username: '123',
    id: 0,
    rid: 1
  }

  return cb(null, user)
}