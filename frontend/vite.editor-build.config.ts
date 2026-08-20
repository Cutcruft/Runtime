import { defineConfig } from 'vite'
import { resolve } from 'path'
import preact from '@preact/preset-vite'

/**
 * Builds editor plugin bundles as standalone ES modules.
 * Each editor is built with preact/signals/runtime-client externalized
 * (resolved via the shell's importmap at runtime).
 * Output: dist/editors/<name>.js
 *
 * Usage:
 *   vite build --config vite.editor-build.config.ts
 *   EDITOR=canvas vite build --config vite.editor-build.config.ts
 */
const editorName = process.env.EDITOR || 'canvas'

const editorEntryMap: Record<string, string> = {
  canvas: resolve(__dirname, 'src/editor/UiCanvas.tsx'),
  richtext: resolve(__dirname, 'src/editor/UiRichText.tsx'),
  diagram: resolve(__dirname, 'src/editor/UiDiagram.tsx'),
  scene3d: resolve(__dirname, 'src/editor/UiScene3D.tsx'),
}

export default defineConfig({
  plugins: [preact()],
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
        'preact',
        /^preact\//,
        '@preact/signals',
        '@preact/signals-core',
        '@cutcrft/runtime-client',
        // Heavy editor libraries stay bundled per-editor (they are not shared).
        'vue',
        /^vue\//,
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
