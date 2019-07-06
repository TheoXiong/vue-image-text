<template>
  <div
    class="imgae-text"
    @dragstart="dragStart"
    @drag="drag"
    @dragend="dragEnd"
    :class="{'imgae-text-light':effect==='light', 'imgae-text-dark':effect==='dark'}"
  >
    <transition>
      <div v-if="toolbar" class="tool-box v-flex-c" :class="{'tool-box-light':effect==='light', 'tool-box-dark':effect==='dark'}">
        <div class="tool-box-add" :class="{'divider-r-light':effect==='light', 'divider-r-dark':effect==='dark'}">
          <vue-button @click="addText" type="text" :disabled="isExceed" :light="effect==='dark'"><i class="iconfont icontext"></i></vue-button>
        </div>
        <div class="tool-box-bold tool-box-style v-flex-dir-column-c">
          <span class="tool-box-tip" :class="{'tip-light':effect==='light', 'tip-dark':effect==='dark'}">Bold</span>
          <vue-button @click="style.isBold = !style.isBold" :activated="style.isBold" :light="effect==='dark'" type="text" class="bt-style">
            <i class="iconfont iconbold tool-box-icon"></i>
          </vue-button>
        </div>
        <div class="tool-box-italic tool-box-style v-flex-dir-column-c">
          <span class="tool-box-tip" :class="{'tip-light':effect==='light', 'tip-dark':effect==='dark'}">Italic</span>
          <vue-button @click="style.isItalic = !style.isItalic" :activated="style.isItalic" :light="effect==='dark'" type="text" class="bt-style">
            <i class="iconfont iconitalic tool-box-icon"></i>
          </vue-button>
        </div>
        <div class="tool-box-color tool-box-style v-flex-dir-column-c">
          <span class="tool-box-tip" :class="{'tip-light':effect==='light', 'tip-dark':effect==='dark'}">Font Color</span>
          <div class="tool-box-select-color v-flex-c">
            <el-color-picker v-model="style.color" show-alpha :predefine="colors" size="mini" class="v-color-picker"></el-color-picker>
          </div>
        </div>
        <div class="tool-box-size tool-box-style v-flex-dir-column-c">
          <span class="tool-box-tip" :class="{'tip-light':effect==='light', 'tip-dark':effect==='dark'}">Font Size</span>
          <div class="tool-box-range">
            <el-slider v-model="style.fontSize" :min="minFontSize" :max="maxFontSize" class="v-slider-wrap"></el-slider>
          <!-- <span class="tool-box-range-value" :class="{'value-light':effect==='light', 'value-dark':effect==='dark'}">{{ style.fontSize }}</span> -->
          </div>
        </div>
        <div class="tool-box-family tool-box-style v-flex-dir-column-c">
          <span class="tool-box-tip" :class="{'tip-light':effect==='light', 'tip-dark':effect==='dark'}">Font Family</span>
          <div class="tool-box-select-family v-flex-c">
            <el-select v-model="style.fontFamily" placeholder="Select" size="mini" class="v-family-select">
              <el-option
                v-for="family in familys"
                :key="family.value"
                :label="family.label"
                :value="family.value"
                :style="{
                  fontSize: '13px',
                  fontFamily: family.value + ', Arial',
                  height: '24px',
                  lineHeight: '24px'
                }"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="tool-box-clear tool-box-operate v-flex-dir-column-c" :class="{'divider-l-light':effect==='light', 'divider-l-dark':effect==='dark'}">
          <span class="tool-box-tip" :class="{'tip-light':effect==='light', 'tip-dark':effect==='dark'}">Delete</span>
          <vue-button @click="deleteText" :light="effect==='dark'" type="text"><i class="iconfont icondelete tool-box-clear-icon"></i></vue-button>
        </div>
      </div>
    </transition>
    <div class="imgae-text-wrap" ref="wrapper">
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
          :style="{
            top: item.top + 'px',
            left: item.left + 'px'
          }"
          :id="wrapPrefix + item.key"
        >
          <input
            v-model="item.value"
            :placeholder="placeholder"
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
              fontFamily: item.fontFamily + ', Arial',
              paddingLeft: inputPaddingLeft + 'px'
            }"
            class="text-input"
            ref="textInput"
          >
        </div>
      </transition-group>
    </div>
    <a class="img-dl" :href="downloadLink" :download="imageName" ref="downloader"></a>
  </div>
</template>

<script>
import VueButton from './VueButton.vue'
import '../assets/iconfont/iconfont.css'
import '../assets/css/transition.css'
import '../assets/css/flex.css'
import { VALID_THEME, VALID_ANIMATION, COLORS, FONT_FAMILY } from '../utils/consts.js'
import Vue from 'vue'
import { ColorPicker, Slider, Select } from 'element-ui'

Vue.use(ColorPicker)
Vue.use(Slider)
Vue.use(Select)

export default {
  name: 'VueImageText',
  data () {
    return {
      colors: COLORS,
      familys: FONT_FAMILY,
      wrapPrefix: 'wrap-',
      wrapper: null,
      canvas: null,
      ctx: null,
      loading: false,
      imageSrc: '',
      imageName: '',
      downloadLink: '',
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
        fontFamily: 'Arial',
        color: '#606266'
      }
    }
  },
  props: {
    theme: {
      type: String,
      default: 'light',
      validator: value => { return VALID_THEME.includes(value) }
    },
    toolbar: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Text' },
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
    defaultText: { type: String, default: '' },
    defaultTextColor: { type: String, default: '#606266' },
    defaultTextTop: { type: Number, default: 0 },
    defaultTextLeft: { type: Number, default: 0 },
    textPaddingLeft: { type: Number, default: 0 },
    maxTextNum: { type: Number, default: 50 },
    maxCanvasHeight: { type: Number, default: 5000 },
    followImageWidth: { type: Boolean, default: true },
    fillColor: { type: String, default: '#ffffff' },
    paddingLeft: { type: Number, default: 0, validator: value => { return value >= 0 } },
    paddingRight: { type: Number, default: 0, validator: value => { return value >= 0 } },
    paddingTop: { type: Number, default: 0, validator: value => { return value >= 0 } },
    paddingBottom: { type: Number, default: 0, validator: value => { return value >= 0 } },
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
    },
    effect () {
      return VALID_THEME.includes(this.theme) ? this.theme : VALID_THEME[0]
    },
    inputPaddingLeft () {
      if (typeof this.textPaddingLeft === 'number' && this.textPaddingLeft >= 0 && this.textPaddingLeft <= 20) {
        return this.textPaddingLeft
      } else {
        return 0
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
    },
    effect: {
      handler (value) {
        value ? this.customizeStyle() : ''
      }
    }
  },
  mounted () {
    this.initTextStyle()
    this.customizeStyle()
    this.initCanvas()
    this.resetCanvasSize()
    this.bindDragEvent()
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
      this.imageSrc = ''
      this.imageName = ''
      this.downloadLink = ''
    },
    initTextStyle () {
      this.style.fontSize = this.defaultFontSize
      this.style.color = this.defaultTextColor
    },
    getSliderColor () {
      if (this.effect === 'light') {
        return {
          runway: 'rgba(200,200,200,0.8)',
          bar: 'rgba(51,51,51,0.6)',
          button: {
            backgroundColor: 'rgb(240,240,240)',
            borderColor: 'rgba(51,51,51,0.7)'
          }
        }
      } else if (this.effect === 'dark') {
        return {
          runway: 'rgba(51,51,51,0.9)',
          bar: 'rgba(255, 255, 255, 0.7)',
          button: {
            backgroundColor: 'rgb(51,51,51)',
            borderColor: 'rgba(255, 255, 255, 0.8)'
          }
        }
      } else {
        return null
      }
    },
    getPickerColor () {
      if (this.effect === 'light') {
        return {
          trigger: '#e6e6e6'
        }
      } else if (this.effect === 'dark') {
        return {
          trigger: 'rgba(200, 200, 200, 0.4)'
        }
      } else {
        return null
      }
    },
    getFamilyColor () {
      if (this.effect === 'light') {
        return {
          input: {
            backgroundColor: 'rgba(200, 200, 200, 0.4)',
            color: '#606266'
          }
        }
      } else if (this.effect === 'dark') {
        return {
          input: {
            backgroundColor: 'rgba(51,51,51,0.7)',
            color: 'rgba(255, 255, 255, 0.8)'
          }
        }
      } else {
        return null
      }
    },
    customizeStyle () {
      let sliders = document.getElementsByClassName('v-slider-wrap')
      let sliderColor = this.getSliderColor()
      if (sliders && sliders.length > 0 && sliderColor) {
        for (let i = 0; i < sliders.length; i++) {
          let runways = sliders[i].getElementsByClassName('el-slider__runway')
          let sliderBars = sliders[i].getElementsByClassName('el-slider__bar')
          let sliderButtons = sliders[i].getElementsByClassName('el-slider__button')
          if (!(runways && sliderBars && sliderButtons)) return
          for (let j = 0; j < runways.length; j++) {
            runways[j].style.backgroundColor = sliderColor.runway
            sliderBars[j].style.backgroundColor = sliderColor.bar
            sliderButtons[j].style.borderColor = sliderColor.button.borderColor
            sliderButtons[j].style.backgroundColor = sliderColor.button.backgroundColor
          }
        }
      }

      let pickers = document.getElementsByClassName('v-color-picker')
      let pickerColor = this.getPickerColor()
      if (pickers && pickers.length > 0 && pickerColor) {
        for (let i = 0; i < pickers.length; i++) {
          let triggers = pickers[i].getElementsByClassName('el-color-picker__trigger')
          if (!(triggers && triggers.length > 0)) return
          for (let j = 0; j < triggers.length; j++) {
            triggers[j].style.borderColor = pickerColor.trigger
          }
        }
      }

      let selectors = document.getElementsByClassName('v-family-select')
      let familyColor = this.getFamilyColor()
      if (selectors && selectors.length > 0 && familyColor) {
        for (let i = 0; i < selectors.length; i++) {
          let inputs = selectors[i].getElementsByClassName('el-input__inner')
          if (!(inputs && inputs.length > 0)) return
          for (let j = 0; j < inputs.length; j++) {
            inputs[j].style.backgroundColor = familyColor.input.backgroundColor
            inputs[j].style.color = familyColor.input.color
          }
        }
      }
    },
    initCanvas () {
      this.wrapper = this.$refs.wrapper || document.querySelector('.imgae-text-wrap') || {}
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
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
    getDefaultTextOffset () {
      let offset = { top: 0, left: 0, x: 0, y: 0 }
      if (this.canvas &&
        this.canvas.width > 0 &&
        this.canvas.height > 0 &&
        this.defaultTextTop < this.canvas.height &&
        this.defaultTextLeft < this.canvas.width) {
        offset.y = this.defaultTextTop
        offset.x = this.defaultTextLeft
        offset.top = this.defaultTextTop
        let distance = (this.wrapper.offsetWidth - this.canvas.width) / 2
        offset.left = this.defaultTextLeft + distance
      }
      return offset
    },
    mergeOptions (textItem, options) {
      if (!(options && typeof options === 'object')) return
      textItem.value = typeof options.value === 'string' ? options.value : textItem.value
      textItem.isBold = typeof options.isBold === 'boolean' ? options.isBold : textItem.isBold
      textItem.isItalic = typeof options.isItalic === 'boolean' ? options.isItalic : textItem.isItalic
      textItem.fontSize = typeof options.fontSize === 'number' ? options.fontSize : textItem.fontSize
      textItem.fontFamily = typeof options.fontFamily === 'string' ? options.fontFamily : textItem.fontFamily
      textItem.color = typeof options.color === 'string' ? options.color : textItem.color
      if (typeof options.top === 'number' && options.top >= 0) {
        textItem.top = options.top
        textItem.y = options.top
      }
      if (typeof options.left === 'number' && options.left >= 0) {
        textItem.left = options.left
        let distance = (this.wrapper.offsetWidth - this.canvas.width) / 2
        textItem.x = options.left - distance
      }
    },
    addText (options) {
      let offset = this.getDefaultTextOffset()
      let id = this.textId++
      let textItem = {
        key: `text-input-${id}`,
        value: this.defaultText,
        isActive: false,
        editing: false,
        x: offset.x,
        y: offset.y,
        left: offset.left,
        top: offset.top,
        ...this.style
      }
      this.mergeOptions(textItem, options)
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
    deleteText () {
      if (!(this.texts && this.texts.length > 0)) return
      if (this.selectedText) {
        let index = this.texts.findIndex(item => { return item.key === this.selectedText })
        if (index >= 0) {
          this.texts.splice(index, 1)
        } else {
          this.texts.pop()
        }
      } else {
        this.texts.pop()
      }
    },
    drawText () {
      this.texts.forEach(item => {
        if (item.value && typeof item.x === 'number' && typeof item.y === 'number' && item.x >= 0 && item.y >= 0) {
          let fontStyle = item.isItalic ? 'italic' : 'normal'
          let fontWeight = item.isBold ? '600' : '400'
          let fontFamily = item.fontFamily + ', Arial'
          this.ctx.font = `${fontStyle} ${fontWeight} ${item.fontSize}px ${fontFamily}`
          this.ctx.fillStyle = item.color
          this.ctx.textBaseline = 'top'
          let verticalSpacing = 1
          if (item.textHeight >= item.fontSize) {
            verticalSpacing = (item.textHeight - item.fontSize) / 2 + 1
          }
          this.ctx.fillText(item.value, item.x + this.inputPaddingLeft, item.y + verticalSpacing)
        }
      })
    },
    fillBackground () {
      this.ctx.fillStyle = this.fillColor || '#ffffff'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
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
        textItem.y = e.target.offsetTop
        textItem.left = e.target.offsetLeft
        textItem.top = e.target.offsetTop
      }
    },
    refreshPosition (e) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      this.itemX = e.target.offsetLeft
      this.itemY = e.target.offsetTop
    },
    confirmPosition (e) {
      let offsetLeft = this.itemX + e.clientX - this.mouseX
      let offsetTop = this.itemY + e.clientY - this.mouseY
      if (offsetLeft < 0 || this.activeArea.w <= 0) {
        offsetLeft = 0
      } else if (offsetLeft > (this.activeArea.w - e.target.offsetWidth)) {
        offsetLeft = this.activeArea.w - e.target.offsetWidth
      }
      if (offsetTop < 0 || this.activeArea.h <= 0) {
        offsetTop = 0
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
      let fontStyle = textItem.isItalic ? 'italic' : 'normal'
      let fontWeight = textItem.isBold ? '600' : '400'
      let fontFamily = textItem.fontFamily + ', Arial'
      this.ctx.font = `${fontStyle} ${fontWeight} ${textItem.fontSize}px ${fontFamily}`
      if (textItem.value) {
        let size = this.ctx.measureText(textItem.value)
        textInput.style.width = size.width + 10 + 'px'
      } else {
        let size = this.ctx.measureText(this.placeholder)
        textInput.style.width = size.width + 10 + 'px'
      }
      textItem.textHeight = textInput.offsetHeight || 0
    },
    updateStyle (textItem) {
      if (!(textItem && typeof textItem === 'object')) return
      this.style.isBold = typeof textItem.isBold === 'boolean' ? textItem.isBold : this.style.isBold
      this.style.isItalic = typeof textItem.isItalic === 'boolean' ? textItem.isItalic : this.style.isItalic
      this.style.fontSize = typeof textItem.fontSize === 'number' ? textItem.fontSize : this.style.fontSize
      this.style.fontFamily = typeof textItem.fontFamily === 'string' ? textItem.fontFamily : this.style.fontFamily
      this.style.color = typeof textItem.color === 'string' ? textItem.color : this.style.color
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
      this.updateStyle(textItem)
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
    },
    show (src, name = 'download.png') {
      return new Promise((resolve, reject) => {
        if (!(typeof src === 'string' && src)) return reject(new Error('Invalid param.'))
        if (this.loading) return reject(new Error('Loading in progress.'))
        this.loading = true
        this.imageSrc = ''
        this.resetCanvasSize()
        let image = new Image()
        image.onload = () => {
          let adjustedSize = this.adjustCanvasSize(image.width, image.height)
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.fillBackground()
          let blankSpace = this.canvas.width - adjustedSize.width - this.paddingLeft - this.paddingRight
          this.ctx.drawImage(image, 0, 0, image.width, image.height, (this.paddingLeft + blankSpace) / 2, this.paddingTop, adjustedSize.width, adjustedSize.height)
          this.activeArea.w = this.wrapper.offsetWidth || 0
          this.activeArea.h = this.wrapper.offsetHeight || 0
          this.imageSrc = src
          this.imageName = (name && typeof name === 'string') ? name : 'download.png'
          this.$nextTick(() => {
            this.loading = false
            resolve()
          })
        }
        image.src = src
      })
    },
    getDataURL (type = 'png') {
      if (!(this.canvas && this.ctx)) throw new Error('The canvas is invalid.')
      this.drawText()
      return this.canvas.toDataURL(`image/${type}`, 1)
    },
    getCanvas () {
      return this.canvas
    },
    getWidth () {
      if (this.wrapper && typeof this.wrapper.offsetWidth === 'number') {
        return this.wrapper.offsetWidth
      } else {
        return null
      }
    },
    measureTextWidth (text, options = {}) {
      if (!(this.ctx && typeof this.ctx.measureText === 'function' && text)) return null
      let fontStyle = typeof options.fontStyle === 'string' ? options.fontStyle : 'normal'
      let fontWeight = typeof options.fontWeight === 'string' ? options.fontWeight : '400'
      let fontFamily = typeof options.fontFamily === 'string' ? options.fontFamily : 'Arial'
      let fontSize = typeof options.fontSize === 'number' ? options.fontSize : 16
      this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
      return this.ctx.measureText(text)
    },
    rerender (keepText = false) {
      return new Promise((resolve, reject) => {
        if (this.loading) return reject(new Error('Loading in progress.'))
        if (!(this.canvas && this.ctx && this.imageSrc)) return reject(new Error('Not initialized yet.'))
        this.show(this.imageSrc)
          .then(() => {
            keepText ? '' : this.clearText()
            return resolve()
          })
          .catch(err => { return reject(err) })
      })
    },
    download (isRerender = true) {
      if (this.$refs && this.$refs.downloader) {
        this.downloadLink = this.getDataURL()
        isRerender ? this.rerender(true) : this.clearText()
        this.imageName = this.imageName || 'download.png'
        setTimeout(() => { this.$refs.downloader.click() }, 100)
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
  min-width: 600px;
  box-sizing: border-box;
  border-radius: 2px;
  overflow: hidden;
}
.imgae-text-light{
  border: 1px solid rgba(0,0,0,0.2);
}
.imgae-text-dark{
  border: 1px solid rgba(51,51,51,0.7);
}

.imgae-text-wrap{
  position: relative;
  width: 100%;
  min-width: 600px;
  box-sizing: border-box;
  overflow: hidden;
}

#canvas{
  box-sizing: border-box;
  display: block;
  margin: 0 auto;
}
.text-input-wrap{
  position: absolute;
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
}
.text-input::-webkit-input-placeholder{
  color: #cccccc;
}
.text-input:-moz-placeholder{
  color: #cccccc;
}
.text-input::-moz-placeholder{
  color: #cccccc;
}
.text-input:-ms-input-placeholder{
  color: #cccccc;
}

.tool-box{
  padding: 0 16px;
  height: 64px;
  border-bottom: 1px solid rgba(96, 98, 102, 0.07);
}
.tool-box-light{
  background-color: rgba(200, 200, 200, 0.2);
}
.tool-box-dark{
  background-color: rgba(51, 51, 51, 0.9);
}

.tool-box-add{
  padding: 5px 16px 5px 0px;
  margin-right: 16px;
}
.divider-r-light{
  border-right: 1px solid rgba(96, 98, 102, 0.3);
}
.divider-r-dark{
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}

.tool-box-add .icontext{
  font-size: 20px;
  font-weight: 600;
}
.tool-box-style, .tool-box-operate{
  margin-right: 8px;
}
.tool-box-tip{
  font-size: 11px;
  margin-bottom: 2px;
  cursor: default;
  -webkit-user-select: none;
  user-select: none;
}
.tip-light{
  color: #909399;
}
.tip-dark{
  color: rgba(255, 255, 255, 0.7);
}

.tool-box .tool-box-icon{
  font-size: 16px;
}

.tool-box-family .tool-box-select-family,
.tool-box-select-color,
.tool-box-range{
  height: 30px;
  padding: 0px 12px;
}
.v-slider-wrap{
  width: 100px;
  height: 30px;
}
.tool-box-range-value, .select-color-value{
  margin-left: 10px;
  padding: 4px;
  font-size: 12px;
  border-radius: 2px;
}
.value-light{
  color: #606266;
  background-color: #e5e5e5;
}
.value-dark{
  color: rgba(255, 255, 255, 0.9);
  background-color: rgba(51, 51, 51, 0.8);
}

.tool-box-clear{
  margin-left: 10px;
  padding-left: 14px;
}
.divider-l-light{
  border-left: 1px solid rgba(96, 98, 102, 0.3);
}
.divider-l-dark{
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}
.tool-box-clear .tool-box-clear-icon{
  font-size: 18px;
}

.tool-box .bt-style{
  padding-top: 7px;
  padding-bottom: 7px;
}

.img-dl{
  height: 0;
  width: 0;
  visibility: hidden;
}
</style>

<style>
.tool-box-range .el-slider__runway{
  margin: 12px 0px;
}

.tool-box-range .el-slider__button-wrapper{
  top: -12px;
  height: 30px;
  width: 30px;
}

.el-button--mini.el-color-dropdown__link-btn{
  display: none !important;
}

.tool-box-select-family .el-input__inner{
  width: 108px !important;
  height: 24px !important;
  line-height: 24px !important;
  padding-left: 10px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  border-color: rgba(160,160,160,0.9) !important;
}
.tool-box-select-family .el-input.is-focus .el-input__inner,
.tool-box-select-family .el-input__inner:focus{
  border-color: rgba(120,120,120,0.9) !important;
}
.tool-box-select-family .el-input__icon{
  line-height: 24px !important;
}

</style>
