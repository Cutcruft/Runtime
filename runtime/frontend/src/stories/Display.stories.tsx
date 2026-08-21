import type { Meta, StoryObj } from '@storybook/preact'
import { Container } from '../ui-base/primitives/Container'
import { applyStorybookRuntime } from '../storybook/mockRuntime'
import type { ComponentDefinition } from '../protocol/types'

const components: Record<string, ComponentDefinition> = {
  stat: {
    type: 'Stat',
    config: { label: 'Total tasks', value: 42, tone: 'blue' }
  },
  badgeGrid: {
    type: 'Grid',
    config: {
      columns: 4,
      components: [
        { type: 'Badge', config: { text: 'Default' } },
        { type: 'Badge', config: { text: 'Primary', tone: 'primary' } },
        { type: 'Badge', config: { text: 'Done', tone: 'green' } },
        { type: 'Badge', config: { text: 'Blocked', tone: 'red' } }
      ]
    }
  },
  progress: {
    type: 'Progress',
    config: { value: 65, showLabel: true, tone: 'green' }
  },
  tabs: {
    type: 'Tabs',
    config: {
      activeTab: 'a',
      tabs: [
        { id: 'a', label: 'Overview', components: [{ type: 'Text', config: { text: 'Tab A content' } }] },
        { id: 'b', label: 'Details', components: [{ type: 'Text', config: { text: 'Tab B content' } }] }
      ]
    }
  }
}

const meta = {
  title: 'Builtin/Display',
  tags: ['autodocs'],
  argTypes: {
    which: { control: 'select', options: Object.keys(components) }
  },
  render: (args: { which: string }) => {
    applyStorybookRuntime()
    const component = components[args.which]
    return (
      <div style={{ maxWidth: '42rem', padding: '8px' }}>
        <Container component={component} />
      </div>
    )
  },
  args: { which: 'stat' }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Stat: Story = { args: { which: 'stat' } }
export const Badges: Story = { args: { which: 'badgeGrid' } }
export const Progress: Story = { args: { which: 'progress' } }
export const Tabs: Story = { args: { which: 'tabs' } }
