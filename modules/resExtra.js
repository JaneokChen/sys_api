// 统一返回结果的中间件（封装返回 JSON）
module.exports = function (req, res, next) {
  res.sendResult = function (data, code, message) {
    const fmt = req.query.fmt ? req.query.fmt : 'rest'
    if (fmt === 'rest') {
      res.json({
        "data": data,
        "meta": {
          "msg": message,
          "status": code
        }
      })
    }
  }

  next()
}