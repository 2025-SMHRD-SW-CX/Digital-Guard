import { createApp } from 'vue'
import App from './App.vue'
import router from './router'          // ← 변경된 경로
import './assets/css/global.css'
import './assets/css/class.css'

createApp(App)
  .use(router)                         // ← 라우터 등록
  .mount('#app')
