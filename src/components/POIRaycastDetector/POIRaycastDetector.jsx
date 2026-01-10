import { usePOIRaycast } from '../../hooks'

export const POIRaycastDetector = ({ isViewingPOI, cameraMode, onHoveredPOIChange }) => {
  usePOIRaycast(isViewingPOI, cameraMode, onHoveredPOIChange)
  return null
}