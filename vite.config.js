import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  // resolve 是添加的别名
  resolve: {
    alias: {
      // 这里是 src 目录的别名
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
