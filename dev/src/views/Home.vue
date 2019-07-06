<template>
  <div id="home" ref="home" @scroll="onScroll">
    <banner></banner>
    <feature ref="feature"></feature>
    <transition name="dev-bottom-bottom">
      <back-top v-if="showTopButton" @click="toTop"></back-top>
    </transition>
  </div>
</template>

<script>
import Banner from '@/components/banner/Banner.vue'
import Feature from '@/components/feature/Feature.vue'
import BackTop from '@/components/tools/BackTop.vue'
import { scrollTo } from 'scroll-ease-efficient'

export default {
  name: 'Home',
  data () {
    return {
      showTopButton: false,
      scrollDuration: 400
    }
  },
  mounted () {
  },
  methods: {
    onScroll () {
      if (!(this.$refs && this.$refs.home)) return
      let scrollTop = this.$refs.home.scrollTop
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
  components: { Banner, Feature, BackTop }
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
