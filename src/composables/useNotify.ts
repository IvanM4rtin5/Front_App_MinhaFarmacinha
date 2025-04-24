import { Notify } from 'quasar'

export function useNotify() {
  const success = (message: string) => {
    Notify.create({
      type: 'positive',
      message,
      position: 'top-right',
      color: 'positive',
      textColor: 'white',
      icon: 'done',
      timeout: 3000
    })
  }

  const error = (message: string) => {
    Notify.create({
      type: 'negative',
      message,
      position: 'top-right',
      color: 'negative',
      textColor: 'white',
      icon: 'warning',
      timeout: 3000
    })
  }

  const warning = (message: string) => {
    Notify.create({
      type: 'warning',
      message,
      position: 'top-right',
      color: 'warning',
      textColor: 'white',
      icon: 'warning',
      timeout: 3000
    })
  }

  const info = (message: string) => {
    Notify.create({
      type: 'info',
      message,
      position: 'top-right',
      color: 'info',
      textColor: 'white',
      icon: 'info',
      timeout: 3000
    })
  }

  return { success, error, warning, info }
}
