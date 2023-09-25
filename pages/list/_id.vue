<template>
<div class="container">
    <div v-for="list of lists">
      <list v-model="list.items" :title="list.name" view="cards"></list>
    </div>
</div>
</template>
<script>
import list from '~/components/List.vue';
import db from '~/plugins/db';
import metaTags from '~/plugins/metaTags';

const PAGE_TO_TYPE = {
  'book': 'Book',
  'newsstand': 'TelegramMessage',
  'academic': 'Paper',
  'student': 'TextBook'
}

export default {
  async asyncData(context) {
    let latest = await db.find('', {type: PAGE_TO_TYPE[context.params.id]}, [0, 5], ['-id']);
    let oldest = await db.find('', {type: PAGE_TO_TYPE[context.params.id]}, [0, 5]);
    return {
        lists: [
          {name: {'fa': 'جدیدترین ها'}, items: latest},
          {name: {'fa': 'قدیمی ترین ها'}, items: oldest}
        ],
        entity: {}
    };
  },
   head() {
      // let ret = metaTags(this.$route, this.entity, this.$store.state.lingual);
      // let name = this.entity.name[this.$store.state.lingual];
      //   name =  this.$store.state.lingual == 'en' ? name + ' list' : 'لیست '+ name ;
      
      // let itemList = [];
      // for(let item of this.lists) {
      //   let itemName = item.name[this.$store.state.lingual];
      //   itemName = itemName !='' ? itemName : item.name['fa'];
      //   let type = this.entity.name['en'];
      //   itemList.push('{"@type":' + '"' + type +'","name": "' + itemName +'"}');
      // }
      // ret.script.push({ innerHTML: '{ "@context": "http://schema.org", \n' +
      //       '"@type": "ItemList",\n'+
      //       '"name": "' + name + '",\n' +
      //       '"itemListElement":['+ itemList.toString() + '],\n'+
      //       '"itemListOrder": "http://nebeek.com/' + this.$route.fullPath + '"}'
      // , type: 'application/ld+json' })
      // return ret
      return {}
  },
  methods: {
  },
  components: {
    list
  }
}
</script>
<style scoped>
</style>