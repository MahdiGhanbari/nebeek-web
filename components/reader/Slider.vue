<template>
  <div id="scroll" @click="moveTo($event)" @mouseout='tooltip.display="none"' @mousemove="getPageNum($event)">
    <div id="slider" aria-disabled="false">
      <div id="slider-handle" :style="{top: handlePercent + '%'}"></div>
      <div v-for="section in sections" class="slider-overly" style="width: 8px; top: 0.35842%;"></div>
    </div>
      <div id="tooltip" :style="{top: tooltip.top + '%', display: tooltip.display}">
        <div id="arrow"></div>
        <span>{{tooltip.str}}</span>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      sections: [],
      tooltip: {
        top: 0,
        str: "",
        display: "none"
      }
    };
  },
  methods: {
    moveTo(event) {
      this.$store.dispatch('reader/navigateTo', this.getPageNum(event));
    },
    getPageNum(event) {
      const y = event.offsetY === undefined ? event.layerY : event.offsetY;
      const height = this.$el.clientHeight;
      const newValue = (y * this.$store.state.reader.pages.length) / height;
      //assign tooltipeValue and tooltipTop
      let str = this.$store.state.lingual == 'fa' ? " صفحه" : "page ";
      this.tooltip.str = str + Math.floor(newValue + 1);
      this.tooltip.top = (newValue * 100 / this.$store.state.reader.pages.length) - ( 15 * 100 / event.target.clientHeight); 
      this.tooltip.display = "block";
      //
      return newValue
    }
  },
  computed: {
    handlePercent() {
      return this.$store.state.reader.visibleFrom * 100 / this.$store.state.reader.pages.length; 
    }
  },
};
</script>

<style scoped>
#scroll {
    left: 0;
    top: 65px;
    bottom: 35px;
    padding: 0 25px;
    margin: 15px 0;
    position: absolute;
    z-index: 2;
    cursor: pointer;
}
#slider {
    width: 8px;
    height: 100%;
    position: relative;
    border-radius: 8px;
    border: none;
    background: #D5D5D5;
}
#scroll:hover #slider {
    background: #6BBEFF;
}
#slider-handle {
    pointer-events: none;
    display: inline-block;
    width: 15px;
    height: 15px;
    position: absolute;
    z-index: 10;
    border: 1px solid #bfbfbf;
    background: #fcfcfc;
    outline: none;
    border-radius: 8px;
    left: -4px;
    margin-top: -8px;
    transition: top 10ms;
}
.slider-overly {
  position: absolute;
  z-index: 2;
}
.ui-slider-unavailable {
    background-color: gray;
}
.ui-slider-highlight {
    background: #ffdd00;
    opacity: 0.75;
    filter: alpha(opacity=75);
}
.ui-slider-bookmark {
    background: #FF1818;
}
#arrow {
  width: 0; 
  height: 0; 
  border-top: 13px solid transparent;
  border-bottom: 13px solid transparent; 
  border-right:10px solid #424242; 
  position: absolute;
  z-index: -1;
  top: 0%;
  left: -10px;
}
#tooltip {
  pointer-events: none;
  width: max-content;
  background-color: #424242;
  position: absolute;
  left: 48px;
  padding: 2.5px 5px;
  border-radius: 0px 5px 5px 0px;
  color: white;
}
</style>