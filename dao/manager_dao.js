const path = require('path')
const daoModule = require('./dao')

/** 通过查询条件获取管理员对象
 * @param {Object} conditions 条件
 * @param {Function} cb 回调函数
 */
module.exports.findOne = function (conditions, cb) {
  daoModule.findOne('manager_model', conditions, cb)
}