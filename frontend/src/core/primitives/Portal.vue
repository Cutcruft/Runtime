<script setup lang="ts">
defineProps<{
  to?: string
}>()
</script>

<template>
  <Teleport :to="to ?? 'body'">
    <slot />
  </Teleport>
</template>
