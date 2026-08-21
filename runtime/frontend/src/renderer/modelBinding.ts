import { configStore } from '../store/config'
import { resolveParam } from './bindingEngine'
import type { BindingContext } from '../protocol/componentSpec'
import type { EntitySchema } from '../protocol/types'

/**
 * V6 — model-driven button binding.
 * Resolves an entity's field schema from /config/entities, builds command params
 * from `fields` (static values or `$row.…`/`$values.…` context references), and
 * evaluates `disabledWhen` conditions against the row/context.
 */

export function entitySchema(entityType: string | undefined): EntitySchema | null {
  if (!entityType) return null
  const entry = configStore.entities.find((e) => e.type === entityType)
  return entry?.schema ?? null
}

/** True when the button should be disabled based on `disabledWhen` conditions. */
export function isDisabledByModel(
  disabledWhen: Record<string, unknown> | undefined,
  context: BindingContext
): boolean {
  if (!disabledWhen) return false
  const row = (context.row ?? {}) as Record<string, unknown>
  return Object.entries(disabledWhen).some(([key, expected]) => {
    const actual = row[key]
    return String(actual ?? '') === String(expected ?? '')
  })
}

/**
 * Builds the command params for a model-bound button.
 * - `fields` provided: each entry is resolved (static or context reference) → params.
 * - `fields` omitted + entityType set: pass through the entity's schema fields
 *   that exist on the row (so `demo.taskupdate` gets id + changed fields).
 * - falls back to plain `params`.
 */
export function buildModelParams(
  command: string | undefined,
  params: Record<string, unknown> | undefined,
  entityType: string | undefined,
  fields: Record<string, unknown> | undefined,
  context: BindingContext
): Record<string, unknown> {
  if (!command) return {}
  if (fields) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      const resolved = resolveParam(value, context)
      if (resolved !== undefined) result[key] = resolved
    }
    return result
  }
  if (entityType) {
    const schema = entitySchema(entityType)
    const row = (context.row ?? {}) as Record<string, unknown>
    const result: Record<string, unknown> = { ...(params ?? {}) }
    for (const field of schema?.fields ?? []) {
      if (field.name in row) result[field.name] = row[field.name]
    }
    return result
  }
  return resolveParam(params ?? {}, context) as Record<string, unknown>
}

/** Validates required entity fields against the row — returns missing field names. */
export function missingRequiredFields(
  entityType: string | undefined,
  row: Record<string, unknown> | undefined
): string[] {
  if (!entityType || !row) return []
  const schema = entitySchema(entityType)
  if (!schema) return []
  return (schema.fields ?? [])
    .filter((f) => f.required && (row[f.name] === undefined || row[f.name] === null || row[f.name] === ''))
    .map((f) => f.name)
}
