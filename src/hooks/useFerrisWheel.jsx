import { useCallback } from 'react'
import { getPOIById } from '../data/poiData'

export function useFerrisWheel(setIsFollowingCart, setCurrentPOIInfo, cameraAnimationRef, handleNavigateToPOI, restartAnimationRef) {
  const handleEnterFerrisWheel = useCallback(() => {
    if (restartAnimationRef.current) {
      restartAnimationRef.current()
    }
    setIsFollowingCart(true)
  }, [restartAnimationRef, setIsFollowingCart])

  const handleExitWheel = useCallback(() => {
    setIsFollowingCart(false)
    const wheelData = getPOIById('wheel-cashier')
    
    const buttons = []
    if (wheelData.prevId) {
      buttons.push({ label: 'back', onClick: () => handleNavigateToPOI(wheelData.prevId) })
    }
    if (wheelData.nextId) {
      buttons.push({ label: wheelData.nextId === 'winterfest' ? 'end' : 'next', onClick: () => handleNavigateToPOI(wheelData.nextId) })
    }
    
    setCurrentPOIInfo({ 
      label: wheelData.label, 
      text: wheelData.text,
      image1: wheelData.image1,
      image2: wheelData.image2,
      buttons: buttons
    })
    if (cameraAnimationRef.current) {
      cameraAnimationRef.current(wheelData.position, wheelData.cameraPosition)
    }
  }, [setIsFollowingCart, setCurrentPOIInfo, cameraAnimationRef, handleNavigateToPOI])

  return {
    handleEnterFerrisWheel,
    handleExitWheel
  }
}
