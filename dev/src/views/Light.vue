<template>
  <div class="light">
    <div class="container">
      <vue-image-text ref="imageText"></vue-image-text>
    </div>
  </div>
</template>

<script>
import lightImage from '@/assets/image/bg1.jpg'

export default {
  name: 'Light',
  data() {
    return {
    }
  },
  mounted () {
    this.$refs.imageText.show(lightImage)

    // ctx.save()
    // ctx.rotate(20 * Math.PI / 180)
    // ctx.fillText('2.Rotate+20', 100, 150)
    // ctx.restore()
  },
  methods: {

  }
}
</script>

<style scoped>
.light{
  padding: 30PX;
}

</style>