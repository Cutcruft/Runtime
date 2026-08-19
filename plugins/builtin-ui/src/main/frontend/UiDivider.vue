<script setup lang="ts">
import { computed } from 'vue'
import { useCfg } from '@cutcrft/runtime-client'
import type { DividerConfig } from '@cutcrft/runtime-client'

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<DividerConfig>(props.config, {})

const dashed = computed(() => cfg.value.dashed === true)
</script>

<template>
  <div class="ui-divider" :class="{ 'ui-divider--dashed': dashed }" :style="cfg.style">
    <span v-if="cfg.text" class="ui-divider__text">{{ cfg.text }}</span>
  </div>
</template>

<style scoped>
.ui-divider {
  display: flex;
  align-items: center;
  gap: var(--rt-space-sm);
  margin: var(--rt-space) 0;
  border-top: 1px solid var(--rt-color-border);
}
.ui-divider--dashed {
  border-top-style: dashed;
}
.ui-divider__text {
  padding-right: var(--rt-space-sm);
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
  background: inherit;
}
</style>
