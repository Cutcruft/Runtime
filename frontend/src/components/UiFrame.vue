<script setup lang="ts">
import { computed } from 'vue'
import { useCfg } from '../renderer/useConfig'

interface FrameConfig {
  src: string
  width?: string
  height?: string
  title?: string
  sandbox?: string
  className?: string
}

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<FrameConfig>(props.config, { src: '' })

/** Resolves `src` to a renderable URL: `page:<id>` → embed, `asset:<pluginId>/<path>` → plugin asset. */
const src = computed(() => {
  const value = cfg.value.src
  if (value.startsWith('page:')) {
    const pageId = value.slice('page:'.length)
    return `/embed?page=${encodeURIComponent(pageId)}`
  }
  if (value.startsWith('asset:')) {
    const rest = value.slice('asset:'.length)
    return `/plugin-assets/${rest}`
  }
  return value
})

function isExternal(target: string): boolean {
  return target.startsWith('http') || target.startsWith('https')
}
</script>

<template>
  <iframe
    v-if="src"
    class="ui-frame"
    :class="cfg.className"
    :src="src"
    :title="cfg.title ?? 'Embedded frame'"
    :width="cfg.width"
    :height="cfg.height"
    :sandbox="cfg.sandbox"
    :allow="!isExternal(src) ? 'clipboard-read; clipboard-write' : undefined"
    loading="lazy"
  />
  <span v-else class="ui-frame--empty">frame: missing src</span>
</template>

<style scoped>
.ui-frame {
  display: block;
  width: 100%;
  min-height: 16rem;
  max-width: 100%;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius);
  background: var(--rt-color-surface);
}
.ui-frame--empty {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
  border: 1px dashed var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
}
</style>
