<template>
<div class="container">
    <h1>افزایش اعتبار</h1>
    <div>
        <form @submit.prevent="increase">
            <input v-model="amount" id="amount" type="text" autofocus>
            <label for="amount">مقدار (تومان)</label>
            <button class="primary" type="submit">افزایش</button>
        </form>
    </div>
</div>
</template>
<script>
import db from '~/plugins/db';

export default {
  middleware: 'authenticated',
  async asyncData({store}) {
    let entity = await db.find(store.state.user.id);
    return {
        accountId: entity.account[0].id
    };
  },
  data() {
    return {
      amount: 0,
      hasErrors: false
    }
  },
  methods: {
      async increase() {
        try {
            let url = await db.save({
                type: 'ZarinPalTransaction',
                amount: this.amount,
                account: this.accountId
            });
            window.location = url.data;
        } catch(err) {
            this.hasErrors = true;
        }
      }
  }
}
</script>
