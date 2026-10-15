var path = require("path")
var dao = require(path.join(process.cwd(), "dao/DAO"))
var _ = require("lodash")

/**
 * 添加分类
 * @param {*} cat 分类数据
 * *{
 * cat_pid  父类id（如果是根类就是）
 * cat_name  分类名称
 * cat_level 层级（顶层0）
 * }
 * @param {*} cb 
 */
module.exports.addCategory = function (cat, cb) {
  dao.create("CategoryModel", {
    "cat_pid": cat.cat_pid, "cat_name": cat.cat_name,
    "cat_level": cat.cat_level
  }, function (err, newCat) {
    if (err) return cb("创建分类失败")
    cb(null, newCat);
  })
}

/**
 * 获取所有商品分类
 * @param {*} type 层级
 * @param {*} conditions 条件 
 * @param {*} cb 回调函数
 */
module.exports.getAllCategories = function (type, conditions, cb) {
  dao.list("CategoryModel", { "cat_deleted": false }, function (err, categories) {
    var keyCategories = _.keyBy(categories, "cat_id")
    if (!type) type = 3;
    //转化为树形菜单
    result = getTreeResult(keyCategories, categories, type)
    if (conditions) {
      count = result.length;
      pagesize = parseInt(conditions.pagesize)
      pagenum = parseInt(conditions.pagenum) - 1
      result = _.take(_.drop(result, pagenum * pagesize), pagesize)
      var resultDta = {};
      resultDta["total"] = count;
      resultDta["pagenum"] = pagenum;
      resultDta["pagesize"] = pagesize;
      resultDta["result"] = result;
      return cb(null, resultDta)
    }
    cb(null, result)
  })
}

/**
 * 获取树状结果
 * @param  {[type]} keyCategories [description]
 * @return {[type]}               [description]
 */
function getTreeResult(keyCategories, categories, type) {
  var result = [];
  for (idx in categories) {
    var cat = categories[idx];
    // 判断是否被删除
    if (isDelete(keyCategories, cat)) continue;
    if (cat.cat_pid == 0) {
      result.push(cat);
    } else {
      if (cat.cat_level >= type) continue;
      var parantCat = keyCategories[cat.cat_pid];
      if (!parantCat) continue;
      if (!parantCat.children) {
        parantCat["children"] = [];
      }
      parantCat.children.push(cat);
    }
  }
  return result;
}

/**
 * 判断是否删除
 * 
 * @param  {[type]}  keyCategories 所有数据
 * @param  {[type]}  cat           [description]
 * @return {Boolean}               [description]
 */
function isDelete(keyCategories, cat) {
  if (cat.cat_pid == 0) {
    return cat.cat_deleted;
  } else if (cat.cat_deleted) {
    return true;
  } else {
    parentCat = keyCategories[cat.cat_pid];
    if (!parentCat) return true;
    return isDelete(keyCategories, parentCat);
  }
}

/**
 * 获取指定id的分类对象
 * @param {*} id 分类id
 * @param {*} cb 回调函数
 */
module.exports.getCategoryById = function (id, cb) {
  dao.show("CategoryModel", id, function (err, category) {
    if (err) return cb("获取分类对象失败")
    cb(null, category)
  })
}

/**
 * 更新分类
 * 
 * @param  {[type]}   cat_id  分类ID
 * @param  {[type]}   newName 新的名称
 * @param  {Function} cb      回调函数
 */
module.exports.updateCategory = function (cat_id, newName, cb) {
  dao.update("CategoryModel", cat_id, { "cat_name": newName }, function (err, newCat) {
    if (err) return cb("更新失败")
    cb(null, newCat)
  })
}

/**
 * 删除分类(软删除)
 * 
 * @param  {[type]}   cat_id 分类ID
 * @param  {Function} cb     回调函数
 */
module.exports.deleteCategory = function (cat_id, cb) {
  dao.update("CategoryModel", cat_id, { "cat_deleted": true }, function (err, newCat) {
    if (err) return cb("删除失败")
    cb("删除成功")
  })
}