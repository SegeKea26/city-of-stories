import { Html } from '@react-three/drei'
import { useState, useEffect } from 'react'
import './POI.css'

export function POI({ position, onClick, label, number }) {
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleHoverStart = (event) => {
      if (event.detail.label === label) {
        setIsHovered(true)
      }
    }

    const handleHoverEnd = (event) => {
      if (event.detail.label === label) {
        setIsHovered(false)
      }
    }

    window.addEventListener('poi-hover-start', handleHoverStart)
    window.addEventListener('poi-hover-end', handleHoverEnd)

    return () => {
      window.removeEventListener('poi-hover-start', handleHoverStart)
      window.removeEventListener('poi-hover-end', handleHoverEnd)
    }
  }, [label])

  return (
    <group position={position}>
      <Html>
        <div 
          className="poi"
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-poi-label={label}
        >
          {isHovered && <div className="poi__label">{label}</div>}
          <div className="poi__dot" data-poi-label={label}>
            {number && <span className="poi__number">{number}</span>}
          </div>
        </div>
      </Html>
    </group>
  )
}
