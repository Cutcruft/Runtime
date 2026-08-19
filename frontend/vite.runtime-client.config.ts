import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

/**
 * Builds the runtime-client facade as a standalone ESM module.
 * Output: dist/plugin-assets/runtimeClient.js
 *
 * Vue is NOT bundled — plugin bundles resolve 'vue' via importmap.
 */
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugin/runtimeClient.ts'),
      formats: ['es'],
      fileName: 'runtimeClient'
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      external: [
        'vue',
        /^vue\//,
      ],
      output: {
        entryFileNames: 'runtimeClient.js',
        preserveModules: false
      }
    },
    cssCodeSplit: false,
    sourcemap: false
  }
})
