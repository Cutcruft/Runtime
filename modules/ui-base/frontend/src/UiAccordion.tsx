import { useSignal } from '@preact/signals'
import { useCfg, Container, type AccordionConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiAccordion(props: ComponentProps) {
  const cfg = useCfg<AccordionConfig>(props.config, { items: [] })
  const openId = useSignal<string | null>(cfg.value.items?.find((i) => i.open)?.id ?? null)
  const items = cfg.value.items ?? []

  return (
    <div class={`ui-accordion${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style}>
      {items.map((item) => {
        const isOpen = openId.value === item.id
        return (
          <div key={item.id} class={`ui-accordion__item${isOpen ? ' ui-accordion__item--open' : ''}`}>
            <button
              class="ui-accordion__header"
              disabled={item.disabled}
              onClick={() => { openId.value = isOpen ? null : item.id }}
            >
              <span class="ui-accordion__marker">{isOpen ? '▾' : '▸'}</span>
              <span class="ui-accordion__label">{item.label}</span>
            </button>
            {isOpen ? (
              <div class="ui-accordion__content">
                {(item.components ?? []).map((child, index) => (
                  <Container key={index} component={child} context={props.context} />
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
