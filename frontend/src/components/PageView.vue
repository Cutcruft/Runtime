<script setup lang="ts">
import SectionView from './SectionView.vue'
import type { BindingContext } from '../protocol/componentSpec'
import type { PageDefinition } from '../protocol/types'

defineProps<{ page: PageDefinition; context?: BindingContext }>()
</script>

<template>
  <article class="page">
    <h2 class="page__title">{{ page.title }}</h2>
    <SectionView
      v-for="section in page.sections"
      :key="section.id"
      :section="section"
      :context="context"
    />
  </article>
</template>

<style scoped>
.page__title {
  margin: 0 0 var(--rt-space-lg);
  font-size: var(--rt-font-size-xl);
}
</style>
