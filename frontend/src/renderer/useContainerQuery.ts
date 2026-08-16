import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export type ContainerSize = 'sm' | 'md' | 'lg'

const SM_BREAKPOINT = 480
const MD_BREAKPOINT = 768

/**
 * Observes a root element and reports its width as a breakpoint size
 * (`sm` / `md` / `lg`). Bind to a template ref and use it as a class so the
 * component can switch to compact layouts when its container is narrow.
 */
export function useContainerQuery(el: Ref<HTMLElement | null>, onChange?: (size: ContainerSize) => void): Ref<ContainerSize> {
  const size = ref<ContainerSize>('lg')
  let observer: ResizeObserver | null = null

  function updateSize(width: number): void {
    const next: ContainerSize = width < SM_BREAKPOINT ? 'sm' : width < MD_BREAKPOINT ? 'md' : 'lg'
    if (next !== size.value) {
      size.value = next
      onChange?.(next)
    }
  }

  onMounted(() => {
    if (!el.value) return
    updateSize(el.value.getBoundingClientRect().width)
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) updateSize(entry.contentRect.width)
    })
    observer.observe(el.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return size
}
