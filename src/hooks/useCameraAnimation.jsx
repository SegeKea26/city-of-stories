import gsap from 'gsap'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'

const CAMERA_MOVE_DURATION = 4
const RETURN_TO_DEFAULT_DURATION = 3
const LOOK_AROUND_DURATION = 5
const VIEWING_DISTANCE = 3.5
const HORIZONTAL_LOOK_RANGE = 2
const VERTICAL_LOOK_RANGE = 1.5

export const useCameraAnimation = (camera, onPOIEnter, cameraAnimationRef, onAnimationComplete) => {
  const defaultPositionRef = useRef({ x: 0, y: 40, z: 80 })
  const orbitControlsRef = useRef()
  const lookAroundTimelineRef = useRef(null)

  useEffect(() => {
    const stopLookAround = () => {
      if (lookAroundTimelineRef.current) {
        lookAroundTimelineRef.current.kill()
        lookAroundTimelineRef.current = null
      }
      gsap.killTweensOf({ angle: 0 })
      gsap.killTweensOf({ vertical: 0 })
    }

    const calculateCameraPosition = (targetPosition) => {
      const direction = new THREE.Vector3(
        camera.position.x - targetPosition[0],
        camera.position.y - targetPosition[1],
        camera.position.z - targetPosition[2]
      )

      direction.normalize().multiplyScalar(VIEWING_DISTANCE)
      
      return [
        targetPosition[0] + direction.x,
        targetPosition[1] + direction.y,
        targetPosition[2] + direction.z
      ]
    }

    const animateCameraToPOI = (targetPosition, customCameraPosition) => {
      onPOIEnter(true)
      stopLookAround()

      const finalCameraPosition = customCameraPosition || calculateCameraPosition(targetPosition)

      const cameraPos = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }
      
      gsap.to(cameraPos, {
        x: finalCameraPosition[0],
        y: finalCameraPosition[1],
        z: finalCameraPosition[2],
        duration: CAMERA_MOVE_DURATION,
        ease: 'power1.inOut',
        onUpdate: () => {
          camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
          camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2])
        },
        onComplete: () => {
          camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2])
          startLookAroundAnimation(targetPosition)
        }
      })

      if (orbitControlsRef.current) {
        gsap.to(orbitControlsRef.current.target, {
          x: targetPosition[0],
          y: targetPosition[1],
          z: targetPosition[2],
          duration: CAMERA_MOVE_DURATION,
          ease: 'power1.inOut'
        })
      }
    }

    const updateCameraLook = (targetPosition, axis, offset) => {
      if (axis === 'z') {
        camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2] - offset * HORIZONTAL_LOOK_RANGE)
      } else if (axis === 'x') {
        camera.lookAt(targetPosition[0] - offset * HORIZONTAL_LOOK_RANGE, targetPosition[1], targetPosition[2])
      } else if (axis === 'y') {
        camera.lookAt(targetPosition[0], targetPosition[1] + offset * VERTICAL_LOOK_RANGE, targetPosition[2])
      }
    }

    const startLookAroundAnimation = (targetPosition) => {
      
      const distanceX = Math.abs(camera.position.x - targetPosition[0])
      const distanceZ = Math.abs(camera.position.z - targetPosition[2])
      const horizontalAxis = distanceX > distanceZ ? 'z' : 'x'
      
      if (onAnimationComplete) {
        onAnimationComplete()
      }
      
      const timeline = gsap.timeline({ repeat: -1 })
      lookAroundTimelineRef.current = timeline
      
      timeline
        .to({ angle: 0 }, {
          angle: 1,
          duration: LOOK_AROUND_DURATION,
          ease: 'sine.inOut',
          onUpdate: function() {
            updateCameraLook(targetPosition, horizontalAxis, this.targets()[0].angle)
          }
        })
        .to({ angle: 1 }, {
          angle: 0,
          duration: LOOK_AROUND_DURATION,
          ease: 'sine.inOut',
          onUpdate: function() {
            updateCameraLook(targetPosition, horizontalAxis, this.targets()[0].angle)
          }
        })
        .to({ angle: 0 }, {
          angle: -1,
          duration: LOOK_AROUND_DURATION,
          ease: 'sine.inOut',
          onUpdate: function() {
            updateCameraLook(targetPosition, horizontalAxis, this.targets()[0].angle)
          }
        })
        .to({ angle: -1 }, {
          angle: 0,
          duration: LOOK_AROUND_DURATION,
          ease: 'sine.inOut',
          onUpdate: function() {
            updateCameraLook(targetPosition, horizontalAxis, this.targets()[0].angle)
          }
        })
        .to({ vertical: 0 }, {
          vertical: 1,
          duration: LOOK_AROUND_DURATION,
          ease: 'sine.inOut',
          onUpdate: function() {
            updateCameraLook(targetPosition, 'y', this.targets()[0].vertical)
          }
        })
        .to({ vertical: 1 }, {
          vertical: 0,
          duration: LOOK_AROUND_DURATION,
          ease: 'sine.inOut',
          onUpdate: function() {
            updateCameraLook(targetPosition, 'y', this.targets()[0].vertical)
          }
        })
    }

    const returnToDefaultPosition = () => {
      onPOIEnter(false)
      stopLookAround()

      const cameraPos = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }

      gsap.to(cameraPos, {
        x: defaultPositionRef.current.x,
        y: defaultPositionRef.current.y,
        z: defaultPositionRef.current.z,
        duration: RETURN_TO_DEFAULT_DURATION,
        ease: 'power1.inOut',
        onUpdate: () => {
          camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
        }
      })

      if (orbitControlsRef.current) {
        gsap.to(orbitControlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: RETURN_TO_DEFAULT_DURATION,
          ease: 'power1.inOut'
        })
      }
    }

    cameraAnimationRef.current = animateCameraToPOI
    
    cameraAnimationRef.current.goBack = returnToDefaultPosition
  }, [camera, onPOIEnter, cameraAnimationRef, onAnimationComplete])

  return { orbitControlsRef, defaultPositionRef }
}

