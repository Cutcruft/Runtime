<script setup lang="ts">
import { onMounted } from 'vue'
import { themeStore, applyTheme } from '../store/theme'

onMounted(() => {
  themeStore.init()
})

// Re-apply theme when the document is ready (for SSR-like scenarios)
if (document.readyState === 'complete') {
  applyTheme()
}
</script>

<template>
  <slot />
</template>
