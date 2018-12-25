const merge = require('lodash/merge')

const config = {
  app: {
    name: 'dashboard-boilerplate',
    instances: 1,
  },
  server: {
    apiPrefix: process.env.SERVER_API_PREFIX || '/api',
    cookieKey: process.env.SERVER_COOKIE_KEY || 'secretsecret',
    host: process.env.SERVER_HOST || 'localhost',
    port: +process.env.SERVER_PORT || 3200,
  },
  api: {
    host: process.env.API_HOST,
  },
}

const env = process.env.NODE_ENV || 'development'

try {
  merge(config, require('./' + env))
} catch (err) {
  console.log('Failed to load config:', env)
}

module.exports = config
