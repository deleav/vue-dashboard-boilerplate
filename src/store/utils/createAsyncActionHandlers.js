import merge from 'lodash/merge'

export default (types, handlers) => {
  const actionTypes = Array.isArray(types)
    ? types
    : typeof types === 'object'
      ? [ types ]
      : []

  return actionTypes.reduce((actions, types) => Object
    .keys(types)
    .reduce((res, key) => merge(res, { [types[key]]: handlers[key] }), actions), {})
}
