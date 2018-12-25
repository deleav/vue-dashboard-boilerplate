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
      list: [ types.LIST_TOPIC ],
      update: [ types.UPDATE_TOPIC ],
    }),
  },
  actions: {
    listTopic: createAsyncAction(types.LIST_TOPIC, api.listTopic, options => ({
      key: getPaginationKey(options),
    })),
    updateTopic: createAsyncAction(types.UPDATE_TOPIC, api.updateTopic),
  },
}
