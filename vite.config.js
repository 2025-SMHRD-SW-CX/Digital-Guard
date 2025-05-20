// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  plugins: [
    vue(),
    Pages({
      // 기본값: 'src/pages'
      dirs: 'src/pages',
      extensions: ['vue'],
    })
  ]
})
