import type { Preview } from '@storybook/preact'
import '../src/styles/global.css'
import '../src/styles/builtin.css'
import { applyStorybookRuntime } from '../src/storybook/mockRuntime'
import { registerComponent } from '../src/renderer/componentRegistry'

// V7.2: register the builtin UI components so config-driven stories
// (via Container → resolveComponent) render real components, not the
// "unknown component" fallback.
import UiText from '@builtin-ui/UiText'
import UiImage from '@builtin-ui/UiImage'
import UiBadge from '@builtin-ui/UiBadge'
import UiDivider from '@builtin-ui/UiDivider'
import UiSpace from '@builtin-ui/UiSpace'
import UiButton from '@builtin-ui/UiButton'
import UiCard from '@builtin-ui/UiCard'
import UiTabs from '@builtin-ui/UiTabs'
import UiGrid from '@builtin-ui/UiGrid'
import UiStat from '@builtin-ui/UiStat'
import UiList from '@builtin-ui/UiList'
import UiTable from '@builtin-ui/UiTable'
import UiForm from '@builtin-ui/UiForm'
import UiInput from '@builtin-ui/UiInput'
import UiSelect from '@builtin-ui/UiSelect'
import UiTextarea from '@builtin-ui/UiTextarea'
import UiCheckbox from '@builtin-ui/UiCheckbox'
import UiAvatar from '@builtin-ui/UiAvatar'
import UiProgress from '@builtin-ui/UiProgress'
import UiAccordion from '@builtin-ui/UiAccordion'
import UiFrame from '@builtin-ui/UiFrame'

const builtins: Array<[string, unknown]> = [
  ['Text', UiText], ['Image', UiImage], ['Badge', UiBadge], ['Divider', UiDivider],
  ['Space', UiSpace], ['Button', UiButton], ['Card', UiCard], ['Tabs', UiTabs],
  ['Grid', UiGrid], ['Stat', UiStat], ['List', UiList], ['Table', UiTable],
  ['Form', UiForm], ['Input', UiInput], ['Select', UiSelect], ['Textarea', UiTextarea],
  ['Checkbox', UiCheckbox], ['Avatar', UiAvatar], ['Progress', UiProgress],
  ['Accordion', UiAccordion], ['Frame', UiFrame]
]
for (const [type, component] of builtins) {
  registerComponent(type, component as never)
}

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
