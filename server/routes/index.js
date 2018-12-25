const Router = require('koa-router')
const router = new Router()

const config = require('../../config')

const api = require('./api')

router.use(config.server.apiPrefix, api)

module.exports = router.routes()
