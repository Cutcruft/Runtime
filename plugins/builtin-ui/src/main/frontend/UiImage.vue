<script setup lang="ts">
import { useCfg } from '@cutcrft/runtime-client'
import type { ImageConfig } from '@cutcrft/runtime-client'

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<ImageConfig>(props.config, { fit: 'cover' })

function isHttpSource(src: string): boolean {
  return src.startsWith('http') || src.startsWith('data:') || src.startsWith('/')
}
</script>

<template>
  <img
    v-if="cfg.src && isHttpSource(cfg.src)"
    class="ui-image"
    :class="cfg.className"
    :src="cfg.src"
    :alt="cfg.alt ?? ''"
    :title="cfg.tooltip"
    :style="{ objectFit: cfg.fit, width: cfg.width, height: cfg.height, ...(cfg.style ?? {}) }"
  />
  <span v-else class="ui-image--empty">image: {{ cfg.src }}</span>
</template>

<style scoped>
.ui-image {
  display: block;
  max-width: 100%;
  border-radius: var(--rt-radius-sm);
}
.ui-image--empty {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
  border: 1px dashed var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
}
</style>
