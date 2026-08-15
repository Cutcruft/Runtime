<script setup lang="ts">
import { toasts } from '../store/toasts'
</script>

<template>
  <div class="toast-viewport">
    <div
      v-for="toast in toasts.list"
      :key="toast.id"
      class="toast"
      :class="`toast--${toast.kind}`"
      @click="toasts.remove(toast.id)"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
.toast-viewport {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}
.toast {
  padding: 0.6rem 1rem;
  border-radius: var(--rt-radius);
  background: #333;
  color: #fff;
  font-size: var(--rt-font-size);
  box-shadow: var(--rt-shadow);
  cursor: pointer;
  max-width: 20rem;
}
.toast--error {
  background: var(--rt-color-danger);
}
.toast--success {
  background: var(--rt-color-success);
}
</style>
