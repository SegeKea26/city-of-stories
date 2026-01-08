import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export const useMouseDrag = (isFollowing) => {
  
  const isDragging = useRef(false)
  const cameraRotation = useRef({ x: 0, y: 0 })
  const euler = useRef(new THREE.Euler(0, 0, 'YXZ'))

  useEffect(() => {
    if (!isFollowing) return

    const handleMouseDown = () => {
      isDragging.current = true
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    const handleMouseMove = (event) => {
      if (!isDragging.current) return

      const deltaX = event.movementX || 0
      const deltaY = event.movementY || 0

      const sensitivity = 0.003

      cameraRotation.current.y -= deltaX * sensitivity
      cameraRotation.current.x -= deltaY * sensitivity

      cameraRotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.current.x))
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isFollowing])

  return { cameraRotation, euler }
}
