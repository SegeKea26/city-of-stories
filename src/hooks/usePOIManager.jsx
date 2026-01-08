import { useState } from 'react'

export const usePOIManager = () => {
  const [isViewingPOI, setIsViewingPOI] = useState(false)
  const [isFollowingCart, setIsFollowingCart] = useState(false)
  const [showWheelCashierNotification, setShowWheelCashierNotification] = useState(false)
  const [currentPOIInfo, setCurrentPOIInfo] = useState({ label: '', text: '' })

  return {
    isViewingPOI,
    setIsViewingPOI,
    isFollowingCart,
    setIsFollowingCart,
    showWheelCashierNotification,
    setShowWheelCashierNotification,
    currentPOIInfo,
    setCurrentPOIInfo
  }
}
