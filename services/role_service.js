const path = require('path')
const permissionApiDao = require(path.join(process.cwd(), 'dao/permission_api_dao'))

module.exports.authRight = function (rid, serviceName, actionName, cb) {
  permissionApiDao.authRight(rid, serviceName, actionName, function (err, pss) {
    cb(err, pass)
  })
  // // TODO: 先写死，后续查询更具数据库角色权限进行判断
  // if (rid === 0) {
  //   cb(null, true)
  // } else {
  //   cb('无接口访问权限', false)
  // }
}

