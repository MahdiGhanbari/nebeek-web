<template> 
    <div>
        <span v-if="editable">
            <textarea v-if="multiline" id="textarea" v-model="text" @focus="resizableTextarea()"></textarea>
            <input v-else v-model="text" id="input" type="text" :style="{'max-width': maxLength + 'px'}">
        </span>
        <div v-else :class="{limited: maxLength && more}" >
            <nuxt-link v-if="link" :to="link"> {{text}} </nuxt-link>
            <span :class="{text: multiline}" v-else>{{text}}</span>
        </div>
        <button v-if="more" class="button" @click="expand($event)"> <i class="material-icons">more_horiz</i> </button> 
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  props: ['value', 'editable', 'multiline', 'link', 'maxLength'],
  data() {
      return {
          str: "",
          height: 100,
          width: 100,
          fullText: true
      }
  },
  methods: {
    resizableTextarea() {
        let el = this.$el.querySelector('#textarea'); 
        function resize() {
                        setTimeout(()=> {
                                            el.style.cssText = 'height:auto; padding:0'
                                            el.style.cssText = 'height:' + el.scrollHeight + 'px';
                                        },0)
                        }
        var e = 'keyup, keypress, focus, blur, change'.split(',');
        for (var i in e) el.addEventListener(e[i], resize, false);
        resize();
    },
    expand(event) {
        this.more = false;
        event.stopPropagation();
    }
  },
  computed: {
    text: {
        get() {
            return this.value[this.local] || this.value[this.altLocal] || "";
        },
        set(val) {
            this.str = val;
        }
    },
    ...mapState({
        local: state => state.lingual,
        altLocal: state => state.altLingual
    }),
    more: {
        set(value) {
            this.fullText = value;  
        },
        get() {
            return this.maxLength && this.text.length > this.maxLength && this.fullText;
        }
    }
  }
}
</script>

<style scoped>
form {
    display: inline-grid;
    text-align: center;
}
#textarea {
    padding: 10px;
    overflow: hidden;
    width: 100%;
    box-sizing: content-box;
    resize: none;
}
#input {
    margin: 15px 0;
    display: inline-block;
    width: 100%;
}
.text {
    white-space: pre-wrap;
}
.limited {
    height: 40px !important;
    overflow: hidden;
    transition: height 1s;
}
</style>


