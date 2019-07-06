<template>
  <div class="demo-control">
    <el-divider content-position="center">Tools</el-divider>
    <div class="control">
      <div class="control-item flex-c">
        <el-tooltip content="Change the theme of toolbar" placement="top">
          <div><span class="control-item-label">Theme</span></div>
        </el-tooltip>
        <div>
          <el-radio-group v-model="theme" size="mini" @change="onThemeChange">
            <el-radio-button label="light"></el-radio-button>
            <el-radio-button label="dark"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="control-item flex-c">
        <el-tooltip content="Change the animation of text" placement="top">
          <div><span class="control-item-label">Animation</span></div>
        </el-tooltip>
        <div>
          <el-select v-model="animation" size="mini" placeholder="select" @change="onAnimationChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="control-item flex-c">
        <el-tooltip content="Show or hide the toolbar" placement="top">
          <div><span class="control-item-label">Toolbar</span></div>
        </el-tooltip>
        <div><el-switch v-model="toolbar" @change="onToggleToolbar"></el-switch></div>
        <transition name="right-right">
          <div v-if="!toolbar" class="control-add">
            <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="onAddText"></el-button>
          </div>
        </transition>
      </div>
    </div>
    <el-divider></el-divider>
    <div></div>
    <el-divider content-position="center">Operations</el-divider>
    <div>
      <el-button type="primary" size="mini" icon="el-icon-download" @click="onDownload"></el-button>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: 'DemoControl',
  data () {
    return {
      toolbar: true,
      theme: 'light',
      animation: 'big-small',
      options: [{
        value: 'top-top',
        label: 'top-top'
      }, {
        value: 'top-bottom',
        label: 'top-bottom'
      }, {
        value: 'left-left',
        label: 'left-left'
      }, {
        value: 'left-right',
        label: 'left-right'
      }, {
        value: 'right-right',
        label: 'right-right'
      }, {
        value: 'big-big',
        label: 'big-big'
      }, {
        value: 'big-small',
        label: 'big-small'
      }, {
        value: 'small-big',
        label: 'small-big'
      }, {
        value: 'small-small',
        label: 'small-small'
      }]
    }
  },
  methods: {
    onThemeChange (value) {
      this.$emit('theme-change', value)
    },
    onAnimationChange (value) {
      this.$emit('animation-change', value)
    },
    onToggleToolbar (value) {
      this.$emit('toolbar-change', value)
    },
    onAddText () {
      this.$emit('add-text')
    },
    onDownload () {
      this.$emit('download')
    }
  }
}
</script>

<style scoped>
.control{
  padding: 0 6px;
}

.control-item {
  margin: 12px 6px;
}
.control-item-label{
  font-size: 12px;
  color: #606266;
  display: inline-block;
  width: 64px;
}
.control-add{
  margin-left: 20px;
}
</style>
