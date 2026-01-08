import * as THREE from "three"
import React, { useRef } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

import { POIInfo } from "../components/POIInfo/POIInfo"
import { Button } from "../components/Button/Button"
import { Loader } from "../components/Loader/Loader"
import Winterfest from "../models/Winterfest"

import { useCameraAnimation, usePOIManager, useOrbitControlsSettings, useCartCameraFollower, usePOICameraLookAround, useLoadingProgress } from "../hooks"

const CartCameraFollower = ({ cartPositionRef, isFollowing }) => {
  useCartCameraFollower(cartPositionRef, isFollowing)
  return null
}

const POICameraLookAround = ({ isViewingPOI }) => {
  usePOICameraLookAround(isViewingPOI)
  return null
}

const CameraController = ({ cameraAnimationRef, onPOIEnter, isViewingPOI, cartPositionRef, isFollowingCart }) => {
  const { camera } = useThree()
  const { orbitControlsRef } = useCameraAnimation(camera, onPOIEnter, cameraAnimationRef)
  
  useOrbitControlsSettings(orbitControlsRef, isViewingPOI, isFollowingCart)
  
  return (
    <>
      <OrbitControls  
        ref={orbitControlsRef}
        enablePan={false} 
        enableZoom={false} 
        enableRotate={!isFollowingCart}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0, 0]}
      />
      <CartCameraFollower cartPositionRef={cartPositionRef} isFollowing={isFollowingCart} />
      <POICameraLookAround isViewingPOI={isViewingPOI && !isFollowingCart} />
    </>
  )
}

const Experience = () => {
  const cameraAnimationRef = useRef()
  const restartAnimationRef = useRef()
  const cartPositionRef = useRef([0, 0, 0])
  
  const { isLoading, loadProgress, handleModelLoaded } = useLoadingProgress()
  
  const {
    isViewingPOI,
    setIsViewingPOI,
    isFollowingCart,
    setIsFollowingCart,
    currentPOIInfo,
    setCurrentPOIInfo
  } = usePOIManager()

  const handleBackClick = () => {
    if (cameraAnimationRef.current?.goBack) {
      cameraAnimationRef.current.goBack()
    }
    setCurrentPOIInfo({ label: '', text: '' })
    setIsFollowingCart(false)
  }

  const handleExitWheel = () => {
    setIsFollowingCart(false)
    setCurrentPOIInfo({ label: '', text: '' })
    if (cameraAnimationRef.current) {
      cameraAnimationRef.current([-0.5, 2, 5])
    }
  }

  const handlePOIClick = (position, label, text) => {
    if (isFollowingCart) return
    
    setCurrentPOIInfo({ label, text })
    if (cameraAnimationRef.current) {
      cameraAnimationRef.current(position)
    }
  }

  const handleCartPositionUpdate = (position) => {
    cartPositionRef.current = position
  }

  const handleRestartAnimation = (restartFn) => {
    restartAnimationRef.current = restartFn
  }

  return (
    <>
      <Canvas 
        shadows 
        className="canvas"
        gl={{ 
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <fog attach="fog" args={['#1a1520', 50, 200]} />
        
        <PerspectiveCamera makeDefault position={[0, 40, 80]} fov={50} />
        <CameraController 
          cameraAnimationRef={cameraAnimationRef} 
          onPOIEnter={setIsViewingPOI} 
          isViewingPOI={isViewingPOI}
          cartPositionRef={cartPositionRef}
          isFollowingCart={isFollowingCart}
        />
        
        <directionalLight position={[10, 20, 10]} intensity={1.2} color="#ffe0cc" />
        <ambientLight intensity={0.5} color="#fff5f0" />
        
        <Winterfest 
          onPOIClick={handlePOIClick}
          onCartPositionUpdate={handleCartPositionUpdate}
          onRestartAnimation={handleRestartAnimation}
          onModelLoaded={handleModelLoaded}
        />
      </Canvas>
      
      <Loader isLoading={isLoading} progress={loadProgress} />
      <Button 
        visible={isViewingPOI} 
        onClick={handleBackClick} 
        label="Back" 
      />

      {isFollowingCart && (
        <button 
          className="enter-ferris-button"
          onClick={handleExitWheel}
        >
          Exit Wheel
        </button>
      )}

      <POIInfo visible={isViewingPOI && !isFollowingCart} label={currentPOIInfo.label} text={currentPOIInfo.text} />
    </>
  )
}

export default Experience