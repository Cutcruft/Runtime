import { defineConfig } from 'vite'
import { resolve } from 'path'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

/**
 * Builds the plugin SDK facade as a standalone ESM module (single file).
 * Output: dist/pluginSdk/pluginSdk.js + pluginSdk.css
 * Preact + signals are NOT bundled — modules resolve them via the core importmap.
 * Vanilla-extract CSS is extracted into pluginSdk.css (not run in the browser).
 */
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  plugins: [vanillaExtractPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'pluginSdk'
    },
    outDir: resolve(__dirname, 'dist/pluginSdk'),
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'preact',
        /^preact\//,
        '@preact/signals',
        '@preact/signals-core',
      ],
      output: {
        entryFileNames: 'pluginSdk.js',
        assetFileNames: 'pluginSdk.css',
        preserveModules: false,
        chunkFileNames: 'vendor.js',
      },
    },
    cssCodeSplit: false,
    sourcemap: false
  }
})
