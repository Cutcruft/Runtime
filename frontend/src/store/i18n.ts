import { signal, computed } from '@preact/signals'
import type { I18nConfiguration } from '../protocol/types'
import { globalSingleton } from '../utils/globalSingleton'

interface I18nState {
  config: I18nConfiguration | null
  locale: string
}

const LOCALE_KEY = 'rt.locale'
/** Matches a `{{demo.page.title}}` placeholder inside a config string. */
const PLACEHOLDER = /\{\{\s*([^{}\s]+)\s*\}\}/g

function resolveInitialLocale(config: I18nConfiguration | null): string {
  if (!config) return 'en'
  const stored = localStorage.getItem(LOCALE_KEY)
  if (stored && config.locales.includes(stored)) return stored
  const browser = navigator.language?.split('-')[0]
  if (browser && config.locales.includes(browser)) return browser
  return config.defaultLocale
}

const state = globalSingleton('__cc_i18n', () => signal<I18nState>({
  config: null,
  locale: 'en'
}))

function interpolate(text: string, params?: Record<string, unknown>): string {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key]
    return value === undefined || value === null ? match : String(value)
  })
}

/** Selects `_one`/`_many` variant based on {count} param when the key suffix exists. */
function pluralize(key: string, params?: Record<string, unknown>): string {
  const count = typeof params?.count === 'number' ? params.count : undefined
  if (count !== undefined) {
    const variant = count === 1 ? `${key}_one` : `${key}_many`
    if (hasKey(variant)) return variant
  }
  return key
}

function hasKey(key: string): boolean {
  const dict = state.value.config?.messages[state.value.locale] ?? state.value.config?.messages[state.value.config.defaultLocale]
  return dict != null && key in dict
}

/** Translation helper: `t('core.table.search')` or `t('demo.hello', { name })`. */
function t(key: string, params?: Record<string, unknown>): string {
  const dict = state.value.config?.messages[state.value.locale] ?? state.value.config?.messages[state.value.config.defaultLocale] ?? {}
  const resolved = pluralize(key, params)
  return interpolate(dict[resolved] ?? key, params)
}

/** Resolves a display string: every `{{key}}` placeholder is translated, the rest passes through. */
function tr(value: string, params?: Record<string, unknown>): string {
  if (!value.includes('{{')) return value
  return value.replace(PLACEHOLDER, (_match, key: string) => t(key, params))
}

/** Deep-translates config values: every string is scanned for `{{key}}` placeholders. */
function deepTranslate<T>(value: T): T {
  if (typeof value === 'string') {
    return tr(value) as unknown as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepTranslate(item)) as unknown as T
  }
  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(source)) result[key] = deepTranslate(source[key])
    return result as T
  }
  return value
}

/** All keys available in the current locale (or a fallback locale). */
function translateFor(locale: string, key: string, params?: Record<string, unknown>): string {
  const dict = state.value.config?.messages[locale] ?? {}
  const resolved = params && typeof params.count === 'number'
    ? `${key}_${(params.count as number) === 1 ? 'one' : 'many'}`
    : key
  return interpolate(dict[resolved] ?? dict[key] ?? key, params)
}

export const i18nStore = {
  get loaded(): boolean {
    return state.value.config !== null
  },
  get defaultLocale(): string {
    return state.value.config?.defaultLocale ?? 'en'
  },
  get locales(): string[] {
    return state.value.config?.locales ?? ['en']
  },
  get locale(): string {
    return state.value.locale
  },
  t,
  tr,
  deepTranslate,
  /** Initializes from workspace config, respecting stored/browser locale. */
  init(config: I18nConfiguration | null): void {
    state.value = { ...state.value, config, locale: resolveInitialLocale(config) }
  },
  setLocale(locale: string): void {
    if (!state.value.config || !state.value.config.locales.includes(locale)) return
    state.value = { ...state.value, locale }
    localStorage.setItem(LOCALE_KEY, locale)
  },
  /** Available locales other than the current one (for a switcher). */
  otherLocales: computed(() => state.value.config?.locales.filter((l) => l !== state.value.locale) ?? []),
  translateFor
}

export function useI18n() {
  return {
    t: (key: string, params?: Record<string, unknown>) => i18nStore.t(key, params),
    locale: computed(() => i18nStore.locale),
    locales: computed(() => i18nStore.locales),
    setLocale: (locale: string) => i18nStore.setLocale(locale)
  }
}
