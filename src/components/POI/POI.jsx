import { Html } from '@react-three/drei'
import { useState } from 'react'
import './POI.css'

export function POI({ position, onClick, label }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <group position={position}>
      <Html>
        <div 
          className="poi" 
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && <div className="poi__label">{label}</div>}
          <div className="poi__dot" />
        </div>
      </Html>
    </group>
  )
}
