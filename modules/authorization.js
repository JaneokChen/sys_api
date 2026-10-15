const path = require('path')

// 全局服务模块
global.service_caches = {}

// 存储全局验证函数
global.service_auth_fs = null

// 设置全局验证函数
module.exports.setAuthFn = function (authFn) {
  global.service_auth_fn = authFn
}

// 获取服务对象
module.exports.getService = function (serviceName) {
  if (global.service_caches[serviceName]) {
    return global.service_caches[serviceName]
  }

  const serviceModule = require(path.join(process.cwd(), 'services', serviceName))
  if (!serviceModule) {
    console.log('没有发现模块');
    return null
  }

  global.service_caches[serviceName] = {}

  console.log('***************')
  console.log('拦截服务 -> %s', serviceName)
  console.log('***************')

  for (actionName in serviceModule) {
    if (serviceModule && serviceModule[actionName] && typeof (serviceModule[actionName]) === 'function') {
      const origFunc = serviceModule[actionName]
      // todo: 根据角色权限拦截方法
      global.service_caches[serviceName][actionName] = origFunc;
      console.log('action -> %s', actionName)
    }
  }

  // console.log(global.service_caches)
  console.log('***************\n')
  return global.service_caches[serviceName]
}