import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

/**
 * Builds builtin UI component plugin bundles as standalone ES modules.
 * Each component is built with 'vue' and '@cutcrft/runtime-client' externalized.
 * Output: dist/components/<name>.js
 *
 * Usage:
 *   vite build --config vite.component-build.config.ts
 *   COMPONENT=text vite build --config vite.component-build.config.ts
 */

const componentName = process.env.COMPONENT

const componentEntryMap: Record<string, string> = {
  text: resolve(__dirname, 'src/components/UiText.vue'),
  image: resolve(__dirname, 'src/components/UiImage.vue'),
  badge: resolve(__dirname, 'src/components/UiBadge.vue'),
  divider: resolve(__dirname, 'src/components/UiDivider.vue'),
  space: resolve(__dirname, 'src/components/UiSpace.vue'),
  button: resolve(__dirname, 'src/components/UiButton.vue'),
  card: resolve(__dirname, 'src/components/UiCard.vue'),
  tabs: resolve(__dirname, 'src/components/UiTabs.vue'),
  grid: resolve(__dirname, 'src/components/UiGrid.vue'),
  stat: resolve(__dirname, 'src/components/UiStat.vue'),
  list: resolve(__dirname, 'src/components/UiList.vue'),
  table: resolve(__dirname, 'src/components/UiTable.vue'),
  form: resolve(__dirname, 'src/components/UiForm.vue'),
  input: resolve(__dirname, 'src/components/UiInput.vue'),
  select: resolve(__dirname, 'src/components/UiSelect.vue'),
  textarea: resolve(__dirname, 'src/components/UiTextarea.vue'),
  checkbox: resolve(__dirname, 'src/components/UiCheckbox.vue'),
  avatar: resolve(__dirname, 'src/components/UiAvatar.vue'),
  progress: resolve(__dirname, 'src/components/UiProgress.vue'),
  accordion: resolve(__dirname, 'src/components/UiAccordion.vue'),
  frame: resolve(__dirname, 'src/components/UiFrame.vue'),
}

const names = componentName ? [componentName] : Object.keys(componentEntryMap)

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: Object.fromEntries(names.map((n) => [n, componentEntryMap[n]])),
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    outDir: resolve(__dirname, 'dist/components'),
    emptyOutDir: !componentName,
    rollupOptions: {
      external: [
        'vue',
        /^vue\//,
        '@cutcrft/runtime-client',
      ],
      output: {
        preserveModules: false,
        chunkFileNames: 'vendor.js',
        globals: {
          vue: 'Vue',
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
  },
})
