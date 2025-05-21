// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  server: {
    host: true,         // 0.0.0.0 으로 바인딩 → 모든 네트워크 인터페이스에서 접근 허용
    port: 5173,         // 원하는 포트 지정
    strictPort: true,   // 이미 사용 중이면 에러 발생
  },
  resolve: {
    alias: {
      // "@/..." → "src/..."
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 모든 .scss / <style lang="scss"> 앞에 이 내용이 자동으로 삽입됩니다.
        additionalData: `
          @use "@/assets/scss/variables.scss" as *;
          @use "@/assets/scss/global.scss" as *;
          @use "@/assets/scss/class.scss" as *;
          
        `
      }
    }
  },
  plugins: [
    vue(),
    Pages({
      // 기본값: 'src/pages'
      dirs: 'src/pages',
      extensions: ['vue'],
    })
  ]
})
