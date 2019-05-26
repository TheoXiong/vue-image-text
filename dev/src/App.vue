<template>
  <div id="app">
    <home></home>
  </div>
</template>

<script>
import Home from '@/views/Home.vue'

export default {
  name: 'App',
  components: { Home } 
}
</script>

<style scoped>

</style>

<style>
html {
  height: 100%;
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  color: #232321;
  min-width: 1200px;
  overflow-x: auto;
  background: #fff !important;
}

* {
  margin: 0;
  padding: 0;
}
</style>