'use strict'

const config = require('./config')

module.exports = {
  apps: [
    {
      name: config.app.name,
      script: './index.js',
      instances: config.app.instances,
      exec_mode: 'cluster', // eslint-disable-line
      merge_logs: true // eslint-disable-line
    },
  ],
}
