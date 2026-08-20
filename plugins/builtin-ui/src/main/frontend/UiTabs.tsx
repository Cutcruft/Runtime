import { useSignal } from '@preact/signals'
import { useCfg, Container, type TabsConfig } from '@cutcrft/runtime-client'
import type { ComponentProps } from './common'

export default function UiTabs(props: ComponentProps) {
  const cfg = useCfg<TabsConfig>(props.config, { tabs: [], activeTab: '' })
  const active = useSignal<string>(cfg.value.activeTab ?? cfg.value.tabs?.[0]?.id ?? '')
  const tabs = cfg.value.tabs ?? []

  return (
    <div class={`ui-tabs${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style}>
      <div class="ui-tabs__bar" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active.value === tab.id}
            class={`ui-tabs__tab${active.value === tab.id ? ' ui-tabs__tab--active' : ''}`}
            disabled={tab.disabled}
            onClick={() => { active.value = tab.id }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div class="ui-tabs__content">
        {tabs.filter((tab) => tab.id === active.value).map((tab) => (
          <div key={tab.id}>
            {(tab.components ?? []).map((child, index) => (
              <Container key={index} component={child} context={props.context} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
