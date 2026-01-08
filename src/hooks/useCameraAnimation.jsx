import gsap from 'gsap'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'

export const useCameraAnimation = (camera, onPOIEnter, cameraAnimationRef) => {
  const defaultPositionRef = useRef({ x: 0, y: 40, z: 80 })
  const orbitControlsRef = useRef()
  const functionsRef = useRef({})
  const poiLookAtRef = useRef(null)

  useEffect(() => {
    let animationFrameId
    
    const continueLookAt = () => {
      if (poiLookAtRef.current) {
        const [x, y, z] = poiLookAtRef.current
        const currentPos = camera.position.clone()
        const directionToTarget = new THREE.Vector3(
          x - currentPos.x,
          y - currentPos.y,
          z - currentPos.z
        ).normalize()
        
        camera.lookAt(
          currentPos.x + directionToTarget.x * 10,
          currentPos.y + directionToTarget.y * 10,
          currentPos.z + directionToTarget.z * 10
        )
      }
      animationFrameId = requestAnimationFrame(continueLookAt)
    }
    
    animationFrameId = requestAnimationFrame(continueLookAt)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [camera])

  useEffect(() => {
    functionsRef.current.animateCameraToPosition = (targetPosition) => {
      onPOIEnter(true)
      poiLookAtRef.current = targetPosition

      const cameraOffset = [0, 0, 2]
      const cameraPosition = [
        targetPosition[0] + cameraOffset[0],
        targetPosition[1] + cameraOffset[1],
        targetPosition[2] + cameraOffset[2]
      ]

      const startPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }

      gsap.to(startPosition, {
        x: cameraPosition[0],
        y: cameraPosition[1],
        z: cameraPosition[2],
        duration: 3,
        ease: 'power1.inOut',
        onUpdate: () => {
          camera.position.set(startPosition.x, startPosition.y, startPosition.z)
        }
      })

      if (orbitControlsRef.current) {
        gsap.to(orbitControlsRef.current.target, {
          x: targetPosition[0],
          y: targetPosition[1],
          z: targetPosition[2],
          duration: 3,
          ease: 'power1.inOut'
        })
      }
    }

    functionsRef.current.animateToDefault = () => {
      onPOIEnter(false)
      poiLookAtRef.current = null

      const startPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }

      gsap.to(startPosition, {
        x: defaultPositionRef.current.x,
        y: defaultPositionRef.current.y,
        z: defaultPositionRef.current.z,
        duration: 3,
        ease: 'power1.inOut',
        onUpdate: () => {
          camera.position.set(startPosition.x, startPosition.y, startPosition.z)
        }
      })

      if (orbitControlsRef.current) {
        gsap.to(orbitControlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 3,
          ease: 'power1.inOut'
        })
      }
    }

    cameraAnimationRef.current = functionsRef.current.animateCameraToPosition
    cameraAnimationRef.current.goBack = functionsRef.current.animateToDefault
  }, [camera, onPOIEnter, cameraAnimationRef])

  return { orbitControlsRef, defaultPositionRef }
}
