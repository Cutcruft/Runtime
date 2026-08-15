import type { Component } from 'vue'
import UiText from '../components/UiText.vue'
import UiImage from '../components/UiImage.vue'
import UiBadge from '../components/UiBadge.vue'
import UiDivider from '../components/UiDivider.vue'
import UiSpace from '../components/UiSpace.vue'
import UiButton from '../components/UiButton.vue'
import UiCard from '../components/UiCard.vue'
import UiTabs from '../components/UiTabs.vue'
import UiGrid from '../components/UiGrid.vue'
import UiStat from '../components/UiStat.vue'
import UiList from '../components/UiList.vue'
import UiTable from '../components/UiTable.vue'
import UiForm from '../components/UiForm.vue'
import UiInput from '../components/UiInput.vue'
import UiSelect from '../components/UiSelect.vue'
import UiTextarea from '../components/UiTextarea.vue'
import UiCheckbox from '../components/UiCheckbox.vue'

const registry = new Map<string, Component>()

function register(type: string, component: Component): void {
  registry.set(type.toLowerCase(), component)
}

/** Register a custom component type (used by plugin bundles). Returns an unregister fn. */
export function registerComponent(type: string, component: Component): () => void {
  register(type, component)
  return () => registry.delete(type.toLowerCase())
}

export function resolveComponent(type: string): Component | null {
  return registry.get(type.toLowerCase()) ?? null
}

export function registeredTypes(): string[] {
  return [...registry.keys()]
}

export function registerBuiltinComponents(): void {
  register('text', UiText)
  register('image', UiImage)
  register('badge', UiBadge)
  register('divider', UiDivider)
  register('space', UiSpace)
  register('button', UiButton)
  register('card', UiCard)
  register('tabs', UiTabs)
  register('grid', UiGrid)
  register('stat', UiStat)
  register('list', UiList)
  register('table', UiTable)
  register('form', UiForm)
  register('input', UiInput)
  register('select', UiSelect)
  register('textarea', UiTextarea)
  register('checkbox', UiCheckbox)
}
