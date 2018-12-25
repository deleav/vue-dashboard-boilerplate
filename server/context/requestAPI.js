const Request = require('request')
const PromiseRequest = require('request-promise-native')
const upperCase = require('lodash/upperCase')

const config = require('../../config')

const defaultConfig = {
  baseUrl: config.api.host,
  gzip: true,
  json: true,
  resolveWithFullResponse: true,
}
const request = Request.defaults(defaultConfig)
const promiseRequest = PromiseRequest.defaults(defaultConfig)

module.exports = async (requestOptions, { ctx } = {}) => {
  // avoid to send a non POST or PUT request with body
  if (![ 'POST', 'PUT' ].includes(upperCase(requestOptions.method))) {
    delete requestOptions.body
  }

  if (requestOptions.pipe) {
    ctx.body = ctx.req
      .pipe(request(requestOptions))
      .on('response', response => {
        ctx.status = response.statusCode
      })

    return
  }

  const res = await promiseRequest(requestOptions)

  return res
}
