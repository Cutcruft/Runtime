import { defineConfig } from 'vite'
import { resolve } from 'path'
import preact from '@preact/preset-vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

/**
 * Builds the runtime-client facade as a standalone ESM module.
 * Output: dist/runtimeClient.js
 *
 * Preact + signals are NOT bundled — plugin bundles resolve them via importmap.
 */
export default defineConfig({
  plugins: [preact(), vanillaExtractPlugin()],
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
        'preact',
        'preact/compat',
        'preact/hooks',
        'preact/debug',
        'preact/devtools',
        '@preact/signals',
        '@preact/signals/preact',
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
