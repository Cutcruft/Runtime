<script setup lang="ts">
import { computed } from 'vue'
import ComponentHost from './ComponentHost.vue'
import { useCfg } from '../renderer/useConfig'
import type { GridConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<GridConfig>(props.config, { columns: 1, gap: 'var(--rt-space)' })

const columns = computed(() => Math.max(1, Math.min(cfg.value.columns ?? 1, 12)))

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${columns.value}, minmax(0, 1fr))`,
  gap: cfg.value.gap,
  ...(cfg.value.style ?? {})
}))
</script>

<template>
  <div class="ui-grid" :class="cfg.className" :style="gridStyle">
    <ComponentHost
      v-for="(child, index) in cfg.components ?? []"
      :key="index"
      :component="child"
      :context="context"
    />
  </div>
</template>

<style scoped>
.ui-grid {
  display: grid;
  align-items: start;
}
</style>
