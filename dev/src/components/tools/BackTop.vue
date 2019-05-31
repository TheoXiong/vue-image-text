<template>
  <div class="back-top">
    <div class="back-top-bt flex-c-c" @click="onClick">
      <span class="btn-icon"><i class="iconfont iconup"></i></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackTop',
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.back-top{
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 9999;
}
.back-top-bt{
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #409EFF;
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3);
  cursor: pointer;
}
.back-top-bt:hover{
  background-color: rgb(35, 143, 250);
}
.btn-icon{
  height: 18px;
  line-height: 18px;
}
.btn-icon .iconup{
  font-size: 18px;
  color: #fff;
}
</style>