import merge from 'lodash/merge'

const ACTION_TYPES = [
  // form
  'UPDATE_FROM',
]

const ASYNC_ACTION_TYPES = [
  // tag
  'LIST_TAG',

  // topic
  'LIST_TOPIC',
  'UPDATE_TOPIC',
]

export default {
  ...ACTION_TYPES.reduce((types, key) => merge(types, { [key]: key }), {}),
  ...ASYNC_ACTION_TYPES.reduce((types, key) => merge(types, {
    [key]: {
      REQUEST: key + '/REQUEST',
      SUCCESS: key + '/SUCCESS',
      FAILURE: key + '/FAILURE',
    },
  }), {}),
}
