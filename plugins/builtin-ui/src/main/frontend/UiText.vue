<script setup lang="ts">
import { computed } from 'vue'
import { useCfg } from '@cutcrft/runtime-client'
import { useData } from '@cutcrft/runtime-client'
import { formatValue } from '@cutcrft/runtime-client'
import type { TextConfig } from '@cutcrft/runtime-client'

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<TextConfig>(props.config, { tag: 'p', text: '', align: 'left' })

const { value } = useData(
  () => cfg.value.data,
  () => props.context ?? {}
)

const text = computed(() => {
  const staticText = cfg.value.text
  if (staticText) return staticText
  return cfg.value.data ? formatValue(value.value) : ''
})
</script>

<template>
  <component
    :is="cfg.tag ?? 'p'"
    class="ui-text"
    :class="cfg.className"
    :style="{ textAlign: cfg.align, ...(cfg.style ?? {}) }"
    :title="cfg.tooltip"
  >
    {{ text }}
  </component>
</template>

<style scoped>
.ui-text {
  margin: 0;
}
</style>
