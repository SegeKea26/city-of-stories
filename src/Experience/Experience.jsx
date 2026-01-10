import { useRef, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

import { POIInfo } from "../components/POIInfo/POIInfo"
import { Button } from "../components/Button/Button"
import { Loader } from "../components/Loader/Loader"
import { Notification } from "../components/Notification/Notification"
import { Crosshair } from "../components/Crosshair/Crosshair"
import Winterfest from "../models/Winterfest"
import { WINTERFEST_HOME, getPOIById } from "../data/poiData"

import { useCameraAnimation, usePOIManager, useOrbitControlsSettings, useCartCameraFollower, usePOICameraLookAround, useLoadingProgress, useViewerModePOIDetection, usePOINavigation, useCameraModeSwitcher, useFerrisWheel, useNotification, useWheelNotification } from "../hooks"

const CartCameraFollower = ({ cartPositionRef, isFollowing, cameraMode }) => {
  useCartCameraFollower(cartPositionRef, isFollowing, cameraMode)
  return null
}

const POICameraLookAround = ({ isViewingPOI, isTourMode, cameraMode }) => {
  usePOICameraLookAround(isViewingPOI && !isTourMode, cameraMode)
  return null
}

const CameraController = ({ cameraAnimationRef, onPOIEnter, isViewingPOI, isTourMode, cameraMode, cartPositionRef, isFollowingCart, canvasClicked, onAnimationComplete }) => {
  const { camera } = useThree()
  const { orbitControlsRef } = useCameraAnimation(camera, onPOIEnter, cameraAnimationRef, onAnimationComplete)
  
  useOrbitControlsSettings(orbitControlsRef, isViewingPOI, isTourMode, isFollowingCart)
  useViewerModePOIDetection(cameraMode, isViewingPOI)
  
  return (
    <>
      <OrbitControls  
        ref={orbitControlsRef}
        enablePan={false} 
        enableZoom={false} 
        enableRotate={!isFollowingCart && !isViewingPOI}
        autoRotate={!canvasClicked && !isTourMode && !isViewingPOI}
        autoRotateSpeed={2}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2.5}
      />
      <CartCameraFollower cartPositionRef={cartPositionRef} isFollowing={isFollowingCart} cameraMode={cameraMode} />
      <POICameraLookAround isViewingPOI={isViewingPOI && !isFollowingCart} isTourMode={isTourMode} cameraMode={cameraMode} />
    </>
  )
}

const Experience = () => {
  const cameraAnimationRef = useRef()
  const restartAnimationRef = useRef()
  const cartPositionRef = useRef([0, 0, 0])
  const [cameraMode, setCameraMode] = useState('grab')
  const [isCameraAnimating, setIsCameraAnimating] = useState(false)
  
  const { isLoading, loadProgress, handleModelLoaded } = useLoadingProgress()
  
  const {
    isViewingPOI,
    setIsViewingPOI,
    isTourMode,
    setIsTourMode,
    isFollowingCart,
    setIsFollowingCart,
    currentPOIInfo,
    setCurrentPOIInfo,
    canvasClicked,
    setCanvasClicked
  } = usePOIManager()

  const { notificationDismissed, setNotificationDismissed } = useNotification(isViewingPOI, isTourMode)
  const { wheelNotificationDismissed, setWheelNotificationDismissed } = useWheelNotification(isFollowingCart, isTourMode)

  const { handleNavigateToPOI } = usePOINavigation(
    cameraAnimationRef,
    setCurrentPOIInfo,
    setIsViewingPOI,
    setIsTourMode,
    setIsFollowingCart,
    () => setIsCameraAnimating(true)
  )

  const { handleEnterFerrisWheel, handleExitWheel } = useFerrisWheel(
    setIsFollowingCart,
    setCurrentPOIInfo,
    cameraAnimationRef,
    handleNavigateToPOI,
    restartAnimationRef
  )

  useCameraModeSwitcher(isViewingPOI, isTourMode, setCameraMode, isFollowingCart)

  const handleBackClick = () => {
    if (cameraAnimationRef.current?.goBack) {
      cameraAnimationRef.current.goBack()
    }
    setCurrentPOIInfo({ label: '', text: '' })
    setIsFollowingCart(false)
    setIsCameraAnimating(false)
  }

  const handlePOIClick = (position, label, text, poiId) => {
    if (isFollowingCart) return
    
    setCanvasClicked(true)
    setIsViewingPOI(true)
    
    if (cameraAnimationRef.current && poiId) {
      const poi = getPOIById(poiId)
      if (poi && poi.cameraPosition) {
        const buttons = []
        if (poi.prevId) {
          buttons.push({ label: poi.prevId === 'winterfest' ? 'back' : 'back', onClick: () => handleNavigateToPOI(poi.prevId) })
        }
        if (poi.nextId) {
          buttons.push({ label: poi.nextId === 'winterfest' ? 'end' : 'next', onClick: () => handleNavigateToPOI(poi.nextId) })
        }
        
        setCurrentPOIInfo({ 
          label: poi.label, 
          text: poi.text,
          image1: poi.image1,
          image2: poi.image2,
          buttons: buttons
        })
        cameraAnimationRef.current(position, poi.cameraPosition)
      }
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
        onClick={() => setCanvasClicked(true)}
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
          isTourMode={isTourMode}
          cameraMode={cameraMode}
          cartPositionRef={cartPositionRef}
          isFollowingCart={isFollowingCart}
          canvasClicked={canvasClicked}
          onAnimationComplete={() => setIsCameraAnimating(false)}
        />
        
        
        <directionalLight position={[10, 20, 10]} intensity={1.2} color="#ffe0cc" />
        <ambientLight intensity={0.5} color="#fff5f0" />
        
        <Winterfest 
          onPOIClick={handlePOIClick}
          onCartPositionUpdate={handleCartPositionUpdate}
          onRestartAnimation={handleRestartAnimation}
          onModelLoaded={handleModelLoaded}
          isTourMode={isTourMode}
        />
      </Canvas>
      
      <Loader isLoading={isLoading} progress={loadProgress} />
      <Button 
        visible={isViewingPOI && !isTourMode} 
        onClick={handleBackClick} 
        label="Home" 
      />

      {isViewingPOI && currentPOIInfo.label === 'Wheel Cashier' && !isFollowingCart && (
        <button 
          className="enter-ferris-button"
          onClick={handleEnterFerrisWheel}
        >
          Enter Ferris Wheel
        </button>
      )}

      {isFollowingCart && (
        <button 
          className="enter-ferris-button"
          onClick={handleExitWheel}
        >
          Exit Wheel
        </button>
      )}

      {!isViewingPOI && !isFollowingCart && canvasClicked && (
        <POIInfo 
          visible={true} 
          label={WINTERFEST_HOME.label}
          text={WINTERFEST_HOME.text}
          image1={WINTERFEST_HOME.image1}
          image2={WINTERFEST_HOME.image2}
          buttonLabel={WINTERFEST_HOME.buttonLabel}
          onButtonClick={() => {
            setIsTourMode(true)
            handleNavigateToPOI('cecemel-cabin')
          }}
        />
      )}

      {isViewingPOI && !isFollowingCart && currentPOIInfo.label && (
        <POIInfo 
          visible={true} 
          label={currentPOIInfo.label}
          text={currentPOIInfo.text}
          image1={currentPOIInfo.image1}
          image2={currentPOIInfo.image2}
          buttons={
            isTourMode && currentPOIInfo.buttons && currentPOIInfo.buttons.length > 0 ? currentPOIInfo.buttons : []
          }
          buttonsDisabled={isCameraAnimating}
        />
      )}

      {isViewingPOI && !isTourMode && cameraMode === 'viewer' && (
        <Crosshair />
      )}

      <Notification 
        visible={!notificationDismissed && isViewingPOI && !isTourMode}
        cameraMode={cameraMode}
        type="camera"
        onDismiss={() => setNotificationDismissed(true)}
      />
      <Notification 
        visible={!wheelNotificationDismissed && isFollowingCart && isTourMode}
        type="wheel"
        onDismiss={() => setWheelNotificationDismissed(true)}
      />
    </>
  )
}

export default Experience