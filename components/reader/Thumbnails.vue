<template>
  <div class="container">
      <span v-for="(page, index) in pages" @click="navigateTo(index)" class="thumbnail box" 
        :style="{height: getPercentDimintions(page).height + 'px', width: getPercentDimintions(page).width + 'px'}">
        <thumb  @click="navigateTo(index)" class="thumbnail box" :file="{path: src(index), alternative: false}" :title="index + 1"> </thumb>
      </span>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import Thumb from '~/components/Thumb.vue';
export default {
  data() {
    return {
      hasErrors : true,
    };
  },
  computed: {
    ...mapState({
      id : state => state.reader.id,
      pages: state => state.reader.pages,
      loadedThumbnails: state => state.reader.loadedThumbnails,
      filePath: state => state.reader.filePath,
    }),
  },
  methods: {
    src(pageNum) {
      return this.filePath + '?pg=' + pageNum;
    },
    loadingFailed() {
      this.hasErrors = false;
    },
    ...mapActions('reader', ['navigateTo']),
    getPercentDimintions(page) {
      let diff = Math.floor(page.height / 800);
      let percent = 15 + diff > 0 ? 15 - diff : diff;
      return {
        height: (page.height * percent) / 100,
        width: (page.width * percent) / 100
        }
    }
  },
  components : {
    Thumb
  }
};
</script>

<style scoped>
.container {
  text-align: center;
}
.thumbnail {
  display: block;
  cursor: pointer;
  margin: 10px auto;
  & img {
    margin: auto;
    height: inherit;
    width: inherit;
  }
}
</style>
