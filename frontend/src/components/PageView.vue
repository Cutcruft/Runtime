<script setup lang="ts">
import SectionView from './SectionView.vue'
import { i18nStore } from '../store/i18n'
import type { BindingContext } from '../protocol/componentSpec'
import type { PageDefinition } from '../protocol/types'

const props = defineProps<{ page: PageDefinition; context?: BindingContext }>()

const tr = i18nStore.tr
</script>

<template>
  <article class="page">
    <h2 class="page__title">{{ tr(props.page.title) }}</h2>
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
