<template>
  <div v-if="hasData">
    <bar-chart v-if="type == 'bar'" :data="getData"/>
    <line-chart v-if="type == 'line'"  :data="getData"/>
  </div>
</template>

<script>
export default {
  props: ['type', 'labels', 'data', 'name', 'color'],
  data () {
    return {
      hasData: false
    }
  },
  mounted () {
    this.hasData = true;
  },
  computed: {
    getData() {
      if(this.labels && this.data)
        return {
          labels: this.labels,
          datasets:[{
            data: this.data,
            label: this.name,
            fill: false,
            borderColor: this.color
          }]
        }
      this.hasData = false;
    }
  }  
}
</script>