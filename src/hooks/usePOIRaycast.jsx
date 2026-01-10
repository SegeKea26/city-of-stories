import { useRef, useEffect, useState } from 'react'

export const usePOIRaycast = (isViewingPOI, cameraMode, onHoveredPOIChange) => {
  const [hoveredPOI, setHoveredPOI] = useState(null)
  const prevHoveredRef = useRef(null)
  const poiCacheRef = useRef([])
  const debounceTimerRef = useRef(null)

  useEffect(() => {
    if (!isViewingPOI || cameraMode !== 'viewer') {
      if (prevHoveredRef.current !== null) {
        prevHoveredRef.current = null
        if (onHoveredPOIChange) {
          onHoveredPOIChange(null)
        }
      }
      poiCacheRef.current = []
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      return
    }

    const updateHoverState = () => {
      const centerScreenX = window.innerWidth / 2
      const centerScreenY = window.innerHeight / 2

      let closestLabel = null

      const poiDots = document.querySelectorAll('.poi__dot')

      poiDots.forEach((dot) => {
        const rect = dot.getBoundingClientRect()
        const dotCenterX = rect.left + rect.width / 2
        const dotCenterY = rect.top + rect.height / 2

        const distance = Math.sqrt(
          Math.pow(dotCenterX - centerScreenX, 2) + Math.pow(dotCenterY - centerScreenY, 2)
        )

        if (distance < 10) {
          closestLabel = dot.getAttribute('data-poi-label') || null
        }
      })

      if (prevHoveredRef.current !== closestLabel) {
        prevHoveredRef.current = closestLabel
        setHoveredPOI(closestLabel)
        if (onHoveredPOIChange) {
          onHoveredPOIChange(closestLabel)
        }
      }
    }

    const handleMouseMove = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        updateHoverState()
      }, 30)
    }

    document.addEventListener('mousemove', handleMouseMove)

    const handleClick = () => {
      if (!isViewingPOI || cameraMode !== 'viewer') return

      const centerScreenX = window.innerWidth / 2
      const centerScreenY = window.innerHeight / 2

      const elementAtCenter = document.elementFromPoint(centerScreenX, centerScreenY)
      const poiElement = elementAtCenter?.closest('.poi')

      if (poiElement) {
        const poiDot = poiElement.querySelector('.poi__dot')
        if (poiDot) {
          poiDot.click()
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      poiCacheRef.current = []
    }
  }, [isViewingPOI, cameraMode, onHoveredPOIChange])

  return hoveredPOI
}