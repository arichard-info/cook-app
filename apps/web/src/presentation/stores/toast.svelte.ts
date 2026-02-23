export interface ToastPayload {
  type: 'success' | 'error'
  message: string
  linkHref?: string
  linkLabel?: string
}

interface ToastState extends ToastPayload {
  id: number
}

let counter = 0
let toasts = $state<ToastState[]>([])

export const getToasts = () => toasts

export const showToast = (payload: ToastPayload, duration = 4000) => {
  const id = ++counter
  toasts = [...toasts, { ...payload, id }]
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
  }, duration)
}
