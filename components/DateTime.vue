<template>
    <span @click="relative=!relative" :class="{date: value}">
      <span v-if="editable" class="edit">
        <input v-model="year" type="number" autocomplete="off">
        <select v-model="month">
          <option v-for="i in 12" :value="i">{{monthName[i - 1][local][0]}}</option>
        </select>
        <select v-model="day">
          <option v-for="i in monthName[month - 1][local][1]" :value="i">{{i}}</option>
        </select>
      </span>
      <span v-else id="dateViewer"> {{relative ? getRelative : getAbsolute}}</span>
    </span>
</template>

<script>
import jalaali from 'jalaali-js';
import {mapState} from 'vuex';
export default {
  props: ['value', 'editable'],
  data() {
    return {
      relative: true,
      y:1,
      m:1,
      d:1,
      monthName: [
        {fa: ['فروردین', 31], en: ['January', 31]},
        {fa: ['اردیبهشت', 31], en: ['February', 29]},
        {fa: ['خرداد', 31], en: ['March', 31]},
        {fa: ['تیر', 31], en: ['April', 30]},
        {fa: ['مرداد', 31], en: ['May', 31]},
        {fa: ['شهریور', 31], en: ['June', 30]},
        {fa: ['مهر', 30], en: ['July', 31]},
        {fa: ['آبان', 30], en: ['August', 31]},
        {fa: ['آذر', 30], en: ['September', 30]},
        {fa: ['دی', 30], en: ['October', 31]},
        {fa: ['بهمن', 30], en: ['November', 30]},
        {fa: ['اسفند', 29], en: ['December', 31]}
      ]
    };
  },
  methods: {
    getRelativeFormat(diff, index) {
      let enFormat = ['Year', 'Month', 'Day', 'Hour','Minute','Recently'];
      let faFormat = ['سال', 'ماه', 'روز', 'ساعت', 'دقیقه', 'اخیرا'];
      let str = null, end = null; 
    
      if(this.local == 'fa') {
        end = diff < 0 ? ' بعد' : ' پیش';
        if(index == 5)
          end = '';
        str = (diff ? Math.abs(diff) : '') + ' ' + faFormat[index] + end;
      }
      else {
        end = diff < 0 ? 'next' : 'ago';
        if(index == 5)
          end = '';
        let plural =  (index != 6 && diff > 1) ? 's ' : ' ';
        str = (diff ? Math.abs(diff) : '') + ' ' + enFormat[index] + plural + end; 
      }
      return str;
    },
    initial() {
      this.y = this.date.year;
      this.m = this.date.month.index;
      this.d = this.date.day;
    },
    calcRelative(diff, DT1, DT2, index) {
      let value1 = DT1[index];
      let value2 = DT2[index];
      let max = [0, 12, 30, 24, 60, 60];
      if(diff == -1 || diff == 1) {
        let from = diff > 0 ? value2 : value1;
        let to = diff < 0 ? value2 : value1;
        diff = (max[index] - from) + to ;
      } else if(diff == 0) 
        diff = value1 - value2;
    
      if(index == 5)
        return this.getRelativeFormat(null, index);
      else if(diff >= -1 && diff <= 1)
        return this.calcRelative(diff, DT1, DT2, ++index);

      return this.getRelativeFormat(diff, index)
    },
  },
  computed: {
      getAbsolute() { 
        let str="";
        if(this.local == 'fa') 
          str = this.date.day + "/" + this.date.month.name + "/" + this.date.year;
        else 
          str = this.date.year + "/" + this.date.month.name + "/" + this.date.day;
        return str; 
      },
      getRelative() {
        let DT1 = [this.now.year, this.now.month, this.now.day, this.now.hour, this.now.minute, this.now.second]
        let DT2 = [this.value.year, this.value.month, this.value.day, this.value.hour, this.value.minute, this.value.second]
        return this.calcRelative(0, DT1, DT2, 0)
      },
      ...mapState({
        local: state => state.lingual,
        now: state => state.calendar.currentDateTime
      }),
      date() {
        if(this.local == 'fa') {
          let jal = jalaali.toJalaali(Number(this.value.year), Number(this.value.month), Number(this.value.day));
          return {year: jal.jy, month: {index: jal.jm,
                                        name: this.monthName[jal.jm - 1]['fa'][0], 
                                        lastDay: this.monthName[jal.jm - 1]['fa'][1]},
                  day: jal.jd};
        }else 
          return {year: this.value.year, month: {index: this.value.month, 
                                                name: this.monthName[this.value.month - 1]['en'][0],
                                                lastDay: this.monthName[this.value.month - 1]['en'][1]},
                  day: this.value.day}
      },
      year: {
        set(year) {
          if(Number.isInteger(Number(year)) && (year.length >= 2 && year.length <= 4)) {
            this.y = year;
          }
        },
        get() {
          return this.y;
        }
      },
      month: {
        set(month) {
          this.m = month;
          if(this.monthName[this.month - 1][this.local][1] < this.day) {
            this.day = this.monthName[this.month - 1][this.local][1];
          }
        },
        get() {
          return this.m;
        }
      },
      day: {
        set(day) {
          this.d = day;
        },
        get() {
          return this.d;
        }
      }
  },
  created() {
    this.initial()
  },
  watch: {
    editable: function() {
      if(this.editable)
        return;
      if(this.local == 'fa') {
          let gre = jalaali.toGregorian(Number(this.year), Number(this.month), Number(this.day))
          this.value.year = gre.gy;
          this.value.month = gre.gm;
          this.value.day = gre.gd;
        }else {
          this.value.year = this.year;
          this.value.month = this.month;
          this.value.day = this.day;
        }
        this.$emit('input', this.value);
    },
    local: function() {
      this.initial()
      }
  }
}
</script>
<style scoped>
.date:hover {cursor: pointer;}
.date-enter-active, .date-leave-active {
  transition: opacity .7s;
}
.date-enter, .date-leave-to{
  opacity: 0;
  position: absolute;
}
input { width: 70px; line-height: 26px;}
.edit * { 
  margin: 0 5px;
  text-align: center;
  border: none;
  border-bottom: 1px solid #aaa;
  outline: none;
}
.edit *:focus { border-bottom-color: rgb(10, 125, 224);}
#dateViewer {display: inline-block}
</style>