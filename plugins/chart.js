import Vue from 'vue';
import { Line, Bar } from 'vue-chartjs';
import { Chart  } from 'chart.js';

Chart.defaults.global.defaultFontFamily = 'B Yekan';

Vue.component('line-chart', Line.extend({
  props: ['data'],
  mounted () {
    this.renderChart(this.data)
  },
  watch:{
    data: function(newData) {
      this._chart.config.data = newData;
      this._chart.update();
    }
  }
}));

Vue.component('bar-chart', Bar.extend({
  props: ['data'],
  mounted () {
    this.renderChart(this.data);
  },
  watch:{
    data: function(newData) {
      this._chart.config.data = newData;
      this._chart.update();
    }
  }
}))
