<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import SectionView from './Section.vue'
import type { BindingContext } from '../../protocol/componentSpec'
import type { LayerDefinition } from '../../protocol/types'

const props = defineProps<{
  layer: LayerDefinition
  pageId: string
  context?: BindingContext
}>()
const layerRef = ref<HTMLElement | null>(null)

/**
 * pass-through JS logic:
 * When pointerEvents === 'pass-through', the layer container has pointer-events: none,
 * but interactive children (buttons, inputs, editors, links, [data-interactive]) get
 * pointer-events: auto. Empty areas pass through to lower layers.
 */
const isPassThrough = computed(() => props.layer.pointerEvents === 'pass-through')

function updatePassThrough() {
  if (!layerRef.value || !isPassThrough.value) return
  const el = layerRef.value
  // Mark interactive descendants so CSS can target them
  const interactive = el.querySelectorAll(
    'button, a, input, select, textarea, [role="button"], [role="tab"], [data-interactive], .editor, .toolbar'
  )
  interactive.forEach(child => {
    ;(child as HTMLElement).style.pointerEvents = 'auto'
  })
}

let observer: MutationObserver | null = null

onMounted(() => {
  if (isPassThrough.value) {
    updatePassThrough()
    // Watch for DOM changes (lazy-loaded editors, dynamic content)
    observer = new MutationObserver(() => updatePassThrough())
    if (layerRef.value) {
      observer.observe(layerRef.value, { childList: true, subtree: true })
    }
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

watch(() => props.layer.pointerEvents, () => {
  if (isPassThrough.value) {
    updatePassThrough()
  }
})

const layerStyle = computed(() => {
  const pos = props.layer.position
  const style: Record<string, string> = {
    zIndex: String(props.layer.order),
    opacity: String(props.layer.opacity ?? 1),
    pointerEvents: isPassThrough.value ? 'none' : (props.layer.pointerEvents ?? 'auto')
  }

  if (pos) {
    style.position = pos.type ?? 'relative'
    if (pos.top != null) style.top = pos.top
    if (pos.left != null) style.left = pos.left
    if (pos.right != null) style.right = pos.right
    if (pos.bottom != null) style.bottom = pos.bottom
    if (pos.width != null) style.width = pos.width
    if (pos.height != null) style.height = pos.height
  }

  // Merge user-defined styles
  if (props.layer.style) {
    Object.assign(style, props.layer.style)
  }

  return style
})
</script>

<template>
  <div
    ref="layerRef"
    class="layer"
    :class="[layer.className, { 'layer--hidden': !layer.visible }]"
    :style="layerStyle"
    :data-layer-id="layer.id"
  >
    <SectionView
      v-for="section in layer.sections"
      :key="section.id"
      :section="section"
      :context="context"
    />
  </div>
</template>

<style scoped>
.layer {
  position: relative;
  min-height: 0;
}
.layer--hidden {
  display: none;
}
</style>
