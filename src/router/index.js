import { createRouter, createWebHistory } from 'vue-router'
// import routes from 'virtual:generated-pages'
import Rshop from '@/pages/abc/rshop.vue'
// '../pages' = @

const routes = [
  { path: '/', redirect: '/abc/rshop' },
  { path: '/abc/rshop', component: Rshop }
]



export default createRouter({
  history: createWebHistory(),
  routes,
})

