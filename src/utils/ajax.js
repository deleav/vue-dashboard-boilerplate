import merge from 'lodash/merge'

const request = ({
  url,
  method,
  headers,
  body,
}) => {
  url = '/api' + url

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  headers = merge(
    {},
    headers,
    !isFormData && {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  )

  return fetch(`${url}`, {
    method,
    headers,
    body: JSON.stringify(body),
  }).then(res => {
    if (res.ok) return res.json()
    throw new Error(res)
  })
}

const ajax = method => options => {
  return request({
    ...options,
    method,
  })
}

export default {
  delete: ajax('DELETE'),
  get: ajax('GET'),
  post: ajax('POST'),
  put: ajax('PUT'),
}
