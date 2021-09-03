<template>
  <div class="loading-page bg-opacity" :style="{display:hide?'none':'block'}">
    <div class="dark" @dblclick="close">
      <div class="la-ball-spin-clockwise la-2x">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>
 
<script>
  export default {
    data() {
      return {
        hide: true
      }
    },
    methods: {
      close() {
        document.querySelector('.loading-page').style.display = 'none';
      }
    }
  }
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .show {
    display: block;
  }
 
  .hide {
    display: none;
  }
</style>