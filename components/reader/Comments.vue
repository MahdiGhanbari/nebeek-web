<template>
<div class="comment-container">
  <div v-for="(selection, index) in selections" class="comment box" @click="setSelectedComment({ref:'comment', index: index})" 
      :style="{ opacity: (selectedComment.index == index || selectedComment.index == -1) ? 1 : .25  }"
      :id="(selectedComment.index == index) ? 'currentComment' : ''" >
    <entity :value="selection" viewModel="midume"></entity>
  </div>
</div>
</template>

<script>
import Entity from '~/components/Entity.vue';
import {mapState, mapActions} from 'vuex'
export default {
  data() {
    return {
      selectedIndex: -1
    }
  },
  methods: {
    ...mapActions('reader', ['setSelectedComment'])
  },
  computed: {
    ...mapState('reader', ['selections', 'selectedComment']),
  },
  components: {
    Entity
  },
  watch: {
    selectedComment: {
      handler: function(newValue) {
                if(newValue.ref == 'comment' || newValue.index == -1)
                  return;
                try{
                  setTimeout(()=>{
                    let el = this.$el.querySelector("#currentComment");
                    el.scrollIntoView();
                  }, 100)
                }catch(err) {
                  console.log(err)
                } 
              },
      deep: true
    }
  }
};
</script>

<style>
.comment-container { margin-top: 40px; }
.comment { padding: 0 7px }
</style>
