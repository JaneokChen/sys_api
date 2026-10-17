const express = require('express')
const resExtra = require('./modules/resExtra')
const path = require('path')
const mount = require('mount-routes')
const bodyParser = require('body-parser')

const sys_passport = require('./modules/passport')
const managerService = require(path.join(process.cwd(), 'services/manager_service')) // 获取管理员逻辑模块
const roleService = require(path.join(process.cwd(), 'services/role_service'))
const authorization = require(path.join(process.cwd(), '/modules/authorization'))
const database = require('./modules/db')

const app = express()
app.use(resExtra)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/sysapi/login', sys_passport.login)
app.use('/sysapi/*', sys_passport.tokenAuth)

database.init(app, function (err) {
  if (err) {
    console.error('连接数据库失败 %s', err)
  }
})

sys_passport.setup(app, managerService.login)

// 设置全局权限
authorization.setAuthFn(function (req, res, serviceName, actionName, passFn) {
  if (!req.usreInfo || Number.isNaN(parseInt(req.userInfo.rid))) {
    return res.sendResult('无角色 ID 分配')
  }

  // 验证权限
  roleService.authRight(req.userInfo.rid, serviceName, actionName, function (err, pass) {
    passFn(pass)
  })
  // const roleId = 0 // TODO: 外界传入
  // roleService.authRight(roleId, function (err, pass) {
  //   passFn(pass)
  // })
})

// 初始化路由（mount 函数中的第 3 个参数为 true，表示在控制台打印接口信息）
mount(app, path.join(process.cwd(), '/routes'), true)   // 找到“当前运行 Node 命令所在目录”下的 routes 文件夹，并加载里面的路由

app.get('/', (req, res) => {
  res.sendResult('welcome', 200, '获取成功')
})

// 未匹配到路由
app.use((req, res, next) => {
  res.sendResult(null, 404, 'not found')
})

app.listen(8088, () => {
  console.log('服务器地址 http://127.0.0.1:8088');
})

