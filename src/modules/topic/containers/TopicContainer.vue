<script>
import { mapState, mapActions } from 'vuex'
import TopicList from '@/modules/topic/components/TopicList'
import { paginationSelector, listSelector } from '@/modules/common/selector'
import { OrderedMap } from 'immutable'
import debounce from 'lodash/debounce'

export default {
  name: 'topicContainer',
  data () {
    return {
      topicForm: {
        tagList: new OrderedMap(),
        topicSearchQuery: '',
        tagSearchQuery: '',
      },
      updateDisable: false,
    }
  },
  computed: {
    ...mapState('topic', {
      topic (state) {
        const query = this.topicForm.topicSearchQuery
        return {
          error: state.error,
          pagination: paginationSelector(state, { ...query && { query } }),
          list: listSelector(state, { ...query && { query } }),
        }
      },
    }),
    ...mapState('tag', {
      tag (state) {
        const { id } = this.$route.params
        return {
          error: state.error,
          pagination: paginationSelector(state, { id }),
          list: listSelector(state, { id }),
        }
      },
      allTag (state) {
        const query = this.topicForm.tagSearchQuery
        return {
          error: state.error,
          pagination: paginationSelector(state, { ...query && { query } }),
          list: listSelector(state, { ...query && { query } }),
        }
      },
    }),
  },
  methods: {
    ...mapActions('topic', {
      listTopic: 'listTopic',
      updateTopic (dispatch) {
        const payload = {}
        payload.id = this.$route.params.id
        payload.tagIds = this.topicForm.tagList.reduce((acc, _, key) => {
          acc.push(key)
          return acc
        }, [])

        this.updateDisable = true
        return dispatch('updateTopic', payload).then((res) => {
          this.updateDisable = false
          if (!res.err) alert('Update success.')
          else alert('Error message: something went wrong')
          return res
        })
      },
    }),
    ...mapActions('tag', {
      listTag (dispatch, payload = {}) {
        payload.id && this.$router.push(`/topic/${payload.id}`)
        return dispatch('listTag', payload)
      },
    }),
    addTag (item) {
      this.topicForm.tagList = this.topicForm.tagList.set(item.get('id'), item.get('name'))
    },
    removeTag (key) {
      this.topicForm.tagList = this.topicForm.tagList.delete(key)
    },
    searchTopic (query) {
      query && this.listTopic({ query })
    },
    searchTag (query) {
      query && this.listTag({ query })
    },
  },
  watch: {
    '$route.params.id': function (newVal, oldVal) {
      this.topicForm.tagList = this.tag.list.reduce((acc, cur) =>
        acc.set(cur.get('id'), cur.get('name')), new OrderedMap())
    },
    'tag.list': function (newVal, oldVal) {
      this.topicForm.tagList = this.topicForm.tagList.merge(newVal.reduce((acc, cur) =>
        acc.set(cur.get('id'), cur.get('name')), new OrderedMap()))
    },
    'topicForm.topicSearchQuery': function (newVal) {
      this.debounceSeatchTopic(newVal)
    },
    'topicForm.tagSearchQuery': function (newVal) {
      this.debounceSeatchTag(newVal)
    },
  },
  created () {
    const id = this.$route.params.id
    if (id) this.listTag({ id })

    this.listTopic()
    this.listTag()

    this.debounceSeatchTopic = debounce(this.searchTopic, 500)
    this.debounceSeatchTag = debounce(this.searchTag, 500)
  },
  render (h) {
    const { allTag, tag, topic, topicForm, updateDisable } = this
    const { listTag, updateTopic, updateTopicForm, addTag, removeTag } = this

    console.log(updateDisable)
    return (
      <TopicList
        allTag={allTag}
        tag={tag}
        topicForm={topicForm}
        topic={topic}
        updateDisable={updateDisable}
        listTag={listTag}
        updateTopic={updateTopic}
        updateTopicForm={updateTopicForm}
        addTag={addTag}
        removeTag={removeTag}
      />
    )
  },
}
</script>
