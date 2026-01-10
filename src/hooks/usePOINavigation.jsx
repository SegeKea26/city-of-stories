import { useCallback, useRef, useEffect } from 'react'
import { getPOIById } from '../data/poiData'

export function usePOINavigation(cameraAnimationRef, setCurrentPOIInfo, setIsViewingPOI, setIsTourMode, setIsFollowingCart, onAnimationStart) {
  const handleBackToWinterfest = useCallback(() => {
    if (cameraAnimationRef.current?.goBack) {
      cameraAnimationRef.current.goBack()
    }
    setIsViewingPOI(false)
    setIsTourMode(false)
    setIsFollowingCart(false)
    setCurrentPOIInfo({ label: '', text: '' })
  }, [cameraAnimationRef, setCurrentPOIInfo, setIsViewingPOI, setIsTourMode, setIsFollowingCart])

  const handleNavigateToPOIRef = useRef(null)

  const handleNavigateToPOI = useCallback((poiId) => {
    if (poiId === 'winterfest') {
      handleBackToWinterfest()
      return
    }

    const poi = getPOIById(poiId)
    if (!poi) return

    const buttons = []
    if (poi.prevId) {
      buttons.push({ label: poi.prevId === 'winterfest' ? 'back' : 'back', onClick: () => handleNavigateToPOIRef.current(poi.prevId) })
    }
    if (poi.nextId) {
      buttons.push({ label: poi.nextId === 'winterfest' ? 'end' : 'next', onClick: () => handleNavigateToPOIRef.current(poi.nextId) })
    }

    setCurrentPOIInfo({ 
      label: poi.label, 
      text: poi.text,
      image1: poi.image1,
      image2: poi.image2,
      buttons: buttons
    })
    if (cameraAnimationRef.current) {
      if (onAnimationStart) onAnimationStart()
      cameraAnimationRef.current(poi.position, poi.cameraPosition)
    }
  }, [cameraAnimationRef, setCurrentPOIInfo, handleBackToWinterfest, onAnimationStart])

  useEffect(() => {
    handleNavigateToPOIRef.current = handleNavigateToPOI
  }, [handleNavigateToPOI])

  return {
    handleNavigateToPOI,
    handleBackToWinterfest
  }
}

