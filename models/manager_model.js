module.exports = function (db, callback) {
  // 管理员模型
  db.define('manager_model', {
    mg_id: { type: 'serial', key: true },
    mg_name: String,
    mg_pwd: String,
    mg_time: Number,
    role_id: Number,
    mg_mobile: String,
    mg_email: String,
    mg_state: Number
  }, {
    table: 'manager'
  })
  return callback()
}