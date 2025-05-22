import { createApp } from 'vue'
import App from './App.vue'
import { createHead } from '@vueuse/head'
import router from './router'          // ← 변경된 경로

const head = createHead()

createApp(App)
  .use(head)
  .use(router)                         // ← 라우터 등록
  .mount('#app')
