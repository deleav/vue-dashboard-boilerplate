import { stringify } from 'qs'

import { DEFAULT_PAGINATION_KEY, createDefaultPagination } from '@/store/utils/pagination'

export const getPaginationKey = options => stringify(options) || DEFAULT_PAGINATION_KEY

export const paginationSelector = (state, options) => state.paginations.get(
  getPaginationKey(options),
  createDefaultPagination(),
)

export const listSelector = (state, options) =>
  paginationSelector(state, options).get('index')
    .reduce((acc, id) => { acc.push(state.store.get(id.toString())); return acc }, [])
