import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useMouseDrag } from './useMouseDrag'

export const useCartCameraFollower = (cartPositionRef, isFollowing, cameraMode = 'grab') => {
  const { camera } = useThree()
  const { cameraRotation } = useMouseDrag(isFollowing, cameraMode)

  useEffect(() => {
    let animationFrameId

    if (isFollowing) {
      const animate = () => {
        if (cartPositionRef.current && isFollowing) {
          const [x, y, z] = cartPositionRef.current

          const centerY = y - 1.2

          camera.position.x += (x - camera.position.x) * 0.08
          camera.position.y += (centerY - camera.position.y) * 0.08
          camera.position.z += (z - camera.position.z) * 0.08

          camera.rotation.order = 'YXZ'
          camera.rotation.x = cameraRotation.current.x
          camera.rotation.y = cameraRotation.current.y
          camera.rotation.z = 0
        }
        animationFrameId = requestAnimationFrame(animate)
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [camera, isFollowing, cartPositionRef, cameraRotation])
}

