import { useCallback } from 'react'
import AlertService from '@/lib/alerts'

export const useAlerts = () => {
  const showSuccess = useCallback((options: Parameters<typeof AlertService.success>[0]) => {
    return AlertService.success(options)
  }, [])

  const showError = useCallback((options: Parameters<typeof AlertService.error>[0]) => {
    return AlertService.error(options)
  }, [])

  const showWarning = useCallback((options: Parameters<typeof AlertService.warning>[0]) => {
    return AlertService.warning(options)
  }, [])

  const showInfo = useCallback((options: Parameters<typeof AlertService.info>[0]) => {
    return AlertService.info(options)
  }, [])

  const showConfirm = useCallback((options: Parameters<typeof AlertService.confirm>[0]) => {
    return AlertService.confirm(options)
  }, [])

  const showToast = useCallback((options: Parameters<typeof AlertService.toast>[0]) => {
    return AlertService.toast(options)
  }, [])

  const showLoading = useCallback((title?: string) => {
    return AlertService.loading(title)
  }, [])

  const closeAlert = useCallback(() => {
    AlertService.close()
  }, [])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showToast,
    showLoading,
    closeAlert
  }
}