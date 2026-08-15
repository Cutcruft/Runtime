<script setup lang="ts">
import { computed } from 'vue'
import { resolveComponent } from '../renderer/componentRegistry'
import { resolveEditor } from '../editor/editorRegistry'
import type { ComponentDefinition } from '../protocol/types'
import type { BindingContext } from '../protocol/componentSpec'

const props = defineProps<{
  component: ComponentDefinition
  context?: BindingContext
}>()

const resolved = computed(() => {
  const editor = resolveEditor(props.component.type)
  if (editor) return editor
  return resolveComponent(props.component.type)
})
</script>

<template>
  <Suspense v-if="resolved">
    <component
      :is="resolved"
      :config="component.config"
      :context="context"
      :data-gesture-type="component.type"
    />
    <template #fallback>
      <div class="component-loader" role="status">
        <span class="component-loader__spinner" />
        <span class="component-loader__label">{{ component.type }}</span>
      </div>
    </template>
  </Suspense>
  <div v-else class="component-unknown">
    <strong>{{ component.type }}</strong>
    <pre>{{ JSON.stringify(component.config, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.component-loader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  color: var(--rt-color-muted);
  font-size: var(--rt-font-size-sm);
}
.component-loader__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--rt-color-border);
  border-top-color: var(--rt-color-primary);
  border-radius: 50%;
  animation: component-loader-spin 0.8s linear infinite;
}
@keyframes component-loader-spin {
  to {
    transform: rotate(360deg);
  }
}
.component-unknown {
  padding: 0.5rem;
  border: 1px dashed var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-surface);
  color: var(--rt-color-muted);
}
.component-unknown pre {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
}
</style>
