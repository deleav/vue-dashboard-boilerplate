import ajax from '@/utils/ajax'
import { stringify } from 'qs'

export default {
  listTag: ({ id: topicId, ...options } = {}) =>
    topicId
      ? ajax.get({ url: `/v1/topics/${topicId}/tags` })
      : ajax.get({ url: `/v1/tags?${stringify(options)}` }),
}
