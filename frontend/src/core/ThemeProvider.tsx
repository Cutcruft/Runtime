import { useEffect } from 'preact/hooks'
import { themeStore, applyTheme } from '../store/theme'
import type { ComponentChildren } from 'preact'

interface ThemeProviderProps {
  children?: ComponentChildren
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    themeStore.init()
  }, [])

  // Re-apply theme when the document is ready (for SSR-like scenarios)
  if (document.readyState === 'complete') {
    applyTheme()
  }

  return <>{children}</>
}
