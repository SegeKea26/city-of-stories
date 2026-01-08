import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useMouseDrag } from './useMouseDrag'

export const usePOICameraLookAround = (isViewingPOI) => {
  const { camera } = useThree()
  const { cameraRotation, euler } = useMouseDrag(isViewingPOI)

  useEffect(() => {
    let animationFrameId

    if (isViewingPOI) {
      const animate = () => {
        euler.current.setFromQuaternion(camera.quaternion)
        euler.current.order = 'YXZ'
        euler.current.setFromVector3({
          x: cameraRotation.current.x,
          y: cameraRotation.current.y,
          z: 0
        })
        camera.quaternion.setFromEuler(euler.current)
        animationFrameId = requestAnimationFrame(animate)
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [camera, isViewingPOI, cameraRotation, euler])
}
