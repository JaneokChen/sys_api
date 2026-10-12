const express = require('express')
const resExtra = require('./modules/resExtra')

const app = express()
app.use(resExtra)

app.get('/', (req, res) => {
  // res.send('welcome')
  res.sendResult('welcome', 200, '获取成功')
})

// 未匹配到路由
app.use((req, res, next) => {
  res.sendResult(null, 404, 'not found')
})

app.listen(8088, () => {
  console.log('服务器地址 http://127.0.0.1:8088');
})

