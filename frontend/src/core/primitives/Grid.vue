<script setup lang="ts">
defineProps<{
  columns?: number | string
  rows?: number | string
  gap?: string
  minColWidth?: string
  minRowHeight?: string
  align?: string
  justify?: string
  padding?: string
}>()
</script>

<template>
  <div
    class="grid"
    :style="{
      gridTemplateColumns: minColWidth
        ? `repeat(auto-fill, minmax(${minColWidth}, 1fr))`
        : typeof columns === 'number'
          ? `repeat(${columns}, 1fr)`
          : columns,
      gridTemplateRows: typeof rows === 'number'
        ? `repeat(${rows}, 1fr)`
        : rows,
      gap: gap,
      gridAutoRows: minRowHeight,
      alignItems: align,
      justifyItems: justify,
      padding: padding
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  min-width: 0;
  min-height: 0;
}
</style>
