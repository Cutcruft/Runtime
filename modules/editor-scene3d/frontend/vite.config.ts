import { defineConfig } from 'vite'
import { resolve } from 'path'
import preact from '@preact/preset-vite'

/**
 * Builds the editor module's frontend bundle (scene3d.js + style.css).
 * Preact, signals and the plugin SDK are externalized (resolved via the core's
 * importmap at runtime); tiptap + prosemirror are bundled into this editor only.
 */
export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/UiScene3D.tsx'),
      formats: ['es'],
      fileName: () => 'scene3d.js',
    },
    outDir: resolve(__dirname, '../src/main/resources/frontend'),
    emptyOutDir: false,
    rollupOptions: {
      external: [
        'preact',
        /^preact\//,
        '@preact/signals',
        '@preact/signals-core',
        '@cutcrft/plugin-sdk',
      ],
      output: {
        preserveModules: false,
        entryFileNames: 'scene3d.js',
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
  },
})
