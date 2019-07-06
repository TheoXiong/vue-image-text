import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Guide from '@/views/Guide.vue'
import Demo from '@/views/Demo.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    component: Home,
    meta: { title: 'Home' }
  }, {
    path: '/guide',
    component: Guide,
    meta: { title: 'Guide' }
  }, {
    path: '/demo',
    component: Demo,
    meta: { title: 'Demo' }
  }]
})

export default router
