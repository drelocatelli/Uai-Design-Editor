import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      transformAssetUrls: {
        includeAbsolute: false,
      }
    }
  })],
  server: {
    port: 3000
  },
  preview: {
    port: 3001
  }
})