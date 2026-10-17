module.exports = function (db, callback) {
  // 角色模型
  db.define('role_model', {
    role_id: { type: 'serial', key: true },
    role_name: String,
    ps_ids: String,
    ps_ca: String,
    role_desc: String
  }, {
    table: 'role'
  })

  return callback()
}