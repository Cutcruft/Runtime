<script setup lang="ts">
import { useCfg } from '@cutcrft/runtime-client'
import type { BadgeConfig } from '@cutcrft/runtime-client'

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<BadgeConfig>(props.config, { tone: 'neutral', text: '' })
</script>

<template>
  <span class="ui-badge" :class="[`ui-badge--${cfg.tone}`, cfg.className]" :style="cfg.style" :title="cfg.tooltip">
    {{ cfg.text }}
  </span>
</template>

