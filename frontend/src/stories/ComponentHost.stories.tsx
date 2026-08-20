import type { Meta, StoryObj } from '@storybook/preact'
import { Container } from '../core/primitives/Container'
import { applyStorybookRuntime, mockUiDocsCatalog } from '../storybook/mockRuntime'

const fixtures = mockUiDocsCatalog.components
const fixtureIds = fixtures.map((fixture) => fixture.id)
const fixtureLabels = fixtures.reduce<Record<string, string>>((acc, fixture) => {
  acc[fixture.id] = fixture.title
  return acc
}, {})

const meta = {
  title: 'Runtime/ComponentHost',
  tags: ['autodocs'],
  argTypes: {
    fixtureId: {
      control: 'select',
      options: fixtureIds,
      labels: fixtureLabels,
      name: 'Fixture'
    }
  },
  render: (args: { fixtureId: string }) => {
    const selected = fixtures.find((fixture) => fixture.id === args.fixtureId) ?? fixtures[0]
    return (
      <div style={{ maxWidth: '42rem' }}>
        <Container component={selected.component} />
      </div>
    )
  }
} satisfies Meta<{ fixtureId: string }>

export default meta

type Story = StoryObj<typeof meta>

export const FromConfigAdapter: Story = {
  args: {
    fixtureId: fixtures[0]?.id
  }
}
