<script>
import LoadingHeart from '@/modules/common/components/LoadingHeart'

export default {
  name: 'topicList',
  props: {
    allTag: {
      type: Object,
      default: () => ({}),
    },
    tag: {
      type: Object,
      default: () => ({}),
    },
    topic: {
      type: Object,
      default: () => ({}),
    },
    topicForm: {
      type: Object,
      default: () => ({}),
    },
    updateDisable: Boolean,
    listTag: Function,
    updateTopic: Function,
    updateTopicForm: Function,
    addTag: Function,
    removeTag: Function,
  },
  components: {
    LoadingHeart,
  },
}
</script>

<template lang="pug">
  #topic
    .list
      h3 Topics
      input(type="text" placeholder="search" v-model="topicForm.topicSearchQuery")
      .item(v-for="item in topic.list" :key="item.get('id')" @click="listTag({ id: item.get('id') })") {{item.get('name')}}
      LoadingHeart(v-if="topic.pagination.get('loading')")
    .list
      .title
        h3 Tags
        button(class="btn btn-primary" @click="updateTopic" :disabled="updateDisable") Update
      .item(v-for="([ key, name ]) in topicForm.tagList.toArray()" :key="key" @click="removeTag(key)") {{name}}
      LoadingHeart(v-if="tag.pagination.get('loading')")
    .list
      h3 All Tags
      input(type="text" placeholder="search" v-model="topicForm.tagSearchQuery")
      .item(v-for="item in allTag.list" :key="item.get('id')" @click="addTag(item)") {{item.get('name')}}
      LoadingHeart(v-if="allTag.pagination.get('loading')")
</template>

<style lang="postcss" scoped>
  #topic {
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: space-around;
    padding: 8px 0;

    & > .list {
      display: flex;
      flex-direction: column;
      overflow: scroll;
      border: 1px solid;
      border-radius: 4px;
      padding: 4px;
      width: calc(50% - 8px);

      .title {
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      & > .item, & > input {
        margin: 2px;
        padding: 4px;
        border: 1px solid lightgray;
        border-radius: 4px;
      }

      & > .item:hover {
        cursor: pointer;
      }
    }
  }
</style>
