import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/css/global.css'
import '@/assets/css/transition.css'
import '@/assets/iconfont/iconfont.css'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
// import VueImageText from '../../dist/index.min.js'
import VueImageText from '../../src/index.js'

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.use(VueImageText)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
