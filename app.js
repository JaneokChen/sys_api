const express = require('express')
const resExtra = require('./modules/resExtra')
const path = require('path')
const mount = require('mount-routes')
const sys_passport = require('./modules/passport')

const app = express()
app.use(resExtra)

// 初始化路由（mount 函数中的第 3 个参数为 true，表示在控制台打印接口信息）
mount(app, path.join(process.cwd(), 'routes'), true)   // 找到“当前运行 Node 命令所在目录”下的 routes 文件夹，并加载里面的路由

app.get('/', (req, res) => {
  // res.send('welcome')
  res.sendResult('welcome', 200, '获取成功')
})

// Token 验证，仅作为测试，后续将作为中间件挂载到其它路由上
app.get('/auth', sys_passport.tokenAuth)

// 未匹配到路由
app.use((req, res, next) => {
  res.sendResult(null, 404, 'not found')
})

app.listen(8088, () => {
  console.log('服务器地址 http://127.0.0.1:8088');
})

