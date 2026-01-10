import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export const useMouseDrag = (isFollowing, cameraMode = 'grab') => {
  const cameraRotation = useRef({ x: 0, y: 0 })
  const euler = useRef(new THREE.Euler(0, 0, 'YXZ'))
  const isDragging = useRef(false)
  const isPointerLockedRef = useRef(false)
  const shouldMaintainLockRef = useRef(false)

  useEffect(() => {
    if (!isFollowing) {
      if (document.pointerLockElement) {
        document.exitPointerLock()
      }
      isPointerLockedRef.current = false
      return
    }

    const canvas = document.querySelector('canvas')
    if (!canvas) return

    if (cameraMode === 'viewer') {
      canvas.style.cursor = 'none'
      document.body.style.cursor = 'none'
      document.documentElement.style.cursor = 'none'

      shouldMaintainLockRef.current = true

      const requestPointerLock = () => {
        const lockFunc = canvas.requestPointerLock || canvas.mozRequestPointerLock
        if (lockFunc && !document.pointerLockElement) {
          try {
            lockFunc.call(canvas)
          } catch (e) {
            console.error('Error requesting pointer lock:', e)
          }
        }
      }

      const handleMouseMove = (event) => {
        const deltaX = event.movementX || 0
        const deltaY = event.movementY || 0

        cameraRotation.current.y -= deltaX * 0.003
        cameraRotation.current.x -= deltaY * 0.003

        cameraRotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.current.x))
      }

      const handleCanvasClick = () => {
        requestPointerLock()
      }

      const handlePointerLockChange = () => {
        isPointerLockedRef.current = !!document.pointerLockElement
        if (!isPointerLockedRef.current && shouldMaintainLockRef.current) {
          requestPointerLock()
        }
      }

      const handlePointerLockError = () => {
        setTimeout(() => {
          if (shouldMaintainLockRef.current && !document.pointerLockElement) {
            requestPointerLock()
          }
        }, 500)
      }

      requestPointerLock()

      canvas.addEventListener('click', handleCanvasClick)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('pointerlockchange', handlePointerLockChange)
      document.addEventListener('mozpointerlockchange', handlePointerLockChange)
      document.addEventListener('pointerlockerror', handlePointerLockError)
      document.addEventListener('mozpointerlockerror', handlePointerLockError)

      return () => {
        canvas.removeEventListener('click', handleCanvasClick)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('pointerlockchange', handlePointerLockChange)
        document.removeEventListener('mozpointerlockchange', handlePointerLockChange)
        document.removeEventListener('pointerlockerror', handlePointerLockError)
        document.removeEventListener('mozpointerlockerror', handlePointerLockError)
        
        if (canvas) {
          canvas.style.cursor = 'auto'
        }
        document.body.style.cursor = 'auto'
        document.documentElement.style.cursor = 'auto'
        
        if (document.pointerLockElement) {
          document.exitPointerLock()
        }
        shouldMaintainLockRef.current = false
        isPointerLockedRef.current = false
      }
    } else {
      canvas.style.cursor = 'auto'
      if (document.pointerLockElement) {
        document.exitPointerLock()
      }

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
    }
  }, [isFollowing, cameraMode])

  return { cameraRotation, euler }
}
