<template>
  <div class="flex-c demo">
    <div class="title"><span>Live Demo</span></div>
    <div class="container">
      <vue-image-text
        ref="imageText"
        :defaultFontSize="defaultFontSize"
        :textPaddingLeft="textPaddingLeft"
        :theme="theme"
        :animation="animation"
        :toolbar="toolbar"
        defaultText="Hello"
        defaultTextColor="#CA17E1"
      >
      </vue-image-text>
      <demo-control
        class="control"
        @theme-change="onThemeChange"
        @animation-change="onAnimationChange"
        @toolbar-change="onToggleToolbar"
        @add-text="onAddText"
        @download="onDownload"
      >
      </demo-control>
    </div>
  </div>
</template>

<script>
import demoImg from '@/assets/image/bg1.jpg'
import DemoControl from '@/components/tools/DemoControl.vue'

export default {
  name: 'Demo',
  data () {
    return {
      defaultFontSize: 32,
      textPaddingLeft: 4,
      theme: 'light',
      animation: 'big-big',
      toolbar: true
    }
  },
  mounted () {
    this.$refs.imageText.show(demoImg)

    // ctx.save()
    // ctx.rotate(20 * Math.PI / 180)
    // ctx.fillText('2.Rotate+20', 100, 150)
    // ctx.restore()
  },
  methods: {
    onThemeChange (value) {
      this.theme = value || 'light'
    },
    onAnimationChange (value) {
      this.animation = value || 'big-small'
    },
    onToggleToolbar (value) {
      this.toolbar = !!value
    },
    onAddText () {
      if (this.$refs && this.$refs.imageText && typeof this.$refs.imageText.addText === 'function') {
        this.$refs.imageText.addText({
          value: 'External',
          color: 'rgb(234,67,135)'
        })
      }
    },
    onDownload () {
      if (this.$refs && this.$refs.imageText && typeof this.$refs.imageText.download === 'function') {
        this.$refs.imageText.download()
      }
    }
  },
  components: { DemoControl }
}
</script>

<style scoped>
.demo{
  width: 100%;
  height: 100%;
  padding-top: 70px;
  box-sizing: border-box;
  position: relative;
  flex-direction: column;
  background-color: #fff;
}
.title{
  margin: 10px 0px 40px;
  padding: 10px 0;
  font-size: 24px;
  color: #303133;
  font-weight: 600;
  border-bottom: 2px solid #303133;
}
.container{
  position: relative;
  width: 800px;
  padding: 10px 0 40px;
}
.control{
  position: absolute;
  width: 200px;
  left: -250px;
  top: 0px;
}

</style>
