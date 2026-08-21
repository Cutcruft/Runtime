import { sessionStore } from '../store/session'
import { pageStore } from '../store/page'
import { toasts } from '../store/toasts'
import { i18nStore } from '../store/i18n'
import { overlayService } from '../overlay-service'
import { emitEvent } from '../events/eventBus'
import type { ActionBinding, ActionSpec, BindingContext, DataBinding } from '../protocol/componentSpec'

const PATH_PATTERN = /^\$([\w.]+)$/

function resolvePath(path: string, context: BindingContext): unknown {
  const parts = path.split('.')
  let value: unknown = context[parts[0] as keyof BindingContext]
  for (let i = 1; i < parts.length && value != null; i++) {
    value = (value as Record<string, unknown>)[parts[i]]
  }
  return value
}

export function resolveParam(value: unknown, context: BindingContext): unknown {
  if (typeof value === 'string') {
    const match = PATH_PATTERN.exec(value)
    if (match) {
      const resolved = resolvePath(match[1], context)
      if (resolved !== undefined) return resolved
    }
    return value
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveParam(item, context))
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      result[key] = resolveParam(item, context)
    }
    return result
  }
  return value
}

export function resolveParams(
  params: Record<string, unknown> | undefined,
  context: BindingContext
): Record<string, unknown> {
  if (!params) return {}
  return resolveParam(params, context) as Record<string, unknown>
}

export interface LoadResult {
  value: unknown
  error: string | null
}

export async function loadData(binding: DataBinding | undefined, context: BindingContext): Promise<LoadResult> {
  if (!binding?.command) return { value: null, error: null }
  try {
    const result = await sessionStore.execute(binding.command, resolveParams(binding.params, context))
    if (result.status === 'ERROR') {
      return { value: null, error: result.error ?? `Command '${binding.command}' failed` }
    }
    return { value: result.value, error: null }
  } catch (error) {
    return { value: null, error: String(error) }
  }
}

export async function dispatchAction(spec: ActionSpec, context: BindingContext): Promise<boolean> {
  switch (spec.action) {
    case 'navigate': {
      pageStore.openPage(spec.page)
      return true
    }
    case 'command': {
      try {
        const result = await sessionStore.executeCommand(spec.command, resolveParams(spec.params, context))
        if (result.status === 'SUCCESS') {
          toasts.push({ message: `'${spec.command}' ok`, kind: 'success' })
        }
      } catch {
        /* error toast already shown by executeCommand */
      }
      return true
    }
    case 'toast': {
      const message = resolveParam(spec.message, context)
      toasts.push({ message: i18nStore.tr(String(message)), kind: 'info' })
      return true
    }
    case 'openModal':
    case 'openPanel':
    case 'openMenu': {
      overlayService.open(spec.overlay, spec.action === 'openMenu' ? { x: 0, y: 0 } : null, context)
      return true
    }
    case 'closeOverlay': {
      overlayService.closeAll()
      return true
    }
    case 'copyToClipboard': {
      const value = spec.value !== undefined ? String(resolveParam(spec.value, context)) : ''
      void overlayService.copyText(value)
      return true
    }
    case 'editor': {
      emitEvent({
        kind: 'editor.command',
        payload: {
          editor: spec.editor,
          command: spec.command,
          params: resolveParams(spec.params, context),
          componentId: context.payload?.componentId
        }
      })
      return true
    }
    default:
      return false
  }
}

export function findAction(
  actions: ActionBinding[] | undefined,
  event: string
): ActionBinding | undefined {
  return actions?.find((action) => action.event === event)
}

export async function runAction(
  action: ActionBinding | undefined,
  context: BindingContext
): Promise<boolean> {
  if (!action) return false
  if (action.confirm && !window.confirm(i18nStore.tr(action.confirm))) return false
  return dispatchAction(action.spec, context)
}
