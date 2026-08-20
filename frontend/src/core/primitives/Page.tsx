import { i18nStore } from '../../store/i18n'
import { layerStore } from '../../store/layer'
import type { BindingContext } from '../../protocol/componentSpec'
import type { PageDefinition } from '../../protocol/types'
import { Section } from './Section'
import { Layer } from './Layer'
import * as styles from './styles.css'

interface PageProps {
  page: PageDefinition
  context?: BindingContext
}

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
          <Section key={section.id} section={section} context={context} />
        ))
      )}
    </article>
  )
}
