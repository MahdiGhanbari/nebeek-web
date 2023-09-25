<template>
  <div class="toc" :class="{'view-mode' : items, 'read-mode': !items}">
    <ul v-for="item in getItems">
      <li>
        <span class="page-number">{{item.pageNo + 1}}</span>
        <nuxt-link v-if="items" :to="{name: 'read-id', params: {id: id}, query: {'page-name': item.pageNo}}">
          {{item.title[lingual] && item.title[lingual] != '' ? item.title[lingual] : item.title['fa']}}
          </nuxt-link>
        <div v-else class="title" @click="navigateTo(item.pageNo)">{{item.title}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  props:['items', 'id'],
  data() {
    return {
    };
  },
  methods: {
    ...mapActions('reader', ['navigateTo'])
  },
  computed: {
    ...mapState({
      toc : state => state.reader.tableOfContent,
      lingual : state => state.lingual
    }),
    getItems() {
      return this.items != null ? this.items : this.toc;
    }
  }
};
</script>
<style scoped>
.toc {
  lost-utility: clearfix;
}
.view-mode ul {
    width: 50%;
    float: right;
    padding-right: 0px;
    padding: 0;
    padding-right: 15px;
    list-style: none;
    margin: 5px 0;
}
li {
    border-bottom: 1px solid #F3F3F3;
    position: relative;
    overflow: hidden;
}
.page-number {
    float: left;
    padding-right: 5px;
}
.title {
  cursor: pointer;
  color: #428bca;
}
.title:hover {
  text-decoration: underline;
}
.read-mode {
  margin-top: 30px;
}
.read-mode ul {
  padding: 0;
}
</style>
