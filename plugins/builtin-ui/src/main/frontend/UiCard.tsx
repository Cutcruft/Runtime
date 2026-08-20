import { useRef } from 'preact/hooks'
import { useCfg, useContainerQuery, findAction, runAction, resolveParams, sessionStore, Container, type BindingContext, type CardConfig } from '@cutcrft/runtime-client'
import type { ComponentProps } from './common'

export default function UiCard(props: ComponentProps) {
  const root = useRef<HTMLDivElement | null>(null)
  const cq = useContainerQuery(root)
  const cfg = useCfg<CardConfig>(props.config, { bordered: true, padding: 'var(--rt-space-lg)' })

  async function headerActionClick(command: string | undefined, params: Record<string, unknown> | undefined): Promise<void> {
    if (command) {
      runAction(findAction(cfg.value.actions, 'headerAction'), {
        ...(props.context ?? {}),
        payload: { command, params: resolveParams(params, props.context ?? {}) }
      })
      await sessionStore.executeCommand(command, resolveParams(params, props.context ?? {}))
    }
  }

  const context = props.context
  return (
    <section
      ref={root}
      class={`ui-card ui-card--cq-${cq.value}${cfg.value.bordered ? ' ui-card--bordered' : ''}${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      style={cfg.value.style}
    >
      {cfg.value.title || cfg.value.subtitle || cfg.value.headerActions?.length ? (
        <header class="ui-card__header">
          <div class="ui-card__heading">
            {cfg.value.title ? <h3 class="ui-card__title">{cfg.value.title}</h3> : null}
            {cfg.value.subtitle ? <p class="ui-card__subtitle">{cfg.value.subtitle}</p> : null}
          </div>
          {cfg.value.headerActions ? (
            <div class="ui-card__actions">
              {cfg.value.headerActions.map((action, index) => (
                <button
                  key={index}
                  class={`ui-button ui-button--${action.variant ?? 'default'} ui-button--small`}
                  onClick={() => headerActionClick(action.command ?? '', action.params)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </header>
      ) : null}
      <div class="ui-card__body" style={{ padding: cfg.value.padding }}>
        {(cfg.value.components ?? []).map((child, index) => (
          <Container key={index} component={child} context={context} />
        ))}
      </div>
    </section>
  )
}
