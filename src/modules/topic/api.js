import ajax from '@/utils/ajax'
import { stringify } from 'qs'

export default {
  listTopic: options => ajax.get({
    url: `/v1/topics?${stringify(options)}`,
  }),
  getTopic: ({ id }) => ajax.get({
    url: `/v1/topics/${id}/tags`,
  }),
  updateTopic: ({ id, tagIds }) => ajax.put({
    url: `/v1/topics/${id}`,
    body: { tagIds },
  }),
}
