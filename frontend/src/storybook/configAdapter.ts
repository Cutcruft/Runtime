import type { WorkspaceConfig, ComponentDefinition, PageDefinition } from '../protocol/types'

export interface UiDocsComponentFixture {
  id: string
  title: string
  component: ComponentDefinition
  pageId?: string
  sectionId?: string
}

export interface UiDocsCatalog {
  theme: WorkspaceConfig['app']['theme']
  components: UiDocsComponentFixture[]
  pages: PageDefinition[]
}

/**
 * Converts a live `/config` payload into UIDocs fixtures. Storybook can use the
 * fixtures as controls-ready examples without inventing a second config shape.
 */
export function configToUiDocsCatalog(config: WorkspaceConfig): UiDocsCatalog {
  const components: UiDocsComponentFixture[] = []

  for (const page of config.pages) {
    for (const section of page.sections) {
      section.components.forEach((component, index) => {
        const configuredId = typeof component.config.id === 'string' ? component.config.id : null
        components.push({
          id: configuredId ?? `${page.id}:${section.id}:${index}:${component.type}`,
          title: `${page.title} / ${section.id} / ${component.type}`,
          component,
          pageId: page.id,
          sectionId: section.id
        })
      })
    }
  }

  return {
    theme: config.app.theme,
    components,
    pages: config.pages
  }
}
