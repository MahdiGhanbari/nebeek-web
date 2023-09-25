<template>
  <div id="reader" class="vscroll pinned-side">
    <div class="header">
      <div id="iconset">
        <span @click="sidebarClicked(0, 'toc')" :class="{active: isSideOpen(0, 'toc')}">
          <i class="material-icons">list</i>
        </span>
        <span @click="sidebarClicked(0, 'search')" :class="{active: isSideOpen(0, 'search')}">
          <i class="material-icons">find_in_page</i>
        </span>
        <span @click="sidebarClicked(0, 'thumbs')" :class="{active: isSideOpen(0, 'thumbs')}">
          <i class="material-icons">view_agenda</i>
        </span>
        <span @click="sidebarClicked(0, 'bookmarks')" :class="{active: isSideOpen(0, 'bookmarks')}">
          <i class="material-icons">bookmark</i>
        </span>
        <span @click="sidebarClicked(0, 'comments')" :class="{active: isSideOpen(0, 'comments')}">
          <i class="material-icons">note_add</i>
        </span>
      </div>
      <div id="title">
        <i v-if="title"><string :value="title[0]"></string></i>
      </div>
      <div id="iconset2">
        <span @click="toggleHighlight()" :class="{highlight: highlight}">
          <i class="material-icons">highlight</i>
        </span>
        <span @click="zoom(true)">
          <i class="material-icons">zoom_in</i>
        </span>
        <span @click="zoom(false)">
          <i class="material-icons">zoom_out</i>
        </span>
        <span @click="sidebarClicked(1, 'help')">
          <i class="material-icons">help</i>
        </span>
        <span @click="sidebarClicked(1, 'settings')">
          <i class="material-icons">settings</i>
        </span>
        <span @click="goBack">
          <i class="material-icons">exit_to_app</i>
        </span>
      </div>
    </div>
    <slider></slider>
    <div id="page-control">{{ pages.length }}
      <form @submit.prevent>
        <input id="page-control-input" title="Page number" v-model="currentPage" disabled="true">
      </form>
    </div>
    <div id="viewport" @mousedown="mouseDown()" @mouseup="mouseUp()" @mousemove="mouseMove($event)">
        <!--<div>
            <a class="nav-btn" id="prev-btn">
            <i class="material-icons">chevron-up</i>
            </a>
            <a class="nav-btn" id="next-btn">
            <i class="material-icons">chevron-down</i>
            </a>
        </div>-->
        <lazy-load id="pages" :threshold=".05" tabindex="0" class="grab" @scroll.native="onScroll($event)" :style="pagesStyle"
            :class="{'cursor-crosshair': isRectangleMode && highlight, 'cursor-text': !isRectangleMode && highlight}">
            <div v-for="page in pages">
                <page :page="page"></page>
            </div>
        </lazy-load>
    </div>
    <lazy-load id="sidebar" class="sidebar" v-show="isSidebarOpen">
      <span @click="closeSidebar(0)" class="close-icon">
        <i class="material-icons">close</i>
      </span>
      <!--<span @click="pinSidebar()">
        <i class="material-icons">arrow_drop_down</i>
      </span>-->
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="sidebarView[0]"></component>
        </keep-alive>
      </transition>
    </lazy-load>
    <div id="sidebar2" class="sidebar" v-show="isSidebar2Open">
      <span @click="closeSidebar(1)" class="close-icon">
        <i class="material-icons">close</i>
      </span>
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="sidebarView[1]"></component>
        </keep-alive>
      </transition>
    </div>
    <span class="dialog" v-if="currentDialog.name == 'Comment'">
        <div class="back-drop" @click="closeCommentDialog()"></div>
        <div class="dialog-box-container" >
            <div class="dialog-box box">
                <entity :value="getSelectedText" viewMode="medium"></entity>
                <div class="comment-form">
                    <form  @submit.prevent="createComment()">
                        <textarea type="text" v-model="commentValue" rows="3" cols="30" style="resize: none"></textarea>
                        <button class="button primary" type="submit" :class="{'save-comment-btn': commentValue.length == 0}"><i class="material-icons">check</i></button> 
                    </form>
                </div>
            </div>
        </div>
    </span>
  </div>
</template>

<script>
//import Icon from 'vue-icons';
import throttle from 'lodash/throttle';
import { mapState, mapActions, mapGetters } from 'vuex';
import Slider from '~/components/reader/Slider';
import SearchPanel from '~/components/reader/SearchPanel';
import TableOfContent from '~/components/reader/TableOfContent';
import Help from '~/components/reader/Help';
import Settings from '~/components/reader/Settings';
import Bookmarks from '~/components/reader/Bookmarks';
import Comments from '~/components/reader/Comments';
import Thumbnails from '~/components/reader/Thumbnails';
import Page from '~/components/reader/Page';
import String from '~/components/String.vue';
import Entity from '~/components/Entity.vue';
import db from '~/plugins/db';
import metaTags from '~/plugins/metaTags';
import LazyLoad from '~/components/LazyLoad.vue';


const ZoomEnum = { SCALE: 0, FTT: 1 };
const ScrollEnum = { VERTICAL: 0, HORIZONTAL: 1, NONE: 2 };


export default {
  components: {
    search: SearchPanel,
    toc: TableOfContent,
    help: Help,
    settings: Settings,
    bookmarks: Bookmarks,
    comments: Comments,
    thumbs: Thumbnails,
    Slider,
    Page,
    Entity,
    LazyLoad,
    String
  },
  data() {
    return {
      scrollMode: ScrollEnum.VERTICAL,
      zoomMode: ZoomEnum.SCALE,
      sidebarView: ['', ''],
      scrollWidth: 0,
      toggleShareOrComment: false,
      scrollCounter: 0,
      topScroll: null,
      commentValue: ''
    };
  },
  head() {
      let ret = metaTags(this.$route, null, this.$store.state.lingual);
      ret['title'] = this.title ? (this.title[0].fa || this.title[0].en) : '[بدون عنوان]';
      return ret;
  },
  async fetch(context) {
      await context.store.dispatch('reader/loadDocument', context.params.id);
  },
  computed: {
    isSidebarOpen() {
      return this.sidebarView[0] !== '';
    },
    isSidebar2Open() {
      return this.sidebarView[1] !== '';
    },
    pagesStyle() {
      // TODO: check browser compatibility and disable
      return `width: calc(100% + ${this.scrollWidth}px);`;
    },
    currentPage() {
        return Math.floor(this.visibleFrom) + 1;
    },
    ...mapState({
      pages: state => state.reader.pages,
      scale: state => state.reader.scale,
      visibleFrom: state => state.reader.visibleFrom,
      cumulativeHeights: state => state.reader.cumulativeHeights,
      highlight: state => state.reader.highlight,
      title: state => state.reader.title,
      startIndex: state => state.reader.startIndex,
      endIndex: state => state.reader.endIndex,
      selectionStarted: state => state.reader.selectionStarted,
      selectedComment: state => state.reader.selectedComment,
      user: state => state.user
    }),
    getSelectedText() {
        this.commentValue = '';
        let text = this.$store.getters['reader/getSelectedText'];
        return {text: {fa: text}};
    },
    canScroll() {
        return  this.selectionStarted && this.startIndex.index != -1 && this.scrollCounter != 0; 
    },
    ...mapGetters(['currentDialog']),
    isRectangleMode() {
        return this.selectionStarted && this.startIndex.index == -1;
    }
  },
  methods: {
    onScroll: throttle(function handler(event) {
      const scrollTop = event.target ? event.target.scrollTop : event;
      // TODO: binary search
      let currentIndex = 0;
      while (scrollTop >= this.cumulativeHeights[currentIndex]) {
        currentIndex += 1;
      }
      currentIndex -= 1;
      const pageHeight = this.cumulativeHeights[currentIndex + 1] -
          this.cumulativeHeights[currentIndex];
      const pagePosition = scrollTop - this.cumulativeHeights[currentIndex];
      this.setVisibleFrom(currentIndex + (pagePosition / pageHeight));
    }, 100, { leading: false }),
    sidebarClicked(id, page) {
      if (this.sidebarView[id] !== page) {
        this.$set(this.sidebarView, id, page);
      } else {
        this.closeSidebar(id);
      }
    },
    closeSidebar(id) {
      this.$set(this.sidebarView, id, '');
    },
    isSideOpen(id, page) {
      return this.sidebarView[id] === page;
    },
    pinSidebar() {

    },
    goBack() {
        // TODO: find a way to navigate to details view if we don't have a back button
        this.$router.go(-1);
    },
    ...mapActions('reader', [
        'navigateTo',
        'zoom',
        'setVisibleFrom',
        'toggleHighlight',
        'setSelectionStarted',
        'setSelectedComment'
    ]),
    async createComment() {
        this.closeCommentDialog()
        try {
            let date = new Date();
        let response = await db.save({
            owner: this.user.id ,
            type: 'Comment',
            argument: {
                startPage: this.startIndex.page,
                startIndex: this.startIndex.index,
                endPage: this.endIndex.page,
                endIndex: this.endIndex.index
            },
            text: this.commentValue,
        })
        }catch(err) {console.log(err)}
    },
    mouseDown() {
        if(!this.highLight)
            this.setSelectedComment({ref:null, index: -1})
        if(!this.selectionStarted && this.highlight) 
            this.setSelectionStarted(true);
        this.topScroll = this.cumulativeHeights[Math.floor(this.visibleFrom)] ;   
    },
    mouseUp() {
        if(this.selectionStarted && this.highlight)
            this.setSelectionStarted(false);
        this.scrollCounter = 0;
    },
    mouseMove(event) {
        let height = this.$el.querySelector('#viewport').clientHeight;
        let y = event.clientY - 35;
        let border = (height * 10) / 100;

        if(y >= height - border && y <= height) {
            let start = height - border;
            this.scrollCounter = Math.floor(y - start);         
        } 
        else if(y >= 0 && y <= border) 
            this.scrollCounter = Math.floor(y - border);
        else
            this.scrollCounter = 0;
    },
    startScroll: throttle(function handler(event) {
        if(this.canScroll) 
            this.continueScroll()
    }, 50, { leading: false }),
    continueScroll() {
        let endScroll = this.cumulativeHeights[this.pages.length];
        let newTopScroll = this.topScroll + this.scrollCounter;
        if(newTopScroll <= endScroll && newTopScroll >= 0)
            this.topScroll = newTopScroll
        this.onScroll(this.topScroll)
        this.startScroll()
    },
    closeCommentDialog() {
        this.$store.dispatch('closeDialog');
    }
  },
  watch: {
    visibleFrom: function(newValue) {
      const currentIndex = Math.floor(newValue);
      const pageHeight = this.cumulativeHeights[currentIndex + 1] -
          this.cumulativeHeights[currentIndex];
      const pagePosition = (newValue - currentIndex) * pageHeight;
      document.getElementById('pages').scrollTop = pagePosition + this.cumulativeHeights[currentIndex];
    },
    scrollCounter: function() {
        if(this.canScroll)
          this.startScroll();
    },
    selectedComment: {
        handler: function(newValue) {
                    if(this.sidebarView[0] != 'comments' && newValue.index != -1)
                        this.sidebarClicked(0, 'comments')   
                },  
        deep: true
    },
    sidebarView: function(newValues) {
        if(newValues[0]!= 'comments' && this.selectedComment.index != -1)
            this.setSelectedComment({ref: null, index: -1})
    }
  },
  layout: 'reader',
  mounted() {
    function getScrollbarWidth() {
      /* eslint-disable no-undef */
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.width = '100px';
      document.body.appendChild(outer);
      const widthNoScroll = outer.offsetWidth;
      outer.style.overflow = 'scroll';
      const inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);
      const widthWithScroll = inner.offsetWidth;
      outer.parentNode.removeChild(outer);
      const ret = widthNoScroll - widthWithScroll;
      return ret === 0 ? 9 : ret + 1; // 9 for mac-style scrolls and +1 for IE
      /* eslint-enable no-undef */
    }
    this.scrollWidth = getScrollbarWidth();
    document.addEventListener('mouseleave',()=> {this.mouseUp()})
  }
};
</script>

<style scoped>
#reader {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
    direction: rtl;
    text-align: right;
    font-family: BYekan, BKoodakBold, Tahoma;
    font-size: 1.1em;
}
a {
    text-decoration: none;
    color: #279AD9;
}
#viewport {
    position: absolute;
    top: 35px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background-color: #F0F0F0 !important;
}
.active-side.pinned-side #viewport {
    right: 300px;
}
#pages {
    position: relative;
    height: 100%;
    overflow: auto;
    text-align: center;
}
.sidebar {
    position: absolute;
    top: 35px;
    background-color: #FCFCFC;
    border-bottom: 2px solid #D8D8D8;
    transition: opacity 0.1s;
    -webkit-transition: opacity 0.1s;
    overflow: auto;
    padding: 20px;
    z-index: 1000;
    line-height: 25px;
}
#sidebar {
    right: 0;
    width: 260px;
    border-left: 2px solid #D8D8D8;
    opacity: 0.75;
    -moz-opacity: 0.75;
    filter: alpha(opacity=75);
}
#sidebar2 {
    left: 0;
    min-width: 100px;
    border-right: 2px solid #D8D8D8;
}
.active-side #sidebar {
    display: block;
}
.pinned-side #sidebar {
    bottom: 0;
    opacity: 1;
    filter: alpha(opacity=100);
    -moz-opacity: 1.0;
    border-bottom: 0;
}
#sidebar2.active {
    display: block;
}
#sidebar:hover {
    opacity: 1;
    filter: alpha(opacity=100);
    -moz-opacity: 1.0;
}
#sidebar .pinned {
    float: left;
    background: url("/images/pin.png");
    width: 14px;
    height: 14px;
    cursor: pointer;
    display: inline-block;
    text-decoration: none;
    margin: 3px 6px;
}
#sidebar .pinned:hover {
    background-position: 0px -14px;
}
.sidebarinfo {
    font-size: 13px;
    margin-right: 0.5em;
}
.sidebar ul {
    list-style: none;
    padding-right: 0;
    margin: 0;
}
.sidebar > div {
    font-size: 14px
}
.sidebar h2 {
    font-family: BKoodakBold, Tahoma;
    font-size: 18px;
    margin: 0 0 10px;
}
.sidebar h3 {
    font-family: BKoodakBold, Tahoma;
    font-size: 16px;
    margin-bottom: 5px;
}
.close-icon {
  cursor: pointer;
  float: left;
  color: black;
}
.header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 35px;
    background-color: #424242;
    padding: 0 5px;
    color: #AFAFAF;
    vertical-align: middle;
    direction: rtl;
    font-size: 0;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    text-align: center;
}
.header a {
    color: #AFAFAF;
}
.header a:hover {
    color: white;
    text-decoration: none;
}
#prev-btn i,
#next-btn i {
    font-size: 2em;
    display: none;
}
.vscroll #prev-btn i.glyphicon-chevron-up,
.vscroll #next-btn i.glyphicon-chevron-down {
    display: inline-block;
}
.hscroll #prev-btn i.glyphicon-chevron-right,
.hscroll #next-btn i.glyphicon-chevron-left {
    display: inline-block;
}
.nav-btn {
    -moz-opacity: 0.25;
    opacity: 0.25;
    filter: alpha(opacity=25);
    transition: opacity 0.5s;
    -webkit-transition: opacity 0.5s;
    background-color: #CCC;
    z-index: 1;
    display: block;
    cursor: pointer;
    text-align: center;
}
.vscroll .nav-btn {
    position: absolute;
    height: 30px;
    width: 100%;
    -moz-opacity: 0.25;
    opacity: 0.25;
    filter: alpha(opacity=25);
    text-align: center;
}
.vscroll #prev-btn {
    top: 0;
    border-bottom: 1px solid gray;
}
.vscroll #next-btn {
    bottom: 0;
    border-top: 1px solid gray;
}
.nav-btn:hover {
    -moz-opacity: 0.35;
    opacity: 0.35;
    filter: alpha(opacity=35);
    background-color: #337dcc;
}
.hscroll .nav-btn {
    position: absolute;
    width: 50px;
    height: 100%;
    text-align: center;
}
.hscroll #prev-btn {
    right: 0;
    border-left: 1px solid gray;
}
.hscroll #next-btn {
    left: 0;
    border-right: 1px solid gray;
}
#tooltip {
    font-size: 12px;
}
#pages::-webkit-scrollbar:vertical {
    display: none;
}
.hscroll .visible {
    display: inline-block;
    float: right;
}
.hscroll .visible {
    text-align: left;
}
.hscroll .visible ~ .visible {
    text-align: right;
}
.hscroll .page {} .hscroll .page img {
    max-width: 100%;
    max-height: 100%;
}
.visible-v {
    display: none;
}
.vscroll .visible-v {
    display: block;
}
#page-control {
    position: absolute;
    left: 60px;
    bottom: 40px;
    direction: rtl;
    z-index: 10;
    font-size: 18px;
    font-family: BYekan;
}
.nscroll #page-control {
    display: none;
}
#page-control form {
    display: inline;
    margin: 0;
}
#page-control-input {
    background: transparent;
    border: 1px solid #A2A2A2;
    cursor: text;
    font-family: BYekan;
    font-size: 100%;
    padding: 0;
    text-align: left;
    width: 5em;
    height: 1.8em;
    position: relative;
    padding-left: 5px;
}
#iconset {
    position: absolute;
    right: 10px;
    top: 0;
    line-height: 35px
}
#iconset2 {
    position: absolute;
    left: 10px;
    top: 0;
    line-height: 35px
}
#iconset > span {
    display: inline-block;
}
#iconset > span,
#iconset2 > span {
    cursor: pointer;
    margin: 0 8px;
}
.header .active {
  background: #FCFCFC;
}
img.thumbnail {
    height: 182px;
    padding-right: 4px;
    width: 128px;
    margin-bottom: 10px;
}
.grab {
    cursor: move;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}
.grabbing {
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}
.fade-enter-active, .fade-leave-active  {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
.highlight {
    color: white;
}
.dialog-box-container{  
    display: inline-flex;
}
.back-drop {
    opacity: .5;
    background-color: lightgrey;
    z-index: 10;
}
.dialog-box {
    width: 250px;
    margin: auto;
    z-index: 11;
    text-align: center;
}
.dialog > div {
    width: 100%;
    height: 100%;
    position: absolute;
}
#title {
    display: inline-block;
    margin-top: 4px;
    font-size: 20px;
}
.cursor-crosshair {
  cursor: crosshair;
}
.cursor-text {
  cursor: text;
}
.comment-form {
    background: #d2d2d2;
    min-height: 125px;
    overflow: hidden;
    transition: height .3s;
    & form { padding-top: 10px;}
}
.save-comment-btn {
    pointer-events: none;
    opacity: .3;
}
</style>