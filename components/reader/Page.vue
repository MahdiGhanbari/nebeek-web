<template>
  <div class="page-container unselectable p0" unselectable="on" draggable="false"> <!-- change page to page number -->
    <div class="page" :style="{width: pageDimesions.width + 'px', height: pageDimesions.height + 'px'}">

      <div v-if="canComment" @click="openCommentDialog()" class="bubble-button material-icons"
       :style="{top: bubbleButtonPosition + '%'}">dns</div>
      <div class="page" @mousedown="mouseDown($event)" @mouseup="mouseUp()" @mousemove="mouseMove($event)"
              :style="{width: pageDimesions.width + 'px', height: pageDimesions.height + 'px'}">
        <div v-if="startPoint && selectionStarted && rectangleMode" class="rectangle" :style="{left: rect.del.x +'px', top: rect.del.y +'px', height: rect.del.height + 'px', width: rect.del.width + 'px'}"></div>
        <div :style="{width: pageDimesions.width + 'px', height: pageDimesions.height + 'px'}">
          <div class="bookmark">
            <a :class="{marked: page.isBookmarked}" href="#" rel="tooltip" title="علامت گذاری" data-placement="right" data-delay="500"></a>
          </div>
          <thumb id="page-image" :file="page.image" :width="pageDimesions.width" :height="pageDimesions.height"></thumb>
          <div class="hl-block" v-for="box in highLights" :style="{left : box.left + '%', top: box.top + '%', height: box.height +'%', width: box.width +'%' }"></div>
          <div v-for="(selection, index) in selections">
            <div v-for="(char, index2) in page.chars" @mousedown='selectSection($event, index)' class="page-selections" v-if="isSelectionInPage(selection, index2)"
                :style="{left: char.x +'%', top: char.y +'%', height: char.height + '%', width: char.width + '%'}"
                :class="{'current_page-selections': selectedComment.index == index}">
            </div>
          </div>
          <div v-for="(char, index) in page.chars" class="user-selections" v-if="index >= fromIndex && index <= toIndex"
              :style="{left: char.x +'%', top: char.y +'%', height: char.height + '%', width: char.width + '%'}">
          </div>
          <div v-if="highlight" class="coverPage" :style="{width: pageDimesions.width + 'px', height: pageDimesions.height + 'px'}">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Thumb from '~/components/Thumb.vue';
import throttle from 'lodash/throttle';

export default {
  props: ['page'],
  data() {
    return {
      highLights: [],
      abstract: '',
      rectangleMode: true,
      startPoint: null,
      endPoint: null,
      lines:[],
      recStatus: null, // make it computed based on startPoint and endPoint
    };
  },
  created() {
    this.getHighlights();
  },
  computed: {
    fromIndex() {
      if(!this.isInSelectedDomain)
        return;

      if(this.startIndex.page != this.page.number && this.endIndex.page != this.page.number) 
        return 0;

      if(this.startIndex.page !== this.page.number)
        if(this.isDirectionSelectTop)
          return this.endIndex.index;
        else
          return 0;

      if(this.endIndex.page != this.page.number)
        if(this.isDirectionSelectTop)
          return  0
        else
          return this.startIndex.index;

      return Math.min(this.startIndex.index, this.endIndex.index);
    },
    toIndex() {
      if(!this.isInSelectedDomain)
        return;
    
      if(this.startIndex.page != this.page.number && this.endIndex.page != this.page.number)
        return this.page.chars.length - 1;
        
      if(this.startIndex.page != this.page.number)
        if(this.isDirectionSelectTop)
          return this.page.chars.length - 1;
        else
          return this.endIndex.index;
     
      if(this.endIndex.page != this.page.number)
        if(this.isDirectionSelectTop)
          return this.startIndex.index; 
        else
          return this.page.chars.length - 1; 
      
      return Math.max(this.startIndex.index, this.endIndex.index);
    },
    rect() {
      if (this.startPoint) {
        let minX = Math.min(this.startPoint.x, this.endPoint.x);
        let maxX = Math.max(this.startPoint.x, this.endPoint.x);
        let minY = Math.min(this.startPoint.y, this.endPoint.y);
        let maxY = Math.max(this.startPoint.y, this.endPoint.y);
        return {del:{x: minX, y: minY, width: maxX - minX, height: maxY - minY}, 
                pos: {minX: minX, maxX: maxX, minY: minY, maxY: maxY}};
      }
      return {};
    },
    ...mapState({
      query: state => state.reader.query,
      id: state => state.reader.id,
      highlight: state => state.reader.highlight,
      scale: state => state.reader.scale,
      currentPage: state => state.reader.currentPage,
      startIndex: state => state.reader.startIndex,
      endIndex: state => state.reader.endIndex,
      selectionStarted: state => state.reader.selectionStarted,
      pages: state => state.reader.pages,
      selections: state => state.reader.selections,
      selectedComment: state => state.reader.selectedComment,
      isLoggedIn:  state => state.isLoggedIn
    }),
    ...mapGetters('reader', ['isDirectionSelectTop']),
    pageDimesions() {
      let dimensions = {
        height: this.page.height * this.scale,
        width: this.page.width * this.scale
      }
      return dimensions;
    },
    bubbleButtonPosition() {
      if(this.endIndex.page === this.page.number)
       return  this.page.chars[this.endIndex.index].y;
      return null;
    },
    isInSelectedDomain() {
      let index = this.page.number; 
      if(this.isDirectionSelectTop)
        return index <=  this.startIndex.page &&
             index >=  this.endIndex.page
             
      return index >= this.startIndex.page &&
             index <= this.endIndex.page
    },
    canComment() {
      let text = this.$store.getters['reader/getSelectedText'];
      return this.isloggedIn && this.highlight && this.bubbleButtonPosition && (text.length >= 1 && text.length <= 200)
    }
  },
  methods: {
    mouseDown(event) {
      this.$store.dispatch('reader/setCurrentPage', this.page);
      if(!this.highlight)
        return;
      this.deselect();
      this.startPoint = this.endPoint = {x: event.offsetX, y:event.offsetY};
      let result = this.findClosestChar(event.offsetX, event.offsetY);
      this.rectangleMode = !result;
      if(!this.rectangleMode) {
        let index = this.page.chars.indexOf(result);
        let point = {page: this.page.number, index: index}
        this.setStartIndex(point),
        this.setEndIndex(point)
      }
    },
    mouseMove: throttle(function handler(event) {
      if(this.highlight && this.selectionStarted) {
        if(!this.rectangleMode || this.startIndex.index > -1)
        {    
          let result = this.findClosestChar(event.offsetX, event.offsetY);
          if(result) {
            let index = this.page.chars.indexOf(result);
            let end = {page: this.page.number, index: index}
            this.setEndIndex(end);
          }
        }else 
          this.endPoint = {x: event.offsetX, y: event.offsetY};
      }
    }, 100 , { leading: false }),
    intersect(a1, b1, a2, b2) {
      return a1 <= b2 && b1 >= a2;
    },
    mouseUp() {
      if(!this.highlight)
        return;
      if(this.selectionStarted && this.rectangleMode && this.startIndex.index == -1 ) {
        let minY = this.getPercent(this.pageDimesions.height, this.rect.pos.minY);
        let maxY = this.getPercent(this.pageDimesions.height, this.rect.pos.maxY);
        let minX = this.getPercent(this.pageDimesions.width, this.rect.pos.minX);
        let maxX = this.getPercent(this.pageDimesions.width, this.rect.pos.maxX);
        for( let ch of this.page.chars ) {
          if(this.intersect(ch.y, ch.y + ch.height, minY, maxY) && this.intersect(ch.x, ch.x + ch.width, minX, maxX)) {
            if(this.startIndex.index == -1) {
              let start = {page: this.page.number, index: this.page.chars.indexOf(ch)}
              this.setStartIndex(start) ;
            }
            let end = {page: this.page.number, index: this.page.chars.indexOf(ch)}
            this.setEndIndex(end);
          }
        }
      }
      this.rectangleMode = false;
    },
    getPercent(del, no) {
      return (no / del)*100;
    },
    pointToSpan(x0, x1, x2) {
      if (x1 <= x0 && x0 <= x2) {
        return 0;
      }
      return x0 < x1 ? x1 - x0 : x0 - x2;
    },
    pointToRectDist(x0, y0, x1, x2, y1, y2) {
      let dx = this.pointToSpan(x0, x1, x2);
      let dy = this.pointToSpan(y0, y1, y2);
      return Math.sqrt(dx * dx + dy + dy);
    },
    findClosestChar(x, y) {
      x = this.getPercent(this.pageDimesions.width, x);
      y = this.getPercent(this.pageDimesions.height, y);
      
      let minDist = 2;
      let res = null;
      for (let ch of this.page.chars) {
        let dist = this.pointToRectDist(x, y, ch.x, ch.x + ch.width, ch.y, ch.y + ch.height);
        if (dist < minDist) {
          minDist = dist;
          res = ch;
        }
      }
      return res;
    },
    deselect() {
      this.setStartIndex(null);
      this.setEndIndex(null)
    },
    getHighlights() {
      this.highLights = [];
      /*reader.getHighlights(this.page.pageNum, this.documentId, this.query,
        (data) => {
          const boxes = [];
          for (const box of data) {
            boxes.push({
              top: box.y1 / 100,
              left: box.x1 / 100,
              width: (box.x2 - box.x1) / 100,
              height: (box.y2 - box.y1) / 100,
            });
          }
          this.highLights = boxes;
        },
        () => {}
      );*/
    },
    ...mapActions('reader', ['setStartIndex', 'setEndIndex', 'setSelectedComment']),
    isSelectionInPage(selection, index) {
      let startIndex, endIndex;
      if(selection.startPage == this.page.number && selection.endPage == this.page.number) {
        startIndex = selection.startIndex;
        endIndex = selection.endIndex;
      } else if (selection.startPage == this.page.number) {
        startIndex = selection.startIndex;
        endIndex = this.page.chars.length - 1;
      } else if (selection.endPage == this.page.number) {
        startIndex = 0;
        endIndex = selection.startIndex;
      }
      return index >= startIndex && index <= endIndex
    },
    selectSection(event, index) {
      this.setSelectedComment({ref: 'page', index: index});
      event.stopImmediatePropagation();
    },
    openCommentDialog() {
      this.$store.dispatch('openDialog',{name:'Comment'});
    }
  },
  watch: {
    query() {
      this.getHighlights();
    },
    selectedComment: {
      handler: function(newValue) {
                if(newValue.ref == 'page' || newValue.index == -1)
                    return
                  let selection = this.selections[newValue.index];
                  if(selection.startPage == this.page.number)
                    try{
                      this.$el.scrollIntoView();
                    }catch(err) {
                      console.log(err)
                    }
              },
      deep: true
    }
  },
  components: {
    Thumb
  }
};
</script>

<style scoped>
.unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
}
.page-container {
    display: none;
    white-space: nowrap;
}
.vscroll .page-container {
    display: block;
    padding: 30px 10px;
}
.hscroll .page-container {
    padding: 1px 1%;
    width: 49%;
    height: 100%;
    vertical-align: top;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
}
.page.unavailable {
    background-color: #337DCC;
    color: white;
    text-align: center;
    font-size: 18px;
    padding: 11px;
    direction: rtl;
}
.page img {
    width: 100%;
    vertical-align: middle;
    box-shadow: 0px 0px 6px rgba(50, 50, 50, 0.25);
}
.page {
    position: relative;
    display: inline-block;
    /* if you need ie6/7 support */
    *display: inline;
    zoom: 1;
    background-color: white;
    vertical-align: top;
}
/*.hscroll .page-container:after{content: ' '; display:inline-block; height: 100%; vertical-align: middle; }*/

.hscroll .page {
    vertical-align: middle;
}
.unselectable {
    user-select: none;
}
.bookmark {
    position: absolute;
    top: 0px;
    left: 20px;
}
.bookmark a {
    display: inline-block;
    width: 20px;
    height: 25px;
    background: url("/images/bookmark.png");
}
.bookmark a:hover,
.bookmark a.marked {
    background-position: -20px;
}
.bookmark a.marked:hover {
    background-position: 0;
}
.hl-block {
  background-color: rgba(235, 255, 0, 0.498039);
  position: absolute;
  z-index: 1;
}
.user-selections,.page-selections {
  position: absolute;
  padding: 0;
  margin: 0;
  z-index: 1;
}
.user-selections {
  background-color: rgba(186, 211, 255, 0.603)
}
.page-selections {
   background-color: rgba(248, 245, 56, 0.603)
}
.rectangle {
  background-color: lightblue;
  display: inline-block;
  position: absolute;
  opacity: 0.5;
  z-index: 2;
  pointer-events: none;
}
.coverPage {
  position: absolute;
  z-index: 1;
}
.bubble-button {
  background: rgba(255,255,255,0.85);
  -webkit-transition: color 0.3s;
  -moz-transition: color 0.3s;
  box-shadow: 0 3px 3px #ddd;
  transition: color 0.3s;
  border-radius: 100%;
  position: absolute;
  padding-left: 2px;
  padding-top: 9px;
  color: lightblue;
  left: -20px;
  height: 40px;
  width: 40px;
  z-index: 2;
  cursor: -webkit-grab;
}
@media screen  and (max-width: 600px ) {
  .bubble-button {
    position: fixed;
    bottom: 40px;
    right: 40px; 
    top: unset !important;
  }
}
.bubble-button:hover {
  color: #027be3;
}
#page-image{position: absolute;}
.current_page-selections {box-shadow: 0px 0px 20px 0px #a2f942;}
</style>
