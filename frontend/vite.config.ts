import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 700
  },
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:8080',
        ws: true
      },
      '/config': {
        target: 'http://localhost:8080'
      },
      '/plugin-assets': {
        target: 'http://localhost:8080'
      }
    }
  }
})
