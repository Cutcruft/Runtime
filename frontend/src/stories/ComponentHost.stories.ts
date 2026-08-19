import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentHost from '../core/primitives/Container.vue'
import { mockUiDocsCatalog } from '../storybook/mockRuntime'

const fixtures = mockUiDocsCatalog.components
const fixtureIds = fixtures.map((fixture) => fixture.id)
const fixtureLabels = fixtures.reduce<Record<string, string>>((acc, fixture) => {
  acc[fixture.id] = fixture.title
  return acc
}, {})

type ComponentHostStoryArgs = {
  fixtureId: string
}

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
  render: (args: ComponentHostStoryArgs) => {
    const selected = fixtures.find((fixture) => fixture.id === args.fixtureId) ?? fixtures[0]
    return {
      components: { ComponentHost },
      setup() {
        return { component: selected.component }
      },
      template: '<div style="max-width: 42rem"><ComponentHost :component="component" /></div>'
    }
  }
} satisfies Meta<ComponentHostStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const FromConfigAdapter: Story = {
  args: {
    fixtureId: fixtures[0]?.id
  }
}
