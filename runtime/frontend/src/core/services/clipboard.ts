import { toasts } from '../../store/toasts'

/**
 * Clipboard API for plugins.
 * Wraps the Clipboard API with fallbacks and toast notifications.
 */

export interface ClipboardApi {
  /** Read text from clipboard */
  readText(): Promise<string>
  /** Write text to clipboard */
  writeText(text: string): Promise<void>
  /** Read structured data (JSON) from clipboard */
  readJSON<T = unknown>(): Promise<T | null>
  /** Write structured data (JSON) to clipboard */
  writeJSON(data: unknown): Promise<void>
}

async function fallbackRead(): Promise<string> {
  try {
    const text = await navigator.clipboard.readText()
    return text
  } catch {
    // Fallback: create a temporary textarea
    const ta = document.createElement('textarea')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok ? ta.value : ''
  }
}

export const clipboardApi: ClipboardApi = {
  async readText(): Promise<string> {
    try {
      return await navigator.clipboard.readText()
    } catch {
      return fallbackRead()
    }
  },

  async writeText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
      toasts.push({ message: 'Copied to clipboard', kind: 'success' })
    } catch {
      // Fallback: textarea + execCommand
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      toasts.push({ message: 'Copied to clipboard', kind: 'success' })
    }
  },

  async readJSON<T = unknown>(): Promise<T | null> {
    const text = await this.readText()
    if (!text) return null
    try {
      return JSON.parse(text) as T
    } catch {
      return null
    }
  },

  async writeJSON(data: unknown): Promise<void> {
    await this.writeText(JSON.stringify(data, null, 2))
  }
}
