export const createAsyncAction = (asyncTypes, ajax, metaCreator) => (ctx, options = {}) => {
  const meta = metaCreator && metaCreator(options)
  ctx.commit(asyncTypes.REQUEST, { meta })

  return ajax(options).then(res => {
    ctx.commit(asyncTypes.SUCCESS, { payload: res, meta })
    return res
  }).catch(err => {
    ctx.commit(asyncTypes.FAILURE, { payload: err, meta })
    return { err }
  })
}
