import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

export default defineConfig({
  plugins: [preact(), vanillaExtractPlugin()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      // Share a single Preact instance across the main bundle and plugin bundles:
      // both resolve these from the shell's importmap (vendor/).
      external: [
        'preact',
        /^preact\//,
        '@preact/signals',
        '@preact/signals-core',
      ],
    },
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

