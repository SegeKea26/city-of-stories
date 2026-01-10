import gsap from 'gsap'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'

export const useCameraAnimation = (camera, onPOIEnter, cameraAnimationRef, onAnimationComplete) => {
  const defaultPositionRef = useRef({ x: 0, y: 40, z: 80 })
  const orbitControlsRef = useRef()
  const functionsRef = useRef({})
  const lookAroundTimelineRef = useRef(null)

  useEffect(() => {
    functionsRef.current.animateCameraToPosition = (targetPosition, cameraPosition) => {
      onPOIEnter(true)
      
      if (lookAroundTimelineRef.current) {
        lookAroundTimelineRef.current.kill()
        lookAroundTimelineRef.current = null
      }
      gsap.killTweensOf({ angle: 0 })
      gsap.killTweensOf({ vertical: 0 })

      let finalCameraPosition = cameraPosition
      if (!cameraPosition) {
        const directionFromPOI = new THREE.Vector3(
          camera.position.x - targetPosition[0],
          camera.position.y - targetPosition[1],
          camera.position.z - targetPosition[2]
        )
        
        const viewingDistance = 3.5
        directionFromPOI.normalize().multiplyScalar(viewingDistance)
        
        finalCameraPosition = [
          targetPosition[0] + directionFromPOI.x,
          targetPosition[1] + directionFromPOI.y,
          targetPosition[2] + directionFromPOI.z
        ]
      }

      const startPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }

      const timeline = gsap.timeline()

      timeline.to(
        startPosition,
        {
          x: finalCameraPosition[0],
          y: finalCameraPosition[1],
          z: finalCameraPosition[2],
          duration: 4,
          ease: 'power1.inOut',
          onUpdate: () => {
            camera.position.set(startPosition.x, startPosition.y, startPosition.z)
            camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2])
          },
          onComplete: () => {
            camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2])
            functionsRef.current.startLookAround(targetPosition)
          }
        }
      )


      if (orbitControlsRef.current) {
        gsap.to(orbitControlsRef.current.target, {
          x: targetPosition[0],
          y: targetPosition[1],
          z: targetPosition[2],
          duration: 4,
          ease: 'power1.inOut'
        })
      }
    }

    functionsRef.current.startLookAround = (targetPosition) => {
      const dx = Math.abs(camera.position.x - targetPosition[0])
      const dz = Math.abs(camera.position.z - targetPosition[2])
      
      const useZForLookAround = dx > dz
      
      if (onAnimationComplete) {
        onAnimationComplete()
      }
      
      const lookAroundTimeline = gsap.timeline({ repeat: -1 })
      lookAroundTimelineRef.current = lookAroundTimeline
      
      lookAroundTimeline
        .to(
          { angle: 0 },
          {
            angle: 1,
            duration: 5,
            ease: 'sine.inOut',
            onUpdate: function() {
              const offset = this.targets()[0].angle
              if (useZForLookAround) {
                camera.lookAt(
                  targetPosition[0],
                  targetPosition[1],
                  targetPosition[2] - offset * 2
                )
              } else {
                camera.lookAt(
                  targetPosition[0] - offset * 2,
                  targetPosition[1],
                  targetPosition[2]
                )
              }
            }
          }
        )
        .to(
          { angle: 1 },
          {
            angle: 0,
            duration: 5,
            ease: 'sine.inOut',
            onUpdate: function() {
              const offset = this.targets()[0].angle
              if (useZForLookAround) {
                camera.lookAt(
                  targetPosition[0],
                  targetPosition[1],
                  targetPosition[2] - offset * 2
                )
              } else {
                camera.lookAt(
                  targetPosition[0] - offset * 2,
                  targetPosition[1],
                  targetPosition[2]
                )
              }
            }
          }
        )
        .to(
          { angle: 0 },
          {
            angle: -1,
            duration: 5,
            ease: 'sine.inOut',
            onUpdate: function() {
              const offset = this.targets()[0].angle
              if (useZForLookAround) {
                camera.lookAt(
                  targetPosition[0],
                  targetPosition[1],
                  targetPosition[2] - offset * 2
                )
              } else {
                camera.lookAt(
                  targetPosition[0] - offset * 2,
                  targetPosition[1],
                  targetPosition[2]
                )
              }
            }
          }
        )
        .to(
          { angle: -1 },
          {
            angle: 0,
            duration: 5,
            ease: 'sine.inOut',
            onUpdate: function() {
              const offset = this.targets()[0].angle
              if (useZForLookAround) {
                camera.lookAt(
                  targetPosition[0],
                  targetPosition[1],
                  targetPosition[2] - offset * 2
                )
              } else {
                camera.lookAt(
                  targetPosition[0] - offset * 2,
                  targetPosition[1],
                  targetPosition[2]
                )
              }
            }
          }
        )
        .to(
          { vertical: 0 },
          {
            vertical: 1,
            duration: 5,
            ease: 'sine.inOut',
            onUpdate: function() {
              const offset = this.targets()[0].vertical
              camera.lookAt(
                targetPosition[0],
                targetPosition[1] + offset * 1.5,
                targetPosition[2]
              )
            }
          }
        )
        .to(
          { vertical: 1 },
          {
            vertical: 0,
            duration: 5,
            ease: 'sine.inOut',
            onUpdate: function() {
              const offset = this.targets()[0].vertical
              camera.lookAt(
                targetPosition[0],
                targetPosition[1] + offset * 1.5,
                targetPosition[2]
              )
            }
          }
        )
    }

    functionsRef.current.animateToDefault = () => {
      onPOIEnter(false)

      if (lookAroundTimelineRef.current) {
        lookAroundTimelineRef.current.kill()
        lookAroundTimelineRef.current = null
      }

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
  }, [camera, onPOIEnter, cameraAnimationRef, onAnimationComplete])

  return { orbitControlsRef, defaultPositionRef }
}

