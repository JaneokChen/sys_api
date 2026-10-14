require('mysql2') // 为 ORM 提供驱动
const orm = require('orm')
const path = require('path')
const fs = require('fs')
const Promise = require('bluebird')

const config = require('config').get('db_config') // 加载数据库配置

// 初始化数据库连接
function init(app, callback) {
  // 组装数据库连接参数
  const db_opts = {
    protocol: config.get('protocol'),
    host: config.get('host'),
    port: config.get('port'),
    database: config.get('database'),
    user: config.get('user'),
    password: config.get('password'),
    query: { pool: true, debug: true }
  }
  console.log("数据库连接信息：%s", JSON.stringify(db_opts));

  // 初始化 ORM 模型
  app.use(orm.express(db_opts, {
    define: function (db, models, next) {
      // 获取映射文件路径
      const modelsPath = path.join(process.cwd(), '/models')

      // 读取所有模型文件
      const loadModelAsyncFns = new Array() // 存放所有的加载模型函数
      fs.readdir(modelsPath, function (err, files) {
        for (let i = 0; i < files.length; i++) {
          const modelPath = modelsPath + '/' + files[i]
          loadModelAsyncFns[i] = db.loadAsync(modelPath)
        }
      })

      Promise.all(loadModelAsyncFns)
        .then(function () {
          // console.log('ORM 模型加载完成')
          callback(null)
          next()
        })
        .catch(function (err) {
          console.error('加载模块出错 error' + err)
          callback(error)
          next()
        })

      global.database = db
    }
  }))
}

module.exports.init = init
module.exports.getDatabase = function () {
  return global.database
}
