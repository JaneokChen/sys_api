const path = require('path')

// 获取数据库模型
const databaseModule = require(path.join(process.cwd(), 'modules/db'))

/** 获取一条数据 
 * @param {String} modelName 模型名称
 * @param {Object} conditions 条件集合
 * @param {Function} cb 回调函数
*/
module.exports.findOne = function (modelName, conditions, cb) {
  const db = databaseModule.getDatabase();
  const model = db.models[modelName];
  if (!model) return cb('模型不存在', null);
  if (!conditions) return cb('条件为空', null);
  model.one(conditions, function (err, obj) {
    console.log(err)
    if (err) {
      return cb('查询失败', null)
    }
    return cb(null, obj)
  })
}