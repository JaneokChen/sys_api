// 分类路由
const express = require('express')
const path = require('path')
const authorization = require(path.join(process.cwd(), '/modules/authorization'))  // 获取验证模块

// 通过验证模块获取分类管理
const categoryService = authorization.getService('category_service')

// 创建路由对象
const router = express.Router()

// 获取分类列表接口
router.get("/",
  function (req, res, next) {
    next()
  },
  function (req, res, next) {
    var conditions = null
    if (req.query.pagenum && req.query.pagesize) {
      conditions = {
        "pagenum": req.query.pagenum,
        "pagesize": req.query.pagesize
      };
    }

    categoryService.getAllCategories(req.query.type, conditions,
      function (err, result) {
        if (err) return res.sendResult(null, 400, "获取分类列表失败")
        res.sendResult(result, 200, "获取成功")
      })
  }
)

module.exports = router