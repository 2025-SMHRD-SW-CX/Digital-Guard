import { createApp } from 'vue'
import App from './App.vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import router from './router'          // ← 변경된 경로
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const head = createHead()

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(head)
app.use(pinia)           
app.use(router)
app.mount('#app')