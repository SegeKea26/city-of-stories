import { useRef, useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

import { POIInfo } from "../components/POIInfo/POIInfo"
import { Button } from "../components/Button/Button"
import { Loader } from "../components/Loader/Loader"
import { Notification } from "../components/Notification/Notification"
import { Crosshair } from "../components/Crosshair/Crosshair"

import { Model as WinterfestWheel } from "../models/WinterfestWheel.jsx"
import { Model as WinterfestCabin } from "../models/WinterfestCabin.jsx"
import { Model as WinterfestArea } from "../models/WinterfestArea.jsx"

import { WINTERFEST_HOME, getPOIById } from "../data/poiData"

import { 
  useCameraAnimation, 
  usePOIManager, 
  useOrbitControlsSettings, 
  useCartCameraFollower, 
  usePOICameraLookAround, 
  useLoadingProgress, 
  useViewerModePOIDetection, 
  usePOINavigation, 
  useCameraModeSwitcher, 
  useFerrisWheel, 
  useNotification, 
  useWheelNotification, 
  useWindSound 
} from "../hooks"

const CAMERA_FOV = 50
const CAMERA_DEFAULT_POSITION = [0, 40, 80]
const AUTO_ROTATE_SPEED = .75
const MIN_POLAR_ANGLE = Math.PI / 2.5
const MAX_POLAR_ANGLE = Math.PI / 2.5

const FOG_COLOR = '#1a1520'
const FOG_NEAR = 50
const FOG_FAR = 200
const DIRECTIONAL_LIGHT_INTENSITY = 1.2
const DIRECTIONAL_LIGHT_COLOR = '#ffe0cc'
const AMBIENT_LIGHT_INTENSITY = 0.5
const AMBIENT_LIGHT_COLOR = '#fff5f0'

const CameraController = ({ 
  cameraAnimationRef, 
  onPOIEnter, 
  isViewingPOI, 
  isTourMode, 
  cameraMode, 
  cartPositionRef, 
  isFollowingCart, 
  canvasClicked, 
  isCameraAnimating
}) => {
  const { camera } = useThree()
  
  const { orbitControlsRef } = useCameraAnimation(
    camera, 
    onPOIEnter, 
    cameraAnimationRef
  )
  
  useOrbitControlsSettings(orbitControlsRef, isViewingPOI, isTourMode, isFollowingCart)
  
  useViewerModePOIDetection(cameraMode, isViewingPOI)
  
  useCartCameraFollower(cartPositionRef, isFollowingCart, cameraMode)

  usePOICameraLookAround(isViewingPOI && !isTourMode && !isCameraAnimating, cameraMode)
  
  const canRotate = !isFollowingCart && !isViewingPOI
  
  const shouldAutoRotate = !canvasClicked && !isTourMode && !isViewingPOI
  
  return (
    <OrbitControls  
      ref={orbitControlsRef}
      enablePan={false} 
      enableZoom={false} 
      enableRotate={canRotate}
      autoRotate={shouldAutoRotate}
      autoRotateSpeed={AUTO_ROTATE_SPEED}
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      minPolarAngle={MIN_POLAR_ANGLE}
      maxPolarAngle={MAX_POLAR_ANGLE}
      makeDefault
    />
  )
}

const Experience = () => {

  const cameraAnimationRef = useRef()
  const restartAnimationRef = useRef()
  const cartPositionRef = useRef([0, 0, 0])
  
  const handlePOIClickRef = useRef()
  const handleCartPositionUpdateRef = useRef()
  const handleRestartAnimationRef = useRef()
  const handleBackClickRef = useRef()
  const handleEnterFerrisWheelRef = useRef()
  const handleExitWheelRef = useRef()
  const handleNavigateToPOIRef = useRef()
  const setNotificationDismissedRef = useRef()
  const setWheelNotificationDismissedRef = useRef()
  
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

  const { notificationDismissed, setNotificationDismissed } = useNotification(
    isViewingPOI, 
    isTourMode
  )
  
  const { wheelNotificationDismissed, setWheelNotificationDismissed } = useWheelNotification(
    isFollowingCart, 
    isTourMode
  )

  useWindSound(isFollowingCart)

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

  useEffect(() => {
    handleBackClickRef.current = () => {
      if (cameraAnimationRef.current?.goBack) {
        cameraAnimationRef.current.goBack()
      }
      
      setCurrentPOIInfo({ label: '', text: '' })
      setIsFollowingCart(false)
      setIsCameraAnimating(false)
    }
  })

  useEffect(() => {
    handlePOIClickRef.current = (position, label, text, poiId) => {
      if (isFollowingCart) return
      
      setCanvasClicked(true)
      setIsViewingPOI(true)
      setIsCameraAnimating(true)
      
      setTimeout(() => {
        setIsCameraAnimating(false)
      }, 4000)
      
      if (cameraAnimationRef.current && poiId) {
        const poi = getPOIById(poiId)
        
        if (poi && poi.cameraPosition) {
          const createTourNavigationButtons = (poi) => {
            const buttons = []
            
            if (poi.prevId) {
              const label = poi.prevId === 'winterfest' ? 'back' : 'back'
              buttons.push({ 
                label, 
                onClick: () => handleNavigateToPOIRef.current(poi.prevId) 
              })
            }
            
            if (poi.nextId) {
              const label = poi.nextId === 'winterfest' ? 'end' : 'next'
              buttons.push({ 
                label, 
                onClick: () => handleNavigateToPOIRef.current(poi.nextId) 
              })
            }
            
            return buttons
          }
          
          const buttons = createTourNavigationButtons(poi)
          
          setCurrentPOIInfo({ 
            label: poi.label, 
            text: poi.text,
            image1: poi.image1,
            image2: poi.image2,
            buttons: buttons
          })
          
          cameraAnimationRef.current(position, poi.cameraPosition, true)
        }
      }
    }
  })

  useEffect(() => {
    handleCartPositionUpdateRef.current = (position) => {
      cartPositionRef.current = position
    }
  })

  useEffect(() => {
    handleRestartAnimationRef.current = (restartFn) => {
      restartAnimationRef.current = restartFn
    }
  })

  useEffect(() => {
    handleNavigateToPOIRef.current = handleNavigateToPOI
  })

  useEffect(() => {
    handleEnterFerrisWheelRef.current = handleEnterFerrisWheel
  })

  useEffect(() => {
    handleExitWheelRef.current = handleExitWheel
  })

  useEffect(() => {
    setNotificationDismissedRef.current = setNotificationDismissed
  })

  useEffect(() => {
    setWheelNotificationDismissedRef.current = setWheelNotificationDismissed
  })

  const stableHandlePOIClick = (...args) => handlePOIClickRef.current?.(...args)
  const stableHandleCartPositionUpdate = (...args) => handleCartPositionUpdateRef.current?.(...args)
  const stableHandleRestartAnimation = (...args) => handleRestartAnimationRef.current?.(...args)
  const stableHandleBackClick = (...args) => handleBackClickRef.current?.(...args)
  const stableHandleEnterFerrisWheel = (...args) => handleEnterFerrisWheelRef.current?.(...args)
  const stableHandleExitWheel = (...args) => handleExitWheelRef.current?.(...args)
  const stableHandleNavigateToPOI = (...args) => handleNavigateToPOIRef.current?.(...args)
  const stableSetNotificationDismissed = (...args) => setNotificationDismissedRef.current?.(...args)
  const stableSetWheelNotificationDismissed = (...args) => setWheelNotificationDismissedRef.current?.(...args)

  const shouldShowHomeScreen = !isViewingPOI && !isFollowingCart && canvasClicked
  
  const shouldShowPOIInfo = isViewingPOI && !isFollowingCart && currentPOIInfo.label
  
  const isAtFerrisWheelEntrance = isViewingPOI && currentPOIInfo.label === 'Wheel Cashier' && !isFollowingCart

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

        <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
        
        <PerspectiveCamera 
          makeDefault 
          position={CAMERA_DEFAULT_POSITION} 
          fov={CAMERA_FOV} 
        />
        
        <CameraController 
          cameraAnimationRef={cameraAnimationRef} 
          onPOIEnter={setIsViewingPOI} 
          isViewingPOI={isViewingPOI}
          isTourMode={isTourMode}
          cameraMode={cameraMode}
          cartPositionRef={cartPositionRef}
          isFollowingCart={isFollowingCart}
          canvasClicked={canvasClicked}
          isCameraAnimating={isCameraAnimating}
        />
        
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={DIRECTIONAL_LIGHT_INTENSITY} 
          color={DIRECTIONAL_LIGHT_COLOR} 
        />
        <ambientLight 
          intensity={AMBIENT_LIGHT_INTENSITY} 
          color={AMBIENT_LIGHT_COLOR} 
        />
        
        <WinterfestArea 
          onPOIClick={stableHandlePOIClick} 
          isTourMode={isTourMode}
          onModelLoaded={handleModelLoaded}
        />

        <WinterfestCabin
          onModelLoaded={handleModelLoaded}
        />

        <WinterfestWheel 
          onCartPositionUpdate={stableHandleCartPositionUpdate} 
          isFollowingCart={isFollowingCart}
          onModelLoaded={handleModelLoaded}
          onRestartAnimation={stableHandleRestartAnimation}
        />
      </Canvas>
      
      <Loader isLoading={isLoading} progress={loadProgress} />
      
      <Button 
        visible={isViewingPOI && !isTourMode} 
        onClick={stableHandleBackClick} 
        label="Home" 
      />

      {isAtFerrisWheelEntrance && (
        <button 
          className="enter-ferris-button"
          onClick={stableHandleEnterFerrisWheel}
        >
          Enter Ferris Wheel
        </button>
      )}

      {isFollowingCart && (
        <button 
          className="enter-ferris-button"
          onClick={stableHandleExitWheel}
        >
          Exit Wheel
        </button>
      )}

      {shouldShowHomeScreen && (
        <POIInfo 
          visible={true} 
          label={WINTERFEST_HOME.label}
          text={WINTERFEST_HOME.text}
          image1={WINTERFEST_HOME.image1}
          image2={WINTERFEST_HOME.image2}
          buttonLabel={WINTERFEST_HOME.buttonLabel}
          onButtonClick={() => {
            setIsTourMode(true)
            stableHandleNavigateToPOI('cecemel-cabin')
          }}
        />
      )}

      {shouldShowPOIInfo && (
        <POIInfo 
          visible={true} 
          label={currentPOIInfo.label}
          text={currentPOIInfo.text}
          image1={currentPOIInfo.image1}
          image2={currentPOIInfo.image2}
          buttons={
            isTourMode && currentPOIInfo.buttons && currentPOIInfo.buttons.length > 0 
              ? currentPOIInfo.buttons 
              : []
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
        onDismiss={() => stableSetNotificationDismissed(true)}
      />
      
      <Notification 
        visible={!wheelNotificationDismissed && isFollowingCart && isTourMode}
        type="wheel"
        onDismiss={() => stableSetWheelNotificationDismissed(true)}
      />


    </>
  )
}

export default Experience