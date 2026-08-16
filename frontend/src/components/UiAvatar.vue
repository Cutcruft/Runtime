<script setup lang="ts">
import { computed } from 'vue'
import { useCfg } from '../renderer/useConfig'
import { iconView } from '../renderer/icon'
import type { AvatarConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<AvatarConfig>(props.config, { size: 'medium', tone: 'neutral', name: '' })

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const display = computed(() => cfg.value.fallback || initials(cfg.value.name ?? ''))
const img = computed(() => iconView(cfg.value.src).src)
</script>

<template>
  <span class="ui-avatar" :class="[`ui-avatar--${cfg.size}`, `ui-avatar--${cfg.tone}`, cfg.className]" :style="cfg.style" :title="cfg.tooltip">
    <img v-if="img" class="ui-avatar__img" :src="img" alt="" />
    <span v-else class="ui-avatar__text">{{ display }}</span>
  </span>
</template>

<style scoped>
.ui-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: var(--rt-color-bg);
  color: var(--rt-color-muted);
  font-weight: 600;
}
.ui-avatar--small {
  width: 1.5rem;
  height: 1.5rem;
  font-size: var(--rt-font-size-sm);
}
.ui-avatar--medium {
  width: 2rem;
  height: 2rem;
  font-size: var(--rt-font-size);
}
.ui-avatar--large {
  width: 2.75rem;
  height: 2.75rem;
  font-size: var(--rt-font-size-lg);
}
.ui-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ui-avatar--gray { background: #e8eaed; color: #3c4043; }
.ui-avatar--blue { background: #e3edfb; color: #0052a3; }
.ui-avatar--green { background: #dff3e3; color: #1b7f3b; }
.ui-avatar--red { background: #fbe3e3; color: #a31b1b; }
.ui-avatar--amber { background: #fdf0dc; color: #8a4b00; }
.ui-avatar--purple { background: #efeafb; color: #4a1f8f; }
</style>
