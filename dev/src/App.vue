<template>
  <div id="app">
    <nav-menu :value="menus" @click="onClickMenu"></nav-menu>
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import NavMenu from '@/components/menu/NavMenu.vue'

export default {
  name: 'App',
  data () {
    return {
      menus: [{
        key: 'home',
        name: 'Home',
        path: '/home',
        index: 0
      }, {
        key: 'guide',
        name: 'Guide',
        path: '/guide',
        index: 1
      }, {
        key: 'demo',
        name: 'Demo',
        path: '/demo',
        index: 2
      }],
      currMenuIndex: 0,
      transitionName: 'dev-left-right'
    }
  },
  methods: {
    onClickMenu (item) {
      if (item && item.path && typeof item.index === 'number') {
        if (this.currMenuIndex > item.index) {
          this.transitionName = 'dev-right-left'
        } else {
          this.transitionName = 'dev-left-right'
        }
        this.currMenuIndex = item.index
        this.$router.push({ path: item.path })
      }
    }
  },
  components: { NavMenu }
}
</script>

<style scoped>

</style>

<style>
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
body {
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  color: #232321;
  background: #fff !important;
  overflow: auto;
}
html,
body,
#app{
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

#app{
  min-width: 1200px;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
}
</style>
