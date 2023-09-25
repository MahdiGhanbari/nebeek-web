<template>
  <div class="container">
    <h1>ایجاد نظر جدید</h1>
    <div class="form">
        <form @submit.prevent="create()">
          <div>
            <label for="star">امتیاز</label>
            <star v-model="rate" :editable="true" id="star"></star>
          </div>
          <label for="review">نظر</label>
          <textarea v-model="abstract" type="text" rows="10" cols="60" id="review"></textarea>
          <button class="primary" type="submit">ثبت</button>
        </form>
    </div>
  </div>
</template>
<script >
import db from '~/plugins/db';
import Star from '~/components/Star.vue';

export default {
  middleware: 'authenticated',
  async asyncData({query}) {
    // TODO: check if 'on' exists in query
    return {
      on: parseInt(query.on),
      rate: 0,
      abstract: ''
    }
  },
  methods: {
    async create() {
      try {
          let resopnse = await db.save({
            type: 'Review',
            argument: this.on,
            value: this.rate,
            abstract: this.abstract,
            date: this.$store.state.calendar.currentDateTime
          });
        this.$router.push({name:'view-id', params: {id: this.on}});
      } catch(err) {
        console.log(err)
      }
    }
  },
  components: {
    Star
  }
}
</script>
<style scoped>
</style>
