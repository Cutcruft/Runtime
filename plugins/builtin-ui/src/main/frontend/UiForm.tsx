import { useSignal } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { sessionStore, toasts, i18nStore, useCfg, useContainerQuery, findAction, runAction, type BindingContext, type FormFieldConfig, type FormConfig } from '@cutcrft/runtime-client'
import type { ComponentProps } from './common'

export default function UiForm(props: ComponentProps) {
  const t = i18nStore.t
  const root = useRef<HTMLFormElement | null>(null)
  const cq = useContainerQuery(root)
  const cfg = useCfg<FormConfig>(props.config, { submitLabel: '', fields: [], layout: {} })
  const fields = cfg.value.fields ?? []

  const values = useSignal<Record<string, unknown>>({})
  const errors = useSignal<Record<string, string>>({})
  const optionsCache = useSignal<Record<string, Array<Record<string, unknown>>>>({})
  const busy = useSignal(false)

  function defaultValue(field: FormFieldConfig): string | number | boolean {
    if (field.defaultValue !== undefined) return field.defaultValue
    return field.type === 'checkbox' ? false : ''
  }

  function initValues(): void {
    const next: Record<string, unknown> = {}
    const errs: Record<string, string> = {}
    for (const field of fields) {
      if (!(field.name in values.value)) next[field.name] = defaultValue(field)
      errs[field.name] = ''
    }
    values.value = { ...values.value, ...next }
    errors.value = errs
  }

  useEffect(() => { initValues() }, [fields.map((f) => f.name).join(',')])

  useEffect(() => {
    fields.filter((field) => field.options).forEach((field) => loadOptions(field))
  }, [fields.map((f) => f.name).join(',')])

  async function loadOptions(field: FormFieldConfig): Promise<void> {
    if (!field.options || optionsCache.value[field.name]) return
    try {
      const result = await sessionStore.execute(field.options.command, field.options.params ?? {})
      if (result.status === 'SUCCESS' && Array.isArray(result.value)) {
        optionsCache.value = { ...optionsCache.value, [field.name]: result.value as Array<Record<string, unknown>> }
      }
    } catch { /* options are optional */ }
  }

  function optionRows(field: FormFieldConfig): Array<Record<string, unknown>> {
    return field.options ? optionsCache.value[field.name] ?? [] : []
  }

  function fieldLabel(field: FormFieldConfig): string {
    return field.label ?? field.name
  }

  function optionValue(field: FormFieldConfig, option: Record<string, unknown>): string {
    if (!field.options) return String(option)
    const valueKey = field.options.valueKey
    return valueKey in option ? String(option[valueKey]) : String(option)
  }

  function optionLabel(field: FormFieldConfig, option: Record<string, unknown>): string {
    if (!field.options) return String(option)
    const labelKey = field.options.labelKey
    return labelKey in option ? String(option[labelKey]) : String(option)
  }

  function validate(): boolean {
    let ok = true
    const errs: Record<string, string> = {}
    for (const field of fields) {
      const value = values.value[field.name]
      const text = String(value ?? '').trim()
      if (field.required && (value === '' || value === false || value === undefined)) {
        errs[field.name] = `${fieldLabel(field)} is required`
        ok = false
        continue
      }
      if (field.type !== 'checkbox' && field.minLength !== undefined && text.length < field.minLength) {
        errs[field.name] = `${fieldLabel(field)} must be at least ${field.minLength} characters`
        ok = false
      } else if (field.type !== 'checkbox' && field.maxLength !== undefined && text.length > field.maxLength) {
        errs[field.name] = `${fieldLabel(field)} must be at most ${field.maxLength} characters`
        ok = false
      }
      if (field.type === 'number' && value !== '') {
        const number = Number(value)
        if (!Number.isNaN(number)) {
          if (field.min !== undefined && number < field.min) {
            errs[field.name] = `${fieldLabel(field)} must be at least ${field.min}`
            ok = false
          }
          if (field.max !== undefined && number > field.max) {
            errs[field.name] = `${fieldLabel(field)} must be at most ${field.max}`
            ok = false
          }
        }
      }
    }
    errors.value = errs
    return ok
  }

  function buildParams(): Record<string, unknown> {
    const params: Record<string, unknown> = {}
    for (const field of fields) {
      const value = values.value[field.name]
      if (value === '' || value === undefined) continue
      params[field.name] = field.type === 'number' ? Number(value) : value
    }
    return params
  }

  async function submit(): Promise<void> {
    if (busy.value) return
    if (!validate()) return
    busy.value = true
    try {
      const params = buildParams()
      const submitAction = findAction(cfg.value.actions, 'submit')
      if (submitAction) {
        await runAction(submitAction, { ...(props.context ?? {}), values: params })
      } else if (cfg.value.command) {
        const result = await sessionStore.executeCommand(cfg.value.command, params)
        if (result.status === 'SUCCESS') {
          toasts.push({ message: 'Saved', kind: 'success' })
          initValues()
        } else if (result.fieldErrors?.length) {
          // V1: map structured fieldErrors back to the form fields.
          const errs: Record<string, string> = {}
          for (const fe of result.fieldErrors) errs[fe.field] = fe.message
          errors.value = errs
        }
      }
    } finally {
      busy.value = false
    }
  }

  function reset(): void {
    const next: Record<string, unknown> = {}
    const errs: Record<string, string> = {}
    for (const field of fields) {
      next[field.name] = defaultValue(field)
      errs[field.name] = ''
    }
    values.value = next
    errors.value = errs
  }

  function setValue(name: string, value: unknown): void {
    values.value = { ...values.value, [name]: value }
  }

  const layoutColumns = Math.max(1, Math.min(cfg.value.layout?.columns ?? 1, 4))
  const formStyle: Record<string, string> = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cq.value === 'sm' ? 1 : layoutColumns}, minmax(0, 1fr))`,
    gap: cfg.value.layout?.gap ?? 'var(--rt-space-sm)',
    alignItems: 'start'
  }

  return (
    <form
      ref={root}
      class={`ui-form ui-form--cq-${cq.value}${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      style={formStyle}
      onSubmit={(e) => { e.preventDefault(); submit() }}
    >
      {fields.map((field) => (
        <div
          key={field.name}
          class={`ui-form__field${field.type === 'textarea' || field.type === 'checkbox' ? ' ui-form__field--full' : ''}`}
        >
          {field.type !== 'checkbox' ? (
            <label htmlFor={`field-${field.name}`}>
              {fieldLabel(field)}
              {field.required ? <span class="ui-form__required"> *</span> : null}
            </label>
          ) : null}

          {field.type === 'text' || field.type === 'email' || field.type === 'password' ? (
            <input
              id={`field-${field.name}`}
              type={field.type}
              placeholder={field.placeholder}
              disabled={field.disabled}
              value={String(values.value[field.name] ?? '')}
              onInput={(e) => setValue(field.name, (e.target as HTMLInputElement).value)}
            />
          ) : null}
          {field.type === 'number' ? (
            <input
              id={`field-${field.name}`}
              type="number"
              placeholder={field.placeholder}
              disabled={field.disabled}
              value={String(values.value[field.name] ?? '')}
              onInput={(e) => setValue(field.name, (e.target as HTMLInputElement).value)}
            />
          ) : null}
          {field.type === 'textarea' ? (
            <textarea
              id={`field-${field.name}`}
              placeholder={field.placeholder}
              rows={field.rows ?? 3}
              disabled={field.disabled}
              value={String(values.value[field.name] ?? '')}
              onInput={(e) => setValue(field.name, (e.target as HTMLTextAreaElement).value)}
            />
          ) : null}
          {field.type === 'select' ? (
            <select
              id={`field-${field.name}`}
              disabled={field.disabled}
              value={String(values.value[field.name] ?? '')}
              onChange={(e) => setValue(field.name, (e.target as HTMLSelectElement).value)}
            >
              <option value="">—</option>
              {optionRows(field).map((option) => (
                <option key={String(option)} value={optionValue(field, option)}>
                  {optionLabel(field, option)}
                </option>
              ))}
            </select>
          ) : null}
          {field.type === 'checkbox' ? (
            <label class="ui-form__checkbox">
              <input
                id={`field-${field.name}`}
                type="checkbox"
                disabled={field.disabled}
                checked={Boolean(values.value[field.name])}
                onChange={(e) => setValue(field.name, (e.target as HTMLInputElement).checked)}
              />
              {fieldLabel(field)}
            </label>
          ) : null}

          {errors.value[field.name] ? <span class="ui-form__error">{errors.value[field.name]}</span> : null}
        </div>
      ))}

      <div class={`ui-form__actions${layoutColumns > 1 ? ' ui-form__actions--full' : ''}`}>
        <button class="ui-button ui-button--primary" type="submit" disabled={busy.value}>
          {busy.value ? t('core.button.loading') : (cfg.value.submitLabel || t('core.form.submit'))}
        </button>
        {cfg.value.showReset ? (
          <button type="button" class="ui-button" disabled={busy.value} onClick={reset}>
            {cfg.value.resetLabel ?? 'Reset'}
          </button>
        ) : null}
      </div>
    </form>
  )
}
