// 分类路由
const express = require('express')

// 创建路由对象
const router = express.Router()

router.get('/', (req, res) => {
  res.sendResult('获取商品分类', 200, 'success')
})

module.exports = router