import Vue from 'vue'
import App from './App.vue'

import '@/assets/css/global.css'
import VueImageText from '../../dist/index.min.js'
Vue.use(VueImageText)

new Vue({
  el: '#app',
  render: h => h(App)
})
