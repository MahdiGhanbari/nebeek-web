<template>
<span>
    <transition name="fade" mode="out-in">
        <span v-if="expand">
            <a :href="telegram" target="_blank" class="button">
                <i  class="fa fa-telegram"></i>
            </a>
            <a :href="facebook" target="_blank" class="button">
                <i  class="fa fa-facebook"></i>
            </a>
            <a :href="googleplus" target="_blank" class="button">
                <i  class="fa fa-google-plus"></i>
            </a>
        </span>
        <button v-else class="button" @click="expand = true">
            <i class="material-icons">share</i>
        </button>
    </transition>
</span>
</template>
<script >
export default {
    props: ['link'],
    data() {
        return {
            toggleMenu: false
        }
    },
    computed: {
        telegram() {
            return 'https://telegram.me/share/url?url=' + this.link;
        },
        facebook() {
            return 'https://www.facebook.com/sharer.php?u=' + this.link;
        },
        googleplus() {
            return 'https://plus.google.com/share?url=' + this.link;
        },
        expand: {
            set(value) {
                this.$emit('expand', value);
                    this.toggleMenu = value;
                if(value)
                   setTimeout(()=>{this.expand = false;},6000);
            },
            get() {
                return this.toggleMenu;
            }
        }
    }
}
</script>
<style scoped>
a { font-size: 2rem;}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
