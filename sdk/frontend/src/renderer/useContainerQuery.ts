import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'

export type ContainerSize = 'sm' | 'md' | 'lg'

const SM_BREAKPOINT = 480
const MD_BREAKPOINT = 768

/**
 * Observes a root element and reports its width as a breakpoint size
 * (`sm` / `md` / `lg`). Returns a signal that updates on resize.
 */
export function useContainerQuery(el: { value: HTMLElement | null }, onChange?: (size: ContainerSize) => void) {
  const size = useSignal<ContainerSize>('lg')

  useEffect(() => {
    const element = el.value
    if (!element) return

    function updateSize(width: number): void {
      const next: ContainerSize = width < SM_BREAKPOINT ? 'sm' : width < MD_BREAKPOINT ? 'md' : 'lg'
      if (next !== size.value) {
        size.value = next
        onChange?.(next)
      }
    }

    updateSize(element.getBoundingClientRect().width)
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) updateSize(entry.contentRect.width)
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return size
}
