import { defineConfig } from 'vite'
import { resolve } from 'path'
import preact from '@preact/preset-vite'

/**
 * Builds builtin UI component plugin bundles as standalone ES modules.
 * Each component is built with preact/signals/runtime-client externalized
 * (resolved via the shell's importmap at runtime).
 * Output: dist/components/<name>.js
 *
 * Usage:
 *   vite build --config vite.component-build.config.ts
 *   COMPONENT=button vite build --config vite.component-build.config.ts
 */

const componentName = process.env.COMPONENT

const pluginFrontend = resolve(__dirname, '../plugins/builtin-ui/src/main/frontend')

const componentEntryMap: Record<string, string> = {
  text: resolve(pluginFrontend, 'UiText.tsx'),
  image: resolve(pluginFrontend, 'UiImage.tsx'),
  badge: resolve(pluginFrontend, 'UiBadge.tsx'),
  divider: resolve(pluginFrontend, 'UiDivider.tsx'),
  space: resolve(pluginFrontend, 'UiSpace.tsx'),
  button: resolve(pluginFrontend, 'UiButton.tsx'),
  card: resolve(pluginFrontend, 'UiCard.tsx'),
  tabs: resolve(pluginFrontend, 'UiTabs.tsx'),
  grid: resolve(pluginFrontend, 'UiGrid.tsx'),
  stat: resolve(pluginFrontend, 'UiStat.tsx'),
  list: resolve(pluginFrontend, 'UiList.tsx'),
  table: resolve(pluginFrontend, 'UiTable.tsx'),
  form: resolve(pluginFrontend, 'UiForm.tsx'),
  input: resolve(pluginFrontend, 'UiInput.tsx'),
  select: resolve(pluginFrontend, 'UiSelect.tsx'),
  textarea: resolve(pluginFrontend, 'UiTextarea.tsx'),
  checkbox: resolve(pluginFrontend, 'UiCheckbox.tsx'),
  avatar: resolve(pluginFrontend, 'UiAvatar.tsx'),
  progress: resolve(pluginFrontend, 'UiProgress.tsx'),
  accordion: resolve(pluginFrontend, 'UiAccordion.tsx'),
  frame: resolve(pluginFrontend, 'UiFrame.tsx'),
}

const names = componentName ? [componentName] : Object.keys(componentEntryMap)

export default defineConfig({
  plugins: [preact()],
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
        'preact',
        /^preact\//,
        '@preact/signals',
        '@preact/signals-core',
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
