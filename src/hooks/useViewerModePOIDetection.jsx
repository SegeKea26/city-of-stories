import { useEffect, useRef } from 'react'

export const useViewerModePOIDetection = (cameraMode, isViewingPOI) => {
  const hoveredPOIRef = useRef(null)

  useEffect(() => {
    if (cameraMode !== 'viewer' || !isViewingPOI) return

    const detectPOIAtCenter = () => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      const elementAtCenter = document.elementFromPoint(centerX, centerY)
      
      const poiAtCenter = elementAtCenter?.closest('.poi')

      if (poiAtCenter !== hoveredPOIRef.current) {
        if (hoveredPOIRef.current) {
          hoveredPOIRef.current.classList.remove('poi--hovered')
          const label = hoveredPOIRef.current.getAttribute('data-poi-label')
          window.dispatchEvent(new CustomEvent('poi-hover-end', { detail: { label } }))
        }
        
        if (poiAtCenter) {
          poiAtCenter.classList.add('poi--hovered')
          hoveredPOIRef.current = poiAtCenter
          const label = poiAtCenter.getAttribute('data-poi-label')
          window.dispatchEvent(new CustomEvent('poi-hover-start', { detail: { label } }))
        } else {
          hoveredPOIRef.current = null
        }
      }
    }

    const animationFrameId = setInterval(detectPOIAtCenter, 50)

    const handleClick = () => {
      if (hoveredPOIRef.current) {
        hoveredPOIRef.current.click()
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      clearInterval(animationFrameId)
      document.removeEventListener('click', handleClick)
      if (hoveredPOIRef.current) {
        hoveredPOIRef.current.classList.remove('poi--hovered')
      }
    }
  }, [cameraMode, isViewingPOI])
}
