import { useSignal } from '@preact/signals'
import { useCfg, findAction, runAction, resolveParams, sessionStore, iconView, mountShortcut, isDisabledByModel, buildModelParams, type BindingContext, type ButtonConfig, type ShortcutEntry } from '@cutcrft/plugin-sdk'
import { useEffect } from 'preact/hooks'
import type { ComponentProps } from './common'

export default function UiButton(props: ComponentProps) {
  const cfg = useCfg<ButtonConfig>(props.config, { label: 'Execute', variant: 'default', size: 'medium' })
  const busy = useSignal(false)
  const context: BindingContext = { ...(props.context ?? {}), page: props.context?.page ?? null }

  // V6: model-driven disable (disabledWhen conditions against row/context).
  const modelDisabled = isDisabledByModel(cfg.value.disabledWhen, context)
  const disabled = busy.value || cfg.value.disabled || modelDisabled

  async function run(): Promise<void> {
    if (disabled) return
    const clickAction = findAction(cfg.value.actions, 'click')
    if (clickAction) {
      busy.value = true
      try {
        await runAction(clickAction, context)
      } finally {
        busy.value = false
      }
      return
    }
    if (cfg.value.command) {
      // V6: build params from entity fields when entityType/fields are set.
      const params = buildModelParams(
        cfg.value.command,
        cfg.value.params,
        cfg.value.entityType,
        cfg.value.fields,
        context
      )
      busy.value = true
      try {
        await sessionStore.executeCommand(cfg.value.command, params)
      } finally {
        busy.value = false
      }
    }
  }

  useEffect(() => {
    const keys = cfg.value.shortcutKeys
    if (keys && keys.length > 0 && (cfg.value.command || findAction(cfg.value.actions, 'click'))) {
      const entry: ShortcutEntry = {
        id: `button:${cfg.value.command ?? 'action'}:${cfg.value.label ?? 'btn'}`,
        keys,
        action: 'command',
        command: cfg.value.command,
        params: cfg.value.params,
        scope: 'component'
      }
      return mountShortcut(entry)
    }
    return undefined
  }, [cfg.value.command, cfg.value.shortcutKeys])

  const icon = iconView(cfg.value.icon)
  return (
    <button
      class={`ui-button ui-button--${cfg.value.variant} ui-button--${cfg.value.size}${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      disabled={disabled}
      title={cfg.value.tooltip}
      style={cfg.value.style}
      onClick={run}
    >
      {icon.src ? <img class="ui-button__icon ui-button__icon--img" src={icon.src} alt="" /> : null}
      {icon.glyph ? <span class="ui-button__icon">{icon.glyph}</span> : null}
      {busy.value ? 'Working…' : cfg.value.label}
      {cfg.value.shortcutKeys && cfg.value.shortcutKeys.length > 0 ? (
        <kbd class="ui-button__shortcut">{cfg.value.shortcutKeys.join(' ')}</kbd>
      ) : null}
    </button>
  )
}
