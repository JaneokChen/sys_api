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
      // global.service_caches[serviceName][actionName] = origFunc;
      global.service_caches[serviceName][actionName] = Invocation(serviceName, serviceModule, origFunc)
      console.log('action -> %s', actionName)
    }
  }

  // console.log(global.service_caches)
  console.log('***************\n')
  return global.service_caches[serviceName]
}

/** 构造回调对象格式
 * @param serviceName 服务名称
 * @param serviveModule 服务模块
 * @param origFunc 原始方法
 */
function Invocation(serviceName, serviceModule, origFunc) {
  return function () {
    const origArguments = arguments
    if (global.service_auth_fn) {
      global.service_auth_fn(function (pass) {
        if (pass) {
          origFunc.apply(serviceModule, origArguments)
        } else {
          // TODO: 使用 res 对象返回数据
          console.log('无权限')
        }
      })
    } else {
      console.log('未设置权限验证函数')
    }
  }
}