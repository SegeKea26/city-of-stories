import { useState } from 'react'

export function useWheelNotification() {
  const [wheelNotificationDismissed, setWheelNotificationDismissed] = useState(false)

  return { wheelNotificationDismissed, setWheelNotificationDismissed }
}
