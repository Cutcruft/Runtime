<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { sessionStore } from '../store/session'
import { toasts } from '../store/toasts'
import { i18nStore } from '../store/i18n'
import { useCfg } from '../renderer/useConfig'
import { findAction, runAction } from '../renderer/bindingEngine'
import type { BindingContext, FormFieldConfig, FormConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const t = i18nStore.t

const cfg = useCfg<FormConfig>(props.config, { submitLabel: '', fields: [], layout: {} })

const fields = computed(() => cfg.value.fields ?? [])

const values = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string>>({})
const optionsCache = reactive<Record<string, Array<Record<string, unknown>>>>({})
const busy = ref(false)

function defaultValue(field: FormFieldConfig): string | number | boolean {
  if (field.defaultValue !== undefined) return field.defaultValue
  return field.type === 'checkbox' ? false : ''
}

function resetValues(): void {
  for (const field of fields.value) {
    values[field.name] = defaultValue(field)
    errors[field.name] = ''
  }
}

resetValues()

watch(fields, (list) => {
  for (const field of list) {
    if (!(field.name in values)) {
      values[field.name] = defaultValue(field)
    }
  }
})

async function loadOptions(field: FormFieldConfig): Promise<void> {
  if (!field.options || optionsCache[field.name]) return
  try {
    const result = await sessionStore.execute(field.options.command, field.options.params ?? {})
    if (result.status === 'SUCCESS' && Array.isArray(result.value)) {
      optionsCache[field.name] = result.value as Array<Record<string, unknown>>
    }
  } catch {
    /* options are optional — leave empty */
  }
}

onMounted(() => {
  fields.value.filter((field) => field.options).forEach((field) => loadOptions(field))
})

function optionRows(field: FormFieldConfig): Array<Record<string, unknown>> {
  return field.options ? optionsCache[field.name] ?? [] : []
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
  for (const field of fields.value) {
    const value = values[field.name]
    const text = String(value ?? '').trim()
    errors[field.name] = ''
    if (field.required && (value === '' || value === false || value === undefined)) {
      errors[field.name] = `${fieldLabel(field)} is required`
      ok = false
      continue
    }
    if (field.type !== 'checkbox' && field.minLength !== undefined && text.length < field.minLength) {
      errors[field.name] = `${fieldLabel(field)} must be at least ${field.minLength} characters`
      ok = false
    } else if (field.type !== 'checkbox' && field.maxLength !== undefined && text.length > field.maxLength) {
      errors[field.name] = `${fieldLabel(field)} must be at most ${field.maxLength} characters`
      ok = false
    }
    if (field.type === 'number' && value !== '') {
      const number = Number(value)
      if (!Number.isNaN(number)) {
        if (field.min !== undefined && number < field.min) {
          errors[field.name] = `${fieldLabel(field)} must be at least ${field.min}`
          ok = false
        }
        if (field.max !== undefined && number > field.max) {
          errors[field.name] = `${fieldLabel(field)} must be at most ${field.max}`
          ok = false
        }
      }
    }
  }
  return ok
}

function buildParams(): Record<string, unknown> {
  const params: Record<string, unknown> = {}
  for (const field of fields.value) {
    const value = values[field.name]
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
        resetValues()
      }
    }
  } finally {
    busy.value = false
  }
}

function reset(): void {
  resetValues()
}

const layoutColumns = computed(() => Math.max(1, Math.min(cfg.value.layout?.columns ?? 1, 4)))
const formStyle = computed(() => ({
  gridTemplateColumns: `repeat(${layoutColumns.value}, minmax(0, 1fr))`,
  gap: cfg.value.layout?.gap ?? 'var(--rt-space-sm)'
}))
</script>

<template>
  <form class="ui-form" :class="cfg.className" :style="formStyle" @submit.prevent="submit">
    <div
      v-for="field in fields"
      :key="field.name"
      class="ui-form__field"
      :class="{ 'ui-form__field--full': field.type === 'textarea' || field.type === 'checkbox' }"
    >
      <label v-if="field.type !== 'checkbox'" :for="`field-${field.name}`">
        {{ fieldLabel(field) }}<span v-if="field.required" class="ui-form__required"> *</span>
      </label>
      <input
        v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
        :id="`field-${field.name}`"
        v-model="values[field.name]"
        :type="field.type"
        :placeholder="field.placeholder"
        :disabled="field.disabled"
      />
      <input
        v-else-if="field.type === 'number'"
        :id="`field-${field.name}`"
        v-model.number="values[field.name]"
        type="number"
        :placeholder="field.placeholder"
        :disabled="field.disabled"
      />
      <textarea
        v-else-if="field.type === 'textarea'"
        :id="`field-${field.name}`"
        v-model="values[field.name]"
        :placeholder="field.placeholder"
        :rows="field.rows ?? 3"
        :disabled="field.disabled"
      />
      <select
        v-else-if="field.type === 'select'"
        :id="`field-${field.name}`"
        v-model="values[field.name]"
        :disabled="field.disabled"
      >
        <option value="">—</option>
        <option
          v-for="option in optionRows(field)"
          :key="String(option)"
          :value="optionValue(field, option)"
        >
          {{ optionLabel(field, option) }}
        </option>
      </select>
      <label v-else-if="field.type === 'checkbox'" class="ui-form__checkbox">
        <input
          :id="`field-${field.name}`"
          v-model="values[field.name]"
          type="checkbox"
          :disabled="field.disabled"
        />
        {{ fieldLabel(field) }}
      </label>
      <span v-if="errors[field.name]" class="ui-form__error">{{ errors[field.name] }}</span>
    </div>
    <div class="ui-form__actions" :class="{ 'ui-form__actions--full': layoutColumns > 1 }">
      <button class="ui-button ui-button--primary" type="submit" :disabled="busy">
        {{ busy ? t('core.button.loading') : (cfg.submitLabel || t('core.form.submit')) }}
      </button>
      <button
        v-if="cfg.showReset"
        type="button"
        class="ui-button"
        :disabled="busy"
        @click="reset"
      >
        {{ cfg.resetLabel ?? 'Reset' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.ui-form {
  display: grid;
  align-items: start;
}
.ui-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.ui-form__field--full {
  grid-column: 1 / -1;
}
.ui-form__field label {
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
}
.ui-form__field input,
.ui-form__field select,
.ui-form__field textarea {
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
  font: inherit;
  font-size: var(--rt-font-size);
}
.ui-form__field textarea {
  resize: vertical;
}
.ui-form__field input:focus,
.ui-form__field select:focus,
.ui-form__field textarea:focus {
  outline: 2px solid var(--rt-color-primary);
  outline-offset: -1px;
}
.ui-form__required {
  color: var(--rt-color-danger);
}
.ui-form__error {
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-danger);
}
.ui-form__checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}
.ui-form__actions {
  display: flex;
  gap: var(--rt-space-sm);
  align-items: center;
}
.ui-form__actions--full {
  grid-column: 1 / -1;
}
</style>
