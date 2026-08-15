<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { overlayService, type OverlayInstance } from '../overlay/overlayService'
import { i18nStore } from '../store/i18n'

const props = defineProps<{ instance: OverlayInstance }>()

const tr = i18nStore.tr

const el = ref<HTMLDivElement | null>(null)

function clamp(): void {
  const node = el.value
  if (!node) return
  const rect = node.getBoundingClientRect()
  node.style.left = `${Math.min(Math.max(8, props.instance.anchor?.x ?? 8), window.innerWidth - rect.width - 8)}px`
  node.style.top = `${Math.min(Math.max(8, props.instance.anchor?.y ?? 8), window.innerHeight - rect.height - 8)}px`
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    e.stopPropagation()
    overlayService.close(props.instance.uid)
  }
}

onMounted(() => {
  clamp()
  window.addEventListener('keydown', onKeydown, true)
  window.addEventListener('resize', clamp)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown, true)
  window.removeEventListener('resize', clamp)
})
</script>

<template>
  <div ref="el" class="rt-tooltip" :style="`--rt-placement: ${instance.definition.placement ?? 'top'}`" @mousedown.stop>
    {{ tr(instance.definition.text ?? '') }}
  </div>
</template>

<style scoped>
.rt-tooltip {
  position: fixed;
  z-index: 1300;
  max-width: 18rem;
  padding: 0.4rem 0.6rem;
  background: var(--rt-color-inverse-bg, #222);
  color: var(--rt-color-inverse-text, #fff);
  border-radius: var(--rt-radius-sm);
  font-size: var(--rt-font-size-sm);
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
