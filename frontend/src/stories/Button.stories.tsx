import type { Meta, StoryObj } from '@storybook/preact'
import { Container } from '../core/primitives/Container'
import { applyStorybookRuntime } from '../storybook/mockRuntime'

const meta = {
  title: 'Builtin/Button',
  tags: ['autodocs'],
  render: (args: { label: string; variant: string }) => {
    applyStorybookRuntime()
    return (
      <Container
        component={{
          type: 'Button',
          config: { label: args.label, variant: args.variant }
        }}
      />
    )
  },
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'danger', 'ghost', 'link']
    }
  },
  args: { label: 'Execute', variant: 'primary' }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { label: 'Primary', variant: 'primary' } }
export const Default: Story = { args: { label: 'Default', variant: 'default' } }
export const Danger: Story = { args: { label: 'Delete', variant: 'danger' } }
export const Ghost: Story = { args: { label: 'Ghost', variant: 'ghost' } }
