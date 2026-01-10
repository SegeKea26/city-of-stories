import { useEffect } from 'react'

export function useCameraModeSwitcher(isViewingPOI, isTourMode, setCameraMode, isFollowingCart) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'v') {
        if ((isViewingPOI && !isTourMode) || isFollowingCart) {
          setCameraMode(prev => prev === 'grab' ? 'viewer' : 'grab')
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isViewingPOI, isTourMode, setCameraMode, isFollowingCart])
}
