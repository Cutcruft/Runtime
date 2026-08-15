<script setup lang="ts">
import { computed } from 'vue'
import ComponentHost from './ComponentHost.vue'
import { useCfg } from '../renderer/useConfig'
import type { SpaceConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<SpaceConfig>(props.config, { direction: 'horizontal', gap: '0.5rem' })

const layoutStyle = computed<Record<string, string>>(() => ({
  flexDirection: cfg.value.direction === 'vertical' ? 'column' : 'row',
  gap: cfg.value.gap ?? '0.5rem',
  alignItems: cfg.value.align ?? 'stretch',
  flexWrap: cfg.value.wrap ? 'wrap' : 'nowrap',
  ...(cfg.value.style ?? {})
}))
</script>

<template>
  <div class="ui-space" :class="cfg.className" :style="layoutStyle" :title="cfg.tooltip">
    <ComponentHost
      v-for="(child, index) in cfg.components ?? []"
      :key="index"
      :component="child"
      :context="context"
    />
  </div>
</template>

<style scoped>
.ui-space {
  display: flex;
}
</style>
