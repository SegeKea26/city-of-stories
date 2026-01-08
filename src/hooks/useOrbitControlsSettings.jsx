import { useEffect } from 'react'

export const useOrbitControlsSettings = (orbitControlsRef, isViewingPOI, isFollowingCart) => {
  useEffect(() => {
    if (orbitControlsRef.current) {
      if (isFollowingCart) {
        orbitControlsRef.current.enabled = false
      } else if (isViewingPOI) {
        orbitControlsRef.current.enabled = false
      } else {
        orbitControlsRef.current.enabled = true
        orbitControlsRef.current.minPolarAngle = Math.PI / 2.5
        orbitControlsRef.current.maxPolarAngle = Math.PI / 2.5
      }
    }
  }, [isViewingPOI, isFollowingCart, orbitControlsRef])
}
