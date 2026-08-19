import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

/**
 * Builds editor plugin bundles as standalone ES modules.
 * Each editor is built with 'vue' and '@cutcrft/runtime-client' externalized.
 * Output: dist/editors/<name>.js
 *
 * Usage:
 *   vite build --config vite.editor-build.config.ts -- --editor canvas
 *   vite build --config vite.editor-build.config.ts -- --editor richtext
 */
const editorName = process.env.EDITOR || 'canvas'

const editorEntryMap: Record<string, string> = {
  canvas: resolve(__dirname, 'src/editor/UiCanvas.vue'),
  richtext: resolve(__dirname, 'src/editor/UiRichText.vue'),
  diagram: resolve(__dirname, 'src/editor/UiDiagram.vue'),
  scene3d: resolve(__dirname, 'src/editor/UiScene3D.vue'),
}

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: editorEntryMap[editorName] ?? editorEntryMap.canvas,
      formats: ['es'],
      fileName: () => `${editorName}.js`,
    },
    outDir: resolve(__dirname, 'dist/editors'),
    emptyOutDir: false,
    rollupOptions: {
      external: [
        'vue',
        /^vue\//,
        '@cutcrft/runtime-client',
      ],
      output: {
        preserveModules: false,
        globals: {
          vue: 'Vue',
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
  },
})
