import { createApp } from 'vue'
import App from './App.vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import router from './router'          // ← 변경된 경로

const head = createHead()

createApp(App)
  .use(head)
  .use(createPinia())
  .use(router)                         // ← 라우터 등록
  .mount('#app')
