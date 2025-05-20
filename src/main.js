import { createApp } from 'vue'
import App from './App.vue'
import router from './router'          // ← 변경된 경로
import './assets/css/global.css'

createApp(App)
  .use(router)                         // ← 라우터 등록
  .mount('#app')
