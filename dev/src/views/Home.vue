<template>
  <div id="home">
    <nav-menu :value="menus" @click="onClick" :over-banner="overBanner"></nav-menu>
    <banner></banner>
    <light></light>
  </div>
</template>

<script>
import NavMenu from '@/views/NavMenu.vue'
import Banner from '@/views/Banner.vue'
import Light from '@/views/Light.vue'

export default {
  name: 'Home',
  data() {
    return {
      overBanner: true,
      menus: [{
        key: 'light',
        name: 'Light Theme'
      }, {
        key: 'dark',
        name: 'Dark Theme'
      }]
    }
  },
  methods: {
    onClick (key, name) {
      console.log(`click, key ${key}, name ${name}`)
    }
  },
  components: { NavMenu, Banner, Light }  
}
</script>

<style scoped>
.test{
  margin-top: 100px;
  height: 50px;
  color: aqua;
}

</style>