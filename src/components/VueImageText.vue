<template>
  <div class="imgae-text" ref="wrapper" @dragstart="dragStart" @drag="drag" @dragend="dragEnd">
    <div class="tool-box">
      <div class="tool-box-add">
        <vue-button @click="addText" type="text" :disabled="isExceed"><i class="iconfont icontext"></i></vue-button>
      </div>
      <div class="tool-box-bold tool-box-style">
        <span class="tool-box-tip">Bold</span>
        <vue-button @click="style.isBold = !style.isBold" :activated="style.isBold" type="text"><i class="iconfont iconbold tool-box-icon"></i></vue-button>
      </div>
      <div class="tool-box-italic tool-box-style">
        <span class="tool-box-tip">Italic</span>
        <vue-button @click="style.isItalic = !style.isItalic" :activated="style.isItalic" type="text"><i class="iconfont iconitalic tool-box-icon"></i></vue-button>
      </div>
      <div class="tool-box-size tool-box-style">
        <span class="tool-box-tip">Font Size</span>
        <div class="tool-box-range">
          <input type="range" :min="minFontSize" :max="maxFontSize" v-model="style.fontSize" class="tool-box-range-input">
          <span class="tool-box-range-value">{{ style.fontSize }}</span>
        </div>
      </div>
      <div class="tool-box-color tool-box-style">
        <span class="tool-box-tip">Font Color</span>
        <div class="tool-box-select-color">
          <input type="color" v-model="style.color" class="select-color-input">
          <span class="select-color-value">{{ style.color }}</span>
        </div>
      </div>
      <div class="tool-box-clear tool-box-operate">
        <span class="tool-box-tip">Clear</span>
        <vue-button @click="clearText" type="text"><i class="iconfont icondelete tool-box-icon"></i></vue-button>
      </div>
    </div>
    <canvas id="canvas" @click="onClickCanvas($event)"></canvas>
    <transition-group :name="transitionName">
      <div
        class="text-input-wrap"
        draggable="true"
        v-for="item in texts"
        :key="item.key"
        :class="{
          active: item.isActive || selectedText === item.key,
          empty: !item.value && !item.isActive,
          editing: item.editing
        }"
        :id="wrapPrefix + item.key"
      >
        <input
          v-model="item.value"
          @dblclick.stop.prevent="onDblclick(item)"
          @input="onInput(item)"
          @focus="onFocus(item)"
          @blur="onBlur(item)"
          @keyup.esc="onEsc(item)"
          @keyup.delete="onDelete(item)"
          :id="item.key"
          :readonly="!item.editing"
          :style="{
            color: item.color,
            fontSize: item.fontSize + 'px',
            fontWeight: item.isBold ? '600' : '400',
            fontStyle: item.isItalic ? 'italic' : 'normal',
          }"
          class="text-input"
          ref="textInput"
        >
      </div>
    </transition-group>
  </div>
</template>

<script>
import VueButton from './VueButton.vue'
import '../assets/iconfont/iconfont.css'
import '../assets/css/transition.css'

const VALID_ANIMATION = ['top-top', 'top-bottom', 'left-left', 'left-right', 'right-right', 'big-big', 'big-small', 'small-big', 'small-small', 'none']

export default {
  name: 'VueImageText',
  data () {
    return {
      wrapPrefix: 'wrap-',
      wrapper: null,
      canvas: null,
      ctx: null,
      imageSrc: '',
      isDraging: false,
      mouseX: 0,
      mouseY: 0,
      itemX: 0,
      itemY: 0,
      activeArea: { w: 0, h: 0 },
      textId: 0,
      texts: [],
      isExceed: false,
      selectedText: '',
      style: {
        isBold: false,
        isItalic: false,
        fontSize: 14,
        color: '#575F96'
      }
    }
  },
  props: {
    defaultText: { type: String, default: 'Text' },
    minFontSize: {
      type: Number,
      default: 12,
      validator: value => { return (value >= 10) && (value <= 24) && ((value | 0) === value) }
    },
    maxFontSize: {
      type: Number,
      default: 48,
      validator: value => { return (value >= 24) && (value <= 72) && ((value | 0) === value) }
    },
    defaultFontSize: { type: Number, default: 20 },
    defaultTextColor: { type: String, default: '#731ed0' },
    maxTextNum: { type: Number, default: 50 },
    maxCanvasHeight: { type: Number, default: 5000 },
    followImageWidth: { type: Boolean, default: true },
    fillColor: { type: String, default: '#ffffff' },
    paddingLeft: { type: Number, default: 10, validator: value => { return value > 0 } },
    paddingRight: { type: Number, default: 10, validator: value => { return value > 0 } },
    paddingTop: { type: Number, default: 10, validator: value => { return value > 0 } },
    paddingBottom: { type: Number, default: 10, validator: value => { return value > 0 } },
    animation: {
      type: String,
      default: 'big-small',
      validator: value => { return VALID_ANIMATION.includes(value) }
    }
  },
  computed: {
    transitionName () {
      if (VALID_ANIMATION.includes(this.animation)) {
        return this.animation
      } else {
        return 'none'
      }
    }
  },
  watch: {
    style: {
      handler (s) {
        this.onStyleChange(s)
      },
      deep: true
    },
    texts: {
      handler (t) {
        if (t && t.length >= this.maxTextNum) {
          this.isExceed = true
        } else {
          this.isExceed = false
        }
      }
    }
  },
  mounted () {
    this.wrapper = this.$refs.wrapper || document.querySelector('.imgae-text') || {}
    this.canvas = document.getElementById('canvas')
    this.resetCanvasSize()
    this.ctx = this.canvas.getContext('2d')
    this.bindDragEvent()
    this.initStyle()
  },
  beforeDestroy () {
    this.destroy()
  },
  methods: {
    destroy () {
      this.wrapper = null
      this.canvas = null
      this.ctx = null
      this.isDraging = false
      this.itemX = 0
      this.itemY = 0
      this.textId = 0
      this.texts.splice(0, this.texts.length)
    },
    initStyle () {
      this.style.fontSize = this.defaultFontSize
      this.style.color = this.defaultTextColor
    },
    bindDragEvent () {
      this.$refs.wrapper.ondragenter = (e) => {
        e.preventDefault()
      }
      this.$refs.wrapper.ondragover = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }
      this.$refs.wrapper.ondrop = (e) => {
        e.preventDefault()
      }
    },
    resetCanvasSize () {
      this.canvas.width = this.wrapper.offsetWidth
      this.canvas.height = this.canvas.width / 2
    },
    adjustCanvasSize (imageWidth, imageHeight) {
      let wrapperWidth = this.wrapper.offsetWidth
      let containerWidth = wrapperWidth - this.paddingLeft - this.paddingRight
      if (!(containerWidth > 0)) throw new Error(`The width (${containerWidth}) of container is invalid.`)
      let adjustedSize = {}
      let ratio = imageWidth / imageHeight
      if (imageWidth > containerWidth) {
        adjustedSize.pressed = true
        adjustedSize.width = containerWidth
        adjustedSize.height = containerWidth / ratio
        let containerHeight = adjustedSize.height + this.paddingTop + this.paddingBottom
        this.canvas.width = wrapperWidth
        this.canvas.height = containerHeight > this.maxCanvasHeight ? this.maxCanvasHeight : containerHeight
      } else {
        adjustedSize.pressed = false
        adjustedSize.width = imageWidth
        adjustedSize.height = imageHeight
        let containerHeight = adjustedSize.height + this.paddingTop + this.paddingBottom
        this.canvas.height = containerHeight > this.maxCanvasHeight ? this.maxCanvasHeight : containerHeight
        if (this.followImageWidth) {
          this.canvas.width = imageWidth + this.paddingLeft + this.paddingRight
        } else {
          this.canvas.width = wrapperWidth
        }
      }
      return adjustedSize
    },
    showImage (src) {
      if (!(typeof src === 'string' && src)) throw new Error('[ showImage ] Invalid src.')
      this.imageSrc = ''
      this.resetCanvasSize()
      let image = new Image()
      image.onload = () => {
        let adjustedSize = this.adjustCanvasSize(image.width, image.height)
        this.fillBackground()
        let blankSpace = this.canvas.width - adjustedSize.width - this.paddingLeft - this.paddingRight
        this.ctx.drawImage(image, 0, 0, image.width, image.height, (this.paddingLeft + blankSpace) / 2, this.paddingTop, adjustedSize.width, adjustedSize.height)
        this.activeArea.w = this.wrapper.offsetWidth
        this.activeArea.h = this.wrapper.offsetHeight
        this.imageSrc = src
      }
      image.src = src
    },
    addText () {
      let id = this.textId++
      let textItem = {
        key: `text-input-${id}`,
        value: this.defaultText,
        isActive: false,
        editing: false,
        x: 50,
        y: 50,
        ...this.style
      }
      this.texts.push(textItem)
      setTimeout(() => {
        let textInput = this.findInput(textItem.key)
        if (textInput) {
          this.updateTextArea(textInput, textItem)
          this.$nextTick(() => {
            textInput.focus()
          })
        }
      }, 50)
    },
    clearText () {
      this.texts.splice(0, this.texts.length)
    },
    drawText () {
      this.texts.forEach(item => {
        if (item.value && typeof item.x === 'number' && typeof item.y === 'number' && item.x >= 0 && item.y >= 0) {
          let fontStyle = item.isItalic ? 'italic' : 'normal'
          let fontWeight = item.isBold ? '600' : '400'
          this.ctx.font = `${fontStyle} ${fontWeight} ${item.fontSize}px Arial, Helvetica, sans-serif`
          this.ctx.fillStyle = item.color
          this.ctx.textBaseline = 'top'
          this.ctx.fillText(item.value, item.x, item.y)
        }
      })
    },
    fillBackground () {
      this.ctx.fillStyle = this.fillColor || '#ffffff'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    },
    save (type, cb = () => {}) {
      this.drawText()
      let imgBase64 = this.canvas.toDataURL(`image/${type}`, 1)
      cb(imgBase64)
    },
    dragStart (e) {
      e.dataTransfer.setData('text', '')
      e.dataTransfer.effectAllowed = 'move'
      this.isDraging = true
      this.refreshPosition(e)
    },
    drag (e) {
      this.isDraging = true
      e.target.style.opacity = '0.4'
      this.confirmPosition(e)
      this.refreshPosition(e)
    },
    dragEnd (e) {
      this.confirmPosition(e)
      this.isDraging = false
      e.target.style.opacity = '1'
      let textItem = this.findTextItem(e.target.id.replace(this.wrapPrefix, ''))
      if (textItem) {
        let distance = (this.wrapper.offsetWidth - this.canvas.width) / 2
        textItem.x = e.target.offsetLeft - distance
        textItem.y = e.target.offsetTop - 70
      }
    },
    refreshPosition (e) {
      this.mouseX = e.pageX
      this.mouseY = e.pageY
      this.itemX = e.target.offsetLeft
      this.itemY = e.target.offsetTop
    },
    confirmPosition (e) {
      let offsetLeft = this.itemX + e.pageX - this.mouseX
      let offsetTop = this.itemY + e.pageY - this.mouseY
      if (offsetLeft < 0) {
        offsetLeft = 0
      } else if (offsetLeft > (this.activeArea.w - e.target.offsetWidth)) {
        offsetLeft = this.activeArea.w - e.target.offsetWidth
      }
      if (offsetTop < 70) {
        offsetTop = 70
      } else if (offsetTop > (this.activeArea.h - e.target.offsetHeight)) {
        offsetTop = this.activeArea.h - e.target.offsetHeight
      }
      e.target.style.left = offsetLeft + 'px'
      e.target.style.top = offsetTop + 'px'
    },
    findTextItem (key) {
      return this.texts.find(item => {
        return item.key === key
      })
    },
    findInput (key) {
      if (this.$refs.textInput && this.$refs.textInput.length > 0) {
        return this.$refs.textInput.find(item => {
          return item.id === key
        })
      } else {
        return null
      }
    },
    removeInput (key) {
      let index = this.texts.findIndex(item => {
        return item.key === key
      })
      index >= 0 ? this.texts.splice(index, 1) : ''
    },
    updateTextArea (textInput, textItem) {
      if (textItem.value) {
        let fontStyle = textItem.isItalic ? 'italic' : 'normal'
        let fontWeight = textItem.isBold ? '600' : '400'
        this.ctx.font = `${fontStyle} ${fontWeight} ${textItem.fontSize}px Arial, Helvetica, sans-serif`
        let size = this.ctx.measureText(textItem.value)
        textInput.style.width = size.width + 14 + 'px'
      } else {
        textInput.style.width = '14px'
      }
    },
    onDblclick (textItem) {
      textItem.editing = true
      setTimeout(() => {
        let textInput = this.findInput(textItem.key)
        if (textInput) {
          textInput.selectionStart = textItem.value.length
          textInput.selectionEnd = textItem.value.length
        }
      }, 20)
    },
    onInput (textItem) {
      let textInput = this.findInput(textItem.key)
      this.updateTextArea(textInput, textItem)
    },
    onFocus (textItem) {
      textItem.isActive = true
      this.selectedText = textItem.key
    },
    onBlur (textItem) {
      textItem.isActive = false
      textItem.editing = false
    },
    onEsc (textItem) {
      if (textItem.editing) {
        textItem.editing = false
      } else {
        this.removeInput(textItem.key)
      }
    },
    onDelete (textItem) {
      textItem.editing ? '' : this.removeInput(textItem.key)
    },
    onClickCanvas (e) {
      this.selectedText = ''
    },
    onStyleChange (style) {
      if (!this.selectedText) return
      let textItem = this.findTextItem(this.selectedText)
      let textInput = this.findInput(this.selectedText)
      if (textItem && textInput) {
        Object.assign(textItem, style)
        this.updateTextArea(textInput, textItem)
      }
    }
  },
  components: { VueButton }
}
</script>

<style scoped>
.imgae-text{
  position: relative;
  width: 100%;
  min-width: 100px;
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid rgba(0,0,0,0.2);
  overflow: hidden;
}
#canvas{
  box-sizing: border-box;
  display: block;
  margin: 0 auto;
}
.text-input-wrap{
  position: absolute;
  top: 20%;
  left: 40%;
  display: inline-block;
  box-sizing: border-box;
  font-size: 14px;
  color: #606266;
  border: 1px dotted transparent;
  border-radius: 0;
  background-color: transparent;
  overflow: hidden;
  outline: none;
  z-index: 999;
  -webkit-appearance: none;
}
.active{
  border: 1px dotted purple;
}
.empty{
  border: 1px dotted green;
}
.editing{
  border: 1px solid purple;
}
.text-input{
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  -webkit-user-select: none;
  user-select: none;
  font-family: Arial, Helvetica, sans-serif;
}

.tool-box{
  margin-bottom: 6px;
  padding: 0 16px;
  height: 64px;
  background-color: rgba(200, 200, 200, 0.2);
  border-bottom: 1px solid rgba(96, 98, 102, 0.07);
  display: flex;
  align-items: center;
}
.tool-box-add{
  padding: 5px 16px 5px 0px;
  margin-right: 16px;
  border-right: 1px solid rgba(96, 98, 102, 0.3);
}
.tool-box-add .icontext{
  font-size: 20px;
  font-weight: 600;
}
.tool-box-style, .tool-box-operate{
  margin-right: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tool-box-tip{
  color: #909399;
  font-size: 11px;
  cursor: default;
  -webkit-user-select: none;
  user-select: none;
}
.tool-box .tool-box-icon{
  font-size: 18px;
}
.tool-box-range, .tool-box-select-color{
  display: flex;
  align-items: center;
  height: 30px;
  padding: 3px 12px;
}
.tool-box-range-input{
  width: 100px;
  height: 18px;
}
.tool-box-range-value, .select-color-value{
  margin-left: 4px;
  padding: 4px;
  font-size: 12px;
  background-color: #e5e5e5;
  border-radius: 2px;
}

.tool-box-clear{
  margin-left: 8px;
  padding-left: 14px;
  border-left: 1px solid rgba(96, 98, 102, 0.3);
}

</style>
