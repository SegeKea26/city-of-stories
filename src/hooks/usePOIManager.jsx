import { useState } from 'react'

export const usePOIManager = () => {
  const [isViewingPOI, setIsViewingPOI] = useState(false)
  const [isTourMode, setIsTourMode] = useState(false)
  const [isFollowingCart, setIsFollowingCart] = useState(false)
  const [currentPOIInfo, setCurrentPOIInfo] = useState({ label: '', text: '' })
  const [canvasClicked, setCanvasClicked] = useState(false)

  return {
    isViewingPOI,
    setIsViewingPOI,
    isTourMode,
    setIsTourMode,
    isFollowingCart,
    setIsFollowingCart,
    currentPOIInfo,
    setCurrentPOIInfo,
    canvasClicked,
    setCanvasClicked
  }
}
