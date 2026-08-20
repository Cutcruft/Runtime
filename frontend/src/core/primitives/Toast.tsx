import { toasts } from '../../store/toasts'
import * as styles from './styles.css'

// NOTE: Full signal reactivity will be wired in M3 when stores migrate to @preact/signals.

export function ToastViewport() {
  const list = toasts.list
  return (
    <div class={styles.toastViewport}>
      {list.map((toast) => (
        <div
          key={toast.id}
          class={`${styles.toast} ${toast.kind === 'error' ? styles.toastError : toast.kind === 'success' ? styles.toastSuccess : ''}`}
          onClick={() => toasts.remove(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
