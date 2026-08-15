<script setup lang="ts">
import { computed } from 'vue'
import { overlayService } from './overlayService'
import ContextMenuHost from './ContextMenuHost.vue'
import ModalHost from './ModalHost.vue'
import PanelHost from './PanelHost.vue'
import TooltipHost from './TooltipHost.vue'

const overlays = computed(() => overlayService.overlays)
</script>

<template>
  <teleport to="body">
    <template v-for="instance in overlays" :key="instance.uid">
      <ContextMenuHost v-if="instance.definition.kind === 'menu'" :instance="instance" />
      <ModalHost v-else-if="instance.definition.kind === 'modal'" :instance="instance" />
      <PanelHost v-else-if="instance.definition.kind === 'panel'" :instance="instance" />
      <TooltipHost v-else-if="instance.definition.kind === 'tooltip'" :instance="instance" />
    </template>
  </teleport>
</template>
