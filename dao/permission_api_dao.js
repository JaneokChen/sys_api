const path = require('path')
const daoModule = require('./dao')


module.exports.authRight = function (rid, serviceName, actionName, cb) {
  // 超级管理员
  if (rid === 0) return cb(null, true);

  // 权限验证
  daoModule.findOne('permission_api_model'), {
    'ps_api_service': serviceName,
    'ps_api_action': actionName,
  }, function (err, permissionAPI) {
    console.log('rid: %s, serviceName: %s, actionName: %s', rid, serviceName, actionName)
    if (err || !permissionAPI) return cb('无权限访问', false);

    daoModule.findOne('role_model', { 'role_id': rid }, function (err, role) {
      console.log('role');
      if (err || !role) return cb('获取角色信息失败', false);

      const ps_ids = role.ps_ids.split(',')
      for (idx in ps_ids) {
        ps_id = ps_ids[idx];
        if (parseInt(permissionAPI.ps_id) === parseInt(ps_id)) {
          return cb(null,)
        }
      }
      return cb('无权限访问', false)
    })
  }
}