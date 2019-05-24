import VueImageText from './components/VueImageText.vue'

VueImageText.install = function (Vue, options) {
  Vue.component('VueImageText', VueImageText)
}

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(VueImageText)
}

export default VueImageText