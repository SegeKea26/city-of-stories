import { useState, useEffect } from 'react'

export function useNotification(isViewingPOI, isTourMode) {
  const [notificationDismissed, setNotificationDismissed] = useState(true)

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'v' && isViewingPOI && !isTourMode) {
        setNotificationDismissed(true)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isViewingPOI, isTourMode])

  useEffect(() => {
    if (isViewingPOI && !isTourMode) {
      const timer = setTimeout(() => setNotificationDismissed(false), 0)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setNotificationDismissed(true), 0)
      return () => clearTimeout(timer)
    }
  }, [isViewingPOI, isTourMode])

  return { notificationDismissed, setNotificationDismissed }
}
