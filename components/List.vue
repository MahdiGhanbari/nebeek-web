<template>
<div class="list" :class="{'list-stretch': isVertical}">
    <div v-if="hasHeader" :class="{'section-header': view=='cards'}">
        <span v-if="title">
            <string :value="title"></string>
        </span>
        <span v-if="editable && !mode">
            <nuxt-link v-if="isReview" class="button primary" :to="{name: 'create-review', query: createParams}">جدید</nuxt-link>
            <nuxt-link v-else-if="!isFile" class="button primary" :to="{name: 'create-id', params: {id: type}, query: createParams}">جدید</nuxt-link>
            <span v-else>
                <input type="file" @change="onFileChange" id="file-input" accept="application/pdf">
                <label for="file-input" class="button primary">جدید</label>
            </span>
        </span>
    </div>
    <div class="list-body">
        <button v-if="hasLeftScroll" class="pagination-btn box" @click="manualXScroll('left')"> <i class="material-icons">keyboard_arrow_right</i> </button>
        <div class="items" @scroll="scroll($event)">
            <div  v-for="(item, index) in value" v-if=" isVisible(index)" :class="{'item box': view=='cards', open: isOpen(item)}" 
                @mouseover="tryExpand(item)" @mouseout="cancelExpand">
                <button v-if="editable" class="button remove-button" @click="removeItem(index)"> <i class=" material-icons"> remove </i></button>
                <entity v-model="value[index]" :absolute-buttons="true" :image-width="getImageWidth" :viewMode="getChildViewMode" :editable="editable"></entity>
            </div>  
        </div>
        <button v-if="hasRightScroll" @click="manualXScroll('right')" class="pagination-btn box"> <i class="material-icons">keyboard_arrow_left</i> </button>
        <button v-if="editable" class="button" @click="addNewItem()"><i class="material-icons"> add </i></button> 
    </div>
</div>
</template>
<script>
import DateTime from '~/components/DateTime.vue';
import Entity from '~/components/Entity.vue';
import String from '~/components/String.vue';
import Thumb from '~/components/Thumb.vue';
import throttle from 'lodash/throttle';
import db from '~/plugins/db';
import {mapState} from "vuex";
import Vue from 'vue'

export default {
    props: ['value', 'isVertical', 'title', 'type', 'createParams', 'alwaysOpen', 'editable', 'childView', 'view', 'limited'],
    data() {
        return {
        expandTimer: null,
        openItem: null,
        imagePath: null, 
        add: true,
        restOfScroll: null,
        oldScrollHeight: -1
        }
    },
    computed: {
        isFile() {
            return this.type == 'issue' || this.type == 'book' || this.type == 'article';
        },
        isReview() {
            return this.type == 'review';
        },
        ...mapState(['lingual']),
        hasHeader() {
            return this.editable || this.title;
        },
        getImageWidth() {
          return  this.childView ?  undefined : 140;
        },
        getChildViewMode(){
            return this.childView || 'medium'
        },
        hasLeftScroll() {
            return this.restOfScroll && (this.restOfScroll == 'left' || this.restOfScroll == 'both');
        },
        hasRightScroll() {
            return this.restOfScroll && (this.restOfScroll == 'right' || this.restOfScroll == 'both');
        }
    },
    methods: {
        isOpen(item) {
            if (this.alwaysOpen) {
                return true;
            }
            if (!this.openItem) {
                this.openItem = this.value[Math.floor(Math.random() * this.value.length)]; 
            }
            return item == this.openItem;
        },
        isFullyIncluded(item) {
            return false;
        },
        tryExpand(item) {
            if(this.mode)
                return
            clearTimeout(this.expandTimer);
            this.expandTimer = setTimeout(this.openDoc, 800, item);
        },
        cancelExpand() {
            clearTimeout(this.expandTimer);
        },
        openDoc(item) {
            this.openItem = item;
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            db.save({
                owner: this.createParams.owner,
                type: this.type 
            }).then(response => {
                let data = response.data;
                this.$store.dispatch('file/upload', {id: data.id, file: files[0], path: data.data.path, token: data.data.token});
            }).catch(err => {

            });
        },
        removeItem(index) {
            this.value.splice(index, 1);
            this.$emit('input', this.value)
        },
        addNewItem() {
            let item = {'type': this.type}
            this.value.push(item)
            this.$emit('input', this.value)
        },
        manualXScroll(dir) {
            let el = this.$el.querySelector('.items');
            let xScroll = el.clientWidth / 2;
            if(dir == 'left')
                el.scrollBy(xScroll, 0);
            else
                el.scrollBy(-xScroll, 0);
        },
        xScrollDirecton(el) {
            let endOfScroll = el.scrollWidth  - el.clientWidth;
            if((el.scrollHeight / this.oldScrollHeight) >= 2) {
                this.restOfScroll = 'right';
                return;
            }
            if(el.scrollWidth == el.clientWidth)
                 this.restOfScroll =  null;
            else if(el.scrollLeft == 0)
                this.restOfScroll = 'left';
            else if (el.scrollLeft == endOfScroll)
                this.restOfScroll = 'right';
            else
                this.restOfScroll = 'both';      
            this.oldScrollHeight = el.scrollHeight;
        },
        scroll: throttle(function handler(event) {
            this.xScrollDirecton(event.target);   
            }, 100 , { leading: false }
        ),
        isVisible(index) {
            if(this.value[index].removed)
                return false
            return this.limited ? index < 3 : true;
        }
    },
    mounted() {
        if(this.view == 'cards')
            try {
                let el =this.$el.querySelector('.items');
                this.xScrollDirecton(el);
            }catch (err) {}
    },
    components: {
        Thumb,
        Entity,
        String,
        DateTime
    }
}
</script>
<style scoped>
.list {white-space: nowrap; overflow: hidden}
.list-item {display: inline-block}
.item {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    transition: width 0.5s;
    width: 140px;
    height: 210px;
}
.item.open {width: 450px;}
.list-stretch .item {display: block; width: auto !important;}
.list-stretch .item {border-bottom: 1px solid #DDD;}
@media (max-width: 767px) {
    .item {display: block; width: auto !important;}
	.item {border-bottom: 1px solid #DDD;}
	.pagination-btn {display: none}
	.item {height: 150px;}
	.txt {display: none;} /* what about the search mode */
}
#file-input {
    display: none;
}
.remove {
    font-size: 1.275rem;
    cursor: pointer;
    display: inline-block;
}
#input {margin: 10px 10px 0 0 ;}
.remove-button {
    position: absolute;
    margin-top:20px;
    right: 200px;
    z-index: 1;
}
.pagination-btn {
    transition: all .4s;
    border-radius: 50%;
    padding: 18px; 
    line-height: 0;
}
.pagination-btn:hover { background: #f4f4f4; }
.list-body { 
    display: flex;
    align-items: center;
}
.items { 
    overflow-y: hidden;
    overflow-x: auto;
    margin-bottom : -18px; /* It's temporary , it be should dynamic */
    padding: 18px 0 36px 0;
    scroll-behavior: smooth;
    width: 100%;
}
</style>