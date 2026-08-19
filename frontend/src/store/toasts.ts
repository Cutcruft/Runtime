import { ref } from 'vue'
import { globalSingleton } from '../utils/globalSingleton'

export interface ToastItem {
  id: number
  message: string
  kind: 'info' | 'success' | 'error'
}

interface ToastInput {
  message: string
  kind?: 'info' | 'success' | 'error'
}

const TOAST_TTL_MS = 4000
const { list, toastState } = globalSingleton('__cc_toast', () => ({
  list: ref<ToastItem[]>([]),
  toastState: { nextId: 1 }
}))

export const toasts = {
  get list(): ToastItem[] {
    return list.value
  },
  push(input: ToastInput): void {
    const id = toastState.nextId++
    list.value.push({ id, message: input.message, kind: input.kind ?? 'info' })
    window.setTimeout(() => {
      list.value = list.value.filter((item) => item.id !== id)
    }, TOAST_TTL_MS)
  },
  remove(id: number): void {
    list.value = list.value.filter((item) => item.id !== id)
  }
}
