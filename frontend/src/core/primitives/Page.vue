<script setup lang="ts">
import { computed } from 'vue'
import SectionView from './Section.vue'
import LayerView from './Layer.vue'
import { i18nStore } from '../../store/i18n'
import { layerStore } from '../../store/layer'
import type { BindingContext } from '../../protocol/componentSpec'
import type { PageDefinition } from '../../protocol/types'

const props = defineProps<{ page: PageDefinition; context?: BindingContext }>()

const tr = i18nStore.tr

const hasLayers = computed(() => layerStore.hasLayers(props.page))
const visibleLayers = computed(() => {
  if (!hasLayers.value) return []
  return layerStore.getVisibleLayers(props.page.id, props.page.layers!)
})
</script>

<template>
  <article class="page">
    <h2 class="page__title">{{ tr(props.page.title) }}</h2>
    <template v-if="hasLayers">
      <LayerView
        v-for="layer in visibleLayers"
        :key="layer.id"
        :layer="layer"
        :page-id="page.id"
        :context="context"
      />
    </template>
    <template v-else>
      <SectionView
        v-for="section in page.sections"
        :key="section.id"
        :section="section"
        :context="context"
      />
    </template>
  </article>
</template>

<style scoped>
.page__title {
  margin: 0 0 var(--rt-space-lg);
  font-size: var(--rt-font-size-xl);
}
</style>
