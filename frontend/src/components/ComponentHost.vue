<script setup lang="ts">
import { computed } from 'vue'
import { resolveComponent } from '../renderer/componentRegistry'
import type { ComponentDefinition } from '../protocol/types'
import type { BindingContext } from '../protocol/componentSpec'

const props = defineProps<{
  component: ComponentDefinition
  context?: BindingContext
}>()

const resolved = computed(() => resolveComponent(props.component.type))
</script>

<template>
  <component :is="resolved" v-if="resolved" :config="component.config" :context="context" />
  <div v-else class="component-unknown">
    <strong>{{ component.type }}</strong>
    <pre>{{ JSON.stringify(component.config, null, 2) }}</pre>
  </div>
</template>

<style scoped>
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
