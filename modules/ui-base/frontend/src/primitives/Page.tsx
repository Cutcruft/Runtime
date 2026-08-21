import { i18nStore } from '@cutcrft/plugin-sdk'
import { layerStore } from '@cutcrft/plugin-sdk'
import { Container } from '@cutcrft/plugin-sdk'
import type { BindingContext } from '@cutcrft/plugin-sdk'
import type { PageDefinition } from '@cutcrft/plugin-sdk'
import type { ComponentDefinition, SectionDefinition } from '@cutcrft/plugin-sdk'
import { Layer } from './Layer'
import * as styles from './styles.css'

interface PageProps {
  page: PageDefinition
  context?: BindingContext
}

/**
 * V10 — page shell. Renders layers, or sections resolved as primitives from the
 * registry (the ui-layout module provides the "Section" primitive).
 */
export function Page({ page, context }: PageProps) {
  const tr = i18nStore.tr
  const hasLayers = layerStore.hasLayers(page)
  const visibleLayers = hasLayers
    ? layerStore.getVisibleLayers(page.id, page.layers!)
    : []

  return (
    <article>
      <h2 class={styles.pageTitle}>{tr(page.title)}</h2>
      {hasLayers ? (
        visibleLayers.map((layer) => (
          <Layer key={layer.id} layer={layer} pageId={page.id} context={context} />
        ))
      ) : (
        page.sections.map((section) => (
          <Container
            key={section.id}
            context={context}
            component={sectionToComponent(section)}
          />
        ))
      )}
    </article>
  )
}

/** Converts a SectionDefinition into a ComponentDefinition resolved as "Section" primitive. */
function sectionToComponent(section: SectionDefinition): ComponentDefinition {
  const children: ComponentDefinition[] = (section.components ?? []).map((c) => ({
    type: c.type,
    config: c.config,
    children: c.children,
  }))
  return {
    type: 'Section',
    config: {
      id: section.id,
      layout: section.layout,
      columns: section.columns,
      children,
    },
  }
}
