const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')

const { server } = require('../config')
const webpackConfig = require('../webpack.config')

const routes = require('./routes')
const requestAPI = require('./context/requestAPI')

const app = new Koa()
const router = new Router()

router.use(routes)
app.context.requestAPI = requestAPI

const listen = () => {
  app
    .use(router.routes())
    .use(router.allowedMethods())
  app.listen(server.port, () => {
    console.log(`\nlistening on http://${server.host}:${server.port}`)
  })
}

if (process.env.NODE_ENV !== 'production') {
  const koaWebpack = require('koa-webpack')

  koaWebpack({
    config: webpackConfig,
    devMiddleware: { logLevel: 'silent' },
  })
    .then(middleware => {
      app.use(middleware)

      // return index.html from memory
      router.get('*', async ctx => {
        const filename = path.resolve(webpackConfig.output.path, 'index.html')
        ctx.response.type = 'html'
        ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(filename)
      })

      listen()
    })
} else {
  app.use(serve('dist'))

  router.get('*', async (ctx, next) => {
    ctx.type = 'html'
    ctx.body = require('fs').createReadStream(path.resolve('dist/index.html'))
  })

  listen()
}
