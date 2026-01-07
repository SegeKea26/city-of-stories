import { Canvas } from "@react-three/fiber"
import Winterfest from "../models/Winterfest"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"


const Experience = () => {
  return (
    <Canvas shadows className="canvas">
        <fog attach="fog" args={['#1a1520', 50, 200]} />
        
        <PerspectiveCamera makeDefault position={[0, 40, 80]} fov={50} />
        <OrbitControls  
          enablePan={false} 
          enableZoom={false} 
          enableRotate={true}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, 0, 0]}
        />
        
        <directionalLight position={[10, 20, 10]} intensity={1.2} color="#ffe0cc" />
        <ambientLight intensity={0.5} color="#fff5f0" />
        
        <Winterfest />
      </Canvas>
  )
}

export default Experience