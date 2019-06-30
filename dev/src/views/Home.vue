<template>
  <div id="home" ref="home" @scroll="onScroll">
    <nav-menu :value="menus" @click="onClick" :over-banner="overBanner"></nav-menu>
    <banner></banner>
    <feature ref="feature"></feature>
    <demo ref="demo"></demo>
    <usage ref="usage"></usage>
    <transition name="bottom-bottom">
      <back-top v-if="showTopButton" @click="toTop"></back-top>
    </transition>
  </div>
</template>

<script>
import NavMenu from '@/views/NavMenu.vue'
import Banner from '@/views/Banner.vue'
import Feature from '@/views/Feature.vue'
import Demo from '@/views/Demo.vue'
import Usage from '@/views/Usage.vue'
import BackTop from '@/components/tools/BackTop.vue'
import { scrollTo } from 'scroll-ease-efficient'

export default {
  name: 'Home',
  data () {
    return {
      overBanner: true,
      showTopButton: false,
      scrollDuration: 400,
      menus: [{
        key: 'feature',
        name: 'Feature',
        ref: 'feature'
      }, {
        key: 'demo',
        name: 'Demo',
        ref: 'demo'
      }, {
        key: 'usage',
        name: 'Usage',
        ref: 'usage'
      }]
    }
  },
  mounted () {
    console.log('tt', this.$refs.feature.$el.offsetTop)
  },
  methods: {
    onClick (item) {
      if (item && this.$refs && this.$refs[item.ref] && this.$refs[item.ref].$el) {
        let targetPosition = this.$refs[item.ref].$el.offsetTop - 70
        scrollTo(this.$refs.home, targetPosition, { duration: this.scrollDuration })
      }
    },
    onScroll () {
      if (!(this.$refs && this.$refs.home)) return
      let scrollTop = this.$refs.home.scrollTop

      if (scrollTop > 425) {
        this.overBanner = false
      } else {
        this.overBanner = true
      }

      if (scrollTop > 50) {
        this.showTopButton = true
      } else {
        this.showTopButton = false
      }
    },
    toTop () {
      scrollTo(this.$refs.home, 0, { duration: this.scrollDuration })
    }
  },
  components: { NavMenu, Banner, Feature, Demo, Usage, BackTop }
}
</script>

<style scoped>
#home{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
</style>
