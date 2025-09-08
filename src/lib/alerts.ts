import Swal from "sweetalert2"

export interface AlertOptions {
  title?: string
  text?: string
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmButtonText?: string
  cancelButtonText?: string
  showCancelButton?: boolean
  timer?: number
}

class AlertService {
  static async success(options: AlertOptions = {}) {
    return Swal.fire({
      title: options.title || 'Success!',
      text: options.text,
      icon: 'success',
      confirmButtonText: options.confirmButtonText || 'OK',
      timer: options.timer,
      ...options
    })
  }

  static async error(options: AlertOptions = {}) {
    return Swal.fire({
      title: options.title || 'Error!',
      text: options.text,
      icon: 'error',
      confirmButtonText: options.confirmButtonText || 'OK',
      ...options
    })
  }

  static async warning(options: AlertOptions = {}) {
    return Swal.fire({
      title: options.title || 'Warning!',
      text: options.text,
      icon: 'warning',
      confirmButtonText: options.confirmButtonText || 'OK',
      ...options
    })
  }

  static async info(options: AlertOptions = {}) {
    return Swal.fire({
      title: options.title || 'Information',
      text: options.text,
      icon: 'info',
      confirmButtonText: options.confirmButtonText || 'OK',
      ...options
    })
  }

  static async confirm(options: AlertOptions = {}) {
    return Swal.fire({
      title: options.title || 'Are you sure?',
      text: options.text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Yes',
      cancelButtonText: options.cancelButtonText || 'No',
      ...options
    })
  }

  static async toast(options: AlertOptions = {}) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    return Toast.fire({
      icon: options.icon || 'success',
      title: options.title,
      ...options
    })
  }

  static async loading(title: string = 'Loading...') {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  static close() {
    Swal.close()
  }
}

export default AlertService