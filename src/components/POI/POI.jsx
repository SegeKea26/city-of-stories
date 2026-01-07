import { Html } from '@react-three/drei'
import './POI.css'

export function POI({ position, onClick }) {
  return (
    <group position={position}>
      <Html>
        <div className="poi" onClick={onClick}>
          <div className="poi__dot" />
        </div>
      </Html>
    </group>
  )
}
