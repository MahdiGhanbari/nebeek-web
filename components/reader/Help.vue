<template>
  <div id="help">
    <h2>راهنما</h2>
    <ul>
      <li><a >درباره مستند</a></li>
      <li><a >نحوه استفاده از محیط (به زودی)</a></li>
      <li>
      <a href="<?php echo $this->createUrl('/documents/site/contact?title=docReport&msg='.$model->uid);?>" >گزارش اشکالات</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
};
</script>

<style>
</style>
