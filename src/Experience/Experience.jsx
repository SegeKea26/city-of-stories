import { Canvas, useThree } from "@react-three/fiber"
import Winterfest from "../models/Winterfest"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import { Button } from "../components/Button/Button"
import { POIInfo } from "../components/POIInfo/POIInfo"
import gsap from "gsap"

const CameraController = ({ cameraAnimationRef, onPOIEnter, isViewingPOI }) => {
  const { camera } = useThree()
  const orbitControlsRef = useRef()
  const defaultPositionRef = useRef({ x: 0, y: 40, z: 80 })
  const functionsRef = useRef({})

  useEffect(() => {
    functionsRef.current.animateCameraToPosition = (targetPosition) => {
      onPOIEnter(true)
      
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
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.position.set(startPosition.x, startPosition.y, startPosition.z)
        }
      })

      if (orbitControlsRef.current) {
        gsap.to(orbitControlsRef.current.target, {
          x: targetPosition[0],
          y: targetPosition[1],
          z: targetPosition[2],
          duration: 2,
          ease: "power2.inOut"
        })
      }
    }

    functionsRef.current.animateToDefault = () => {
      onPOIEnter(false)
      
      const startPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }
      
      gsap.to(startPosition, {
        x: defaultPositionRef.current.x,
        y: defaultPositionRef.current.y,
        z: defaultPositionRef.current.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.position.set(startPosition.x, startPosition.y, startPosition.z)
        }
      })

      if (orbitControlsRef.current) {
        gsap.to(orbitControlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 2,
          ease: "power2.inOut"
        })
      }
    }

    cameraAnimationRef.current = functionsRef.current.animateCameraToPosition
    cameraAnimationRef.current.goBack = functionsRef.current.animateToDefault
  }, [camera, onPOIEnter, cameraAnimationRef])

  useEffect(() => {
    if (orbitControlsRef.current) {
      if (isViewingPOI) {
        orbitControlsRef.current.minPolarAngle = Math.PI / 4
        orbitControlsRef.current.maxPolarAngle = Math.PI / 1.5
      } else {
        orbitControlsRef.current.minPolarAngle = Math.PI / 2.5
        orbitControlsRef.current.maxPolarAngle = Math.PI / 2.5
      }
    }
  }, [isViewingPOI])
  
  return (
    <OrbitControls  
      ref={orbitControlsRef}
      enablePan={false} 
      enableZoom={false} 
      enableRotate={true}
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      minPolarAngle={Math.PI / 2.5}
      maxPolarAngle={Math.PI / 2.5}
      target={[0, 0, 0]}
    />
  )
}

const Experience = () => {
  const cameraAnimationRef = useRef()
  const [isViewingPOI, setIsViewingPOI] = useState(false)
  const [currentPOIInfo, setCurrentPOIInfo] = useState({ label: '', text: '' })

  const handleBackClick = () => {
    if (cameraAnimationRef.current?.goBack) {
      cameraAnimationRef.current.goBack()
    }
    setCurrentPOIInfo({ label: '', text: '' })
  }

  const handlePOIClick = (position, label, text) => {
    setCurrentPOIInfo({ label, text })
    if (cameraAnimationRef.current) {
      cameraAnimationRef.current(position)
    }
  }

  return (
    <>
      <Canvas shadows className="canvas">
        <fog attach="fog" args={['#1a1520', 50, 200]} />
        
        <PerspectiveCamera makeDefault position={[0, 40, 80]} fov={50} />
        <CameraController cameraAnimationRef={cameraAnimationRef} onPOIEnter={setIsViewingPOI} isViewingPOI={isViewingPOI} />
        
        <directionalLight position={[10, 20, 10]} intensity={1.2} color="#ffe0cc" />
        <ambientLight intensity={0.5} color="#fff5f0" />
        
        <Winterfest onPOIClick={handlePOIClick} />
      </Canvas>
      <Button visible={isViewingPOI} onClick={handleBackClick} label="Back" />
      <POIInfo visible={isViewingPOI} label={currentPOIInfo.label} text={currentPOIInfo.text} />
    </>
  )
}

export default Experience