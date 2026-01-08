import * as THREE from "three"
import React, { useRef, useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

import { Notification } from "../components/Notification/Notification"
import { POIInfo } from "../components/POIInfo/POIInfo"
import { Button } from "../components/Button/Button"
import { Loader } from "../components/Loader/Loader"
import Winterfest from "../models/Winterfest"

import { useCameraAnimation, usePOIManager, useOrbitControlsSettings, useCartCameraFollower, usePOICameraLookAround } from "../hooks"

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
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  
  const {
    isViewingPOI,
    setIsViewingPOI,
    isFollowingCart,
    setIsFollowingCart,
    showWheelCashierNotification,
    setShowWheelCashierNotification,
    currentPOIInfo,
    setCurrentPOIInfo
  } = usePOIManager()

  const handleModelLoaded = () => {
    setLoadProgress(100)
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    if (!isLoading || loadProgress === 100) return
    
    let currentProgress = loadProgress
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25
      if (currentProgress > 85) {
        currentProgress = 85
        clearInterval(interval)
      }
      setLoadProgress(Math.round(currentProgress))
    }, 400)

    return () => clearInterval(interval)
  }, [isLoading, loadProgress])

  const handleBackClick = () => {
    if (cameraAnimationRef.current?.goBack) {
      cameraAnimationRef.current.goBack()
    }
    setCurrentPOIInfo({ label: '', text: '' })
    setShowWheelCashierNotification(false)
    setIsFollowingCart(false)
  }

  const handleExitWheel = () => {
    setIsFollowingCart(false)
    setShowWheelCashierNotification(true)
    setCurrentPOIInfo({ label: 'Wheel Cashier', text: 'The central hub of the winter fair where visitors can purchase tickets and souvenirs.' })
    if (cameraAnimationRef.current) {
      cameraAnimationRef.current([-0.5, 2, 5])
    }
  }

  const handleEnterFerrisWheel = () => {
    if (restartAnimationRef.current) {
      restartAnimationRef.current()
    }
    setIsFollowingCart(true)
    setShowWheelCashierNotification(false)
  }

  const handlePOIClick = (position, label, text) => {
    if (isFollowingCart) return
    
    setCurrentPOIInfo({ label, text })
    if (cameraAnimationRef.current) {
      cameraAnimationRef.current(position)
    }
    
    if (label === "Wheel Cashier") {
      setShowWheelCashierNotification(true)
    } else {
      setShowWheelCashierNotification(false)
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
      <Canvas shadows className="canvas">
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

      {showWheelCashierNotification && (
        <button 
          className="enter-ferris-button"
          onClick={handleEnterFerrisWheel}
        >
          {isFollowingCart ? "Exit Wheel" : "Enter Ferris Wheel"}
        </button>
      )}

      {isFollowingCart && !showWheelCashierNotification && (
        <button 
          className="enter-ferris-button"
          onClick={handleExitWheel}
        >
          Exit Wheel
        </button>
      )}

      <Notification 
        visible={showWheelCashierNotification}
        message="Today is your lucky day! all rides are now free in this experience."
      />

      <POIInfo visible={isViewingPOI && !isFollowingCart} label={currentPOIInfo.label} text={currentPOIInfo.text} />
    </>
  )
}

export default Experience