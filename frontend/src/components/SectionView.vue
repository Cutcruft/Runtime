<script setup lang="ts">
import ComponentHost from './ComponentHost.vue'
import type { BindingContext } from '../protocol/componentSpec'
import type { SectionDefinition } from '../protocol/types'

const props = defineProps<{ section: SectionDefinition; context?: BindingContext }>()

const gridStyle = {
  gridTemplateColumns: `repeat(${Math.max(1, Math.min(props.section.columns, 4))}, minmax(0, 1fr))`,
  gap: 'var(--rt-space)'
}
</script>

<template>
  <section class="section" :style="gridStyle">
    <ComponentHost
      v-for="(component, index) in section.components"
      :key="`${index}:${component.type}`"
      :component="component"
      :context="context"
    />
  </section>
</template>

<style scoped>
.section {
  display: grid;
  align-items: start;
  margin-bottom: var(--rt-space-lg);
}
</style>
