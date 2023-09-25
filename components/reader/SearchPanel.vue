<template>
  <div>
    <h2>جستجو در مستند</h2>
    <div>
      <form @submit.prevent="searchInDocument(query)">
        <input type="text" v-model="query" placeholder="عبارت جستجو" />
        <button type="submit" class="primary">جستجو</button>
      </form>
      <ul>
        <li  v-for="result in searchResult"   @click="navigateTo(result.page)">
          <span>{{result.page + 1}}</span>
          <div v-html="result.snippet" class="search-snippet"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      query: '',
    };
  },
  computed: {
    ...mapState({
      searchResult: state => state.reader.searchResult
    }),
  },
  methods: {
    ...mapActions('reader', [
      'navigateTo',
      'searchInDocument'
      ])
  },
};
</script>


<style scoped>

ul {
    list-style: none;
    padding-right: 0;
    margin: 0;
}

li {
  text-align:justify;
  border-bottom: 1px solid #C9C9C9;
  cursor: pointer;
}

form {
  margin:0;
}
</style>
