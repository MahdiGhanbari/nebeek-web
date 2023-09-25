<template>
  <div id="setting">
    <h2>تنظیمات</h2>
    <div>
      <h3>نمایش : </h3>
      <button id="continues" type="button" class="btn btn-default">پی در پی</button>
      <button id="two-side" type="button" class="btn btn-default">دو به دو</button></div>
      <div class="visible-v">
        <h3>بزرگنمایی : </h3>
        <p id="zoomsize">some number</p>
        <button id="zoom-minus" type="button" class="btn btn-default">-</button>
        <button id="zoom-reset" type="button" class="btn btn-default">حالت عادی</button>
        <button id="zoom-plus" type="button" class="btn btn-default">+</button>
      </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped>
#zoomsize {
  text-align: center;
}
</style>
