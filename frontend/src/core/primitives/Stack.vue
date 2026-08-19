<script setup lang="ts">
defineProps<{
  direction?: 'vertical' | 'horizontal'
  gap?: string
  align?: string
  justify?: string
  wrap?: boolean
  padding?: string
}>()
</script>

<template>
  <div
    class="stack"
    :class="[`stack--${direction ?? 'vertical'}`, { 'stack--wrap': wrap }]"
    :style="{
      gap: gap,
      alignItems: align,
      justifyContent: justify,
      padding: padding
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  min-width: 0;
  min-height: 0;
}
.stack--vertical {
  flex-direction: column;
}
.stack--horizontal {
  flex-direction: row;
}
.stack--wrap {
  flex-wrap: wrap;
}
</style>
