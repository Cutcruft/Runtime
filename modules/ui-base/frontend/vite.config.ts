import { defineConfig } from 'vite'
import { resolve } from 'path'
import preact from '@preact/preset-vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

/**
 * Builds all ui-base frontend bundles:
 *   - app.js        — AppShell (rendered by core main.tsx via resolveComponent('App'))
 *   - <type>.js     — each Ui* component (text.js, button.js, table.js, ...)
 * Output: ../src/main/resources/frontend/<name>.js + style.css
 *
 * Preact/signals/plugin-sdk are externalized (resolved via the core importmap);
 * vanilla-extract CSS is extracted into style.css.
 */
const src = (name: string) => resolve(__dirname, 'src', name)

const uiEntries: Record<string, string> = {
  app: src('App.tsx'),
  text: src('UiText.tsx'),
  image: src('UiImage.tsx'),
  badge: src('UiBadge.tsx'),
  divider: src('UiDivider.tsx'),
  space: src('UiSpace.tsx'),
  button: src('UiButton.tsx'),
  tabs: src('UiTabs.tsx'),
  stat: src('UiStat.tsx'),
  list: src('UiList.tsx'),
  table: src('UiTable.tsx'),
  form: src('UiForm.tsx'),
  input: src('UiInput.tsx'),
  select: src('UiSelect.tsx'),
  textarea: src('UiTextarea.tsx'),
  checkbox: src('UiCheckbox.tsx'),
  avatar: src('UiAvatar.tsx'),
  progress: src('UiProgress.tsx'),
  accordion: src('UiAccordion.tsx'),
  frame: src('UiFrame.tsx'),
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  plugins: [preact(), vanillaExtractPlugin()],
  build: {
    outDir: resolve(__dirname, '../src/main/resources/frontend'),
    emptyOutDir: false,
    lib: {
      entry: uiEntries,
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
