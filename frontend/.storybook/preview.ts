import type { Preview } from '@storybook/vue3'
import '../src/styles/global.css'
import { applyStorybookRuntime } from '../src/storybook/mockRuntime'

const preview: Preview = {
  decorators: [
    (story, context) => {
      applyStorybookRuntime(context.globals.themeMode)
      return story()
    }
  ],
  globalTypes: {
    themeMode: {
      name: 'Theme',
      description: 'Runtime theme mode applied from the core /config-shaped fixture',
      defaultValue: 'auto',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'auto', title: 'Auto' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      }
    }
  },
  parameters: {
    controls: { expanded: true },
    actions: { argTypesRegex: '^on[A-Z].*' },
    a11y: { test: 'todo' }
  }
}

export default preview
