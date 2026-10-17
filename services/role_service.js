module.exports.authRight = function (rid, cb) {
  // TODO: 先写死，后续查询更具数据库角色权限进行判断
  if (rid === 0) {
    cb(null, true)
  } else {
    cb('无接口访问权限', false)
  }
}

