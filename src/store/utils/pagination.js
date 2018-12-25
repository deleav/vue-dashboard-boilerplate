import { fromJS, Map, OrderedMap, OrderedSet } from 'immutable'
import identity from 'lodash/identity'
import merge from 'lodash/merge'

import mergeRule from './mergeRule'
import createAsyncActionHandlers from './createAsyncActionHandlers'

export const DEFAULT_PAGINATION_KEY = 'default'

export const initialPaginatableState = {
  error: null,
  paginations: new Map(),
  store: new OrderedMap(),
}

export const createDefaultPagination = () => new Map({
  error: false,
  loading: false,
  noMore: false,
  index: new OrderedSet(),
})

const updateStore = (store, payload, { transformer = identity } = {}) => {
  const id = payload.id + ''
  const immutablePayload = fromJS(transformer(payload))

  return store.set(id, store.get(id, immutablePayload).mergeWith(mergeRule, immutablePayload))
}

const updateStoreList = (store, payload, options = {}) => store.withMutations(store => {
  payload.forEach(item => {
    updateStore(store, item, options)
  })
})

const listAsyncActionHandlers = (options = {}) => ({
  REQUEST: (state, {
    meta: { key = DEFAULT_PAGINATION_KEY, refresh = false } = {},
  }) => {
    const pagination = state.paginations.get(key, createDefaultPagination())

    merge(state, {
      error: null,
      paginations: state.paginations.set(key, pagination.merge({
        loading: true,
        index: refresh ? new OrderedSet() : pagination.get('index'),
      })),
    })
  },

  SUCCESS: (state, {
    payload,
    meta: { key = DEFAULT_PAGINATION_KEY, forward = false } = {},
  }) => {
    const pagination = state.paginations.get(key, createDefaultPagination())

    if (options.cloneItemOnList) {
      const { builder, finder } = options.cloneItemOnList
      const targetIndex = payload.findIndex(finder)

      // insert new cloned item into payload
      if (targetIndex !== -1) {
        payload.splice(targetIndex + 1, 0, builder(payload[targetIndex]))
      }
    }

    merge(state, {
      error: null,
      paginations: state.paginations.set(key, pagination.merge({
        loading: false,
        noMore: !payload.length,
        index: forward
          ? new OrderedSet(payload.map(item => item.id + '')).concat(pagination.get('index'))
          : pagination.get('index').concat(payload.map(item => item.id + '')),
      })),
      store: updateStoreList(state.store, payload, options),
    })
  },

  FAILURE: (state, {
    payload,
    meta: { key = DEFAULT_PAGINATION_KEY },
  }) => {
    const pagination = state.paginations.get(key, createDefaultPagination())

    merge(state, {
      error: payload,
      paginations: state.paginations.set(key, pagination.merge({
        error: true,
        loading: false,
      })),
    })
  },
})

const updateAsyncActionHandlers = options => ({
  REQUEST: (state, { payload }) => merge(state, {
    store: updateStore(state.store, {
      ...payload,
      error: null,
      loading: true,
    }),
  }),

  SUCCESS: (state, { payload }) => merge(state, {
    error: null,
    store: updateStore(state.store, {
      ...payload,
      error: null,
      loading: false,
    }, options),
  }),

  FAILURE: (state, { payload }) => merge(state, {
    store: updateStore(state.store, {
      error: payload,
      loading: false,
    }, options),
  }),
})

export const createPaginationReducers = (types, options) => ({
  ...createAsyncActionHandlers(types.list, listAsyncActionHandlers(options)),
  ...createAsyncActionHandlers(types.update, updateAsyncActionHandlers(options)),
})
