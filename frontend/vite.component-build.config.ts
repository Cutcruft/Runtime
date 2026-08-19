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

const pluginFrontend = resolve(__dirname, '../plugins/builtin-ui/src/main/frontend')

const componentEntryMap: Record<string, string> = {
  text: resolve(pluginFrontend, 'UiText.vue'),
  image: resolve(pluginFrontend, 'UiImage.vue'),
  badge: resolve(pluginFrontend, 'UiBadge.vue'),
  divider: resolve(pluginFrontend, 'UiDivider.vue'),
  space: resolve(pluginFrontend, 'UiSpace.vue'),
  button: resolve(pluginFrontend, 'UiButton.vue'),
  card: resolve(pluginFrontend, 'UiCard.vue'),
  tabs: resolve(pluginFrontend, 'UiTabs.vue'),
  grid: resolve(pluginFrontend, 'UiGrid.vue'),
  stat: resolve(pluginFrontend, 'UiStat.vue'),
  list: resolve(pluginFrontend, 'UiList.vue'),
  table: resolve(pluginFrontend, 'UiTable.vue'),
  form: resolve(pluginFrontend, 'UiForm.vue'),
  input: resolve(pluginFrontend, 'UiInput.vue'),
  select: resolve(pluginFrontend, 'UiSelect.vue'),
  textarea: resolve(pluginFrontend, 'UiTextarea.vue'),
  checkbox: resolve(pluginFrontend, 'UiCheckbox.vue'),
  avatar: resolve(pluginFrontend, 'UiAvatar.vue'),
  progress: resolve(pluginFrontend, 'UiProgress.vue'),
  accordion: resolve(pluginFrontend, 'UiAccordion.vue'),
  frame: resolve(pluginFrontend, 'UiFrame.vue'),
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
