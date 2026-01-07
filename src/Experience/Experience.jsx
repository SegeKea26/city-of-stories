import { Canvas } from "@react-three/fiber"
import Winterfest from "../models/Winterfest"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"


const Experience = () => {
  return (
    <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 50, 100]} fov={50} />
        <OrbitControls  
          enablePan={false} 
          enableZoom={false} 
          enableRotate={true}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, 0, 0]}
        />
        
        <directionalLight position={[10, 20, 10]} intensity={1} />
        <ambientLight intensity={0.5} />
        
        <Winterfest />
      </Canvas>
  )
}

export default Experience