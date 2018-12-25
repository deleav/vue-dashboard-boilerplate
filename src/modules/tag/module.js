import { initialPaginatableState, createPaginationReducers } from '@/store/utils/pagination'
import api from './api'
import types from '@/constants/actionTypes'
import { createAsyncAction } from '@/store/utils/actions'
import { getPaginationKey } from '../common/selector'

export default {
  namespaced: true,
  state: {
    ...initialPaginatableState,
  },
  mutations: {
    ...createPaginationReducers({
      list: [ types.LIST_TAG ],
    }),
  },
  actions: {
    listTag: createAsyncAction(types.LIST_TAG, api.listTag, options => ({
      key: getPaginationKey(options),
    })),
  },
}
