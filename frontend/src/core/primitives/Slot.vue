<script setup lang="ts">
defineProps<{
  name?: string
}>()
</script>

<template>
  <div class="slot" :data-slot-name="name ?? 'default'">
    <slot />
  </div>
</template>

<style scoped>
.slot {
  min-width: 0;
  min-height: 0;
}
</style>
