<template>
    <div class="login">
        <login @login="login()" :pageMode="true"> </login>
    </div>
</template>
<script>

import Login from '~/components/Login.vue'; 
export default {
  middleware: 'anonymous',
  asyncData({query}) {
    return {
        returnUrl: query.r
    };
  },
  data() {
      return {
          hasError: false
      }
  },
  methods: {
    login() {
        try {
            if (this.returnUrl) {
                this.$router.replace(this.returnUrl);
            } else {
                this.$router.replace({name: 'view-id', params: {id: this.$store.state.user.id}});
            }
            this.hasError = false;
        }catch(err) {} 
    }
  },
  components: {
      Login
  }
}
</script>
<style scoped>
.login {
    width: 600px;
    margin: auto;
}
@media (max-width: 626px) {
    .login {width: 100%;}   
}
</style>
