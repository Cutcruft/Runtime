import { defineConfig } from 'vite'
import { resolve } from 'path'
import preact from '@preact/preset-vite'

/**
 * Builds all ui-layout primitive bundles (grid.js, stack.js, group.js, spacer.js,
 * card.js, section.js). Preact/signals/plugin-sdk externalized (via importmap).
 * Output: ../src/main/resources/frontend/<name>.js
 */
const src = (name: string) => resolve(__dirname, 'src', name)

const entries: Record<string, string> = {
  grid: src('LayoutGrid.tsx'),
  stack: src('LayoutStack.tsx'),
  group: src('LayoutGroup.tsx'),
  spacer: src('LayoutSpacer.tsx'),
  card: src('LayoutCard.tsx'),
  section: src('LayoutSection.tsx'),
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  plugins: [preact()],
  build: {
    outDir: resolve(__dirname, '../src/main/resources/frontend'),
    emptyOutDir: false,
    lib: {
      entry: entries,
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'preact',
        /^preact\//,
        '@preact/signals',
        '@preact/signals-core',
        '@cutcrft/plugin-sdk',
        '@cutcrft/runtime-client',
      ],
      output: {
        preserveModules: false,
        chunkFileNames: 'vendor.js',
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
  },
})
