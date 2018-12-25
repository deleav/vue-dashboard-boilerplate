const Router = require('koa-router')
const router = new Router()

const config = require('../../../config')

const API_PREFIX_REGEX = new RegExp(`^\\${config.server.apiPrefix}`)

router.all('/*', async (ctx, next) => {
  const endpoint = ctx.originalUrl.replace(API_PREFIX_REGEX, '')

  const response = await ctx.requestAPI({
    body: ctx.request.body,
    headers: Object.assign({
      'X-Forwarded-For': ctx.ip,
    }),
    method: ctx.request.method,
    pipe: true,
    uri: endpoint,
  }, { ctx })

  if (response) ctx.render(response.statusCode, response)
})

module.exports = router.routes()
