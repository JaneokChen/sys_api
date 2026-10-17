module.exports = function (db, callback) {
  // 角色模型
  db.define('permission_api_model', {
    id: { type: 'serial', key: true },
    ps_ids: Number,
    ps_api_service: String,
    ps_api_action: String,
    ps_api_order: Number
  }, {
    table: 'permission_api'
  })

  return callback()
}