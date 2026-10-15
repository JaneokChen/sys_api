const path = require('path')
const databaseModule = require(path.join(process.cwd(), 'modules/db')) // 获取数据库模型
const logger = require('../modules/logger').logger()

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
      logger.debug(err)
      return cb('查询失败', null)
    }
    return cb(null, obj)
  })
}

module.exports.list = function (modelName, conditions, cb) {
  var db = databaseModule.getDatabase();
  var model = db.models[modelName];
  if (!model) return cb("模型不存在", null)
  if (conditions) {
    // console.log(444444444444444)
    if (conditions["columns"]) {
      model = model.find(conditions["columns"])
    } else {
      model = model.find();
    }
    if (conditions["offset"]) {
      model = model.offset(parseInt(conditions["offset"]))
    }
    if (conditions["limit"]) {
      model = model.limit(parseInt(conditions["limit"]))
    }
    if (conditions["only"]) {
      model = model.only(conditions["only"]);
    }
    if (conditions["omit"]) {
      model = model.omit(conditions["omit"]);
    }
    if (conditions["order"]) {
      model = model.order(conditions["order"]);
    }

  } else {
    model = model.find();
  }

  model.run(function (err, models) {
    if (err) {
      return cb("查询失败", null)
    }
    cb(null, models)
  })
}
