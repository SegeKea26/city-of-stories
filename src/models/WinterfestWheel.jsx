import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Model(props) {
  const { onCartPositionUpdate, onRestartAnimation, onModelLoaded } = props
  const group = useRef()
  const hasLoadedRef = useRef(false)
  const { nodes, materials, animations } = useGLTF('./model/winterfest-wheel.glb')
  const { actions } = useAnimations(animations, group)
  
  useEffect(() => {
    if (nodes && materials && animations && !hasLoadedRef.current) {
      hasLoadedRef.current = true
      
      setTimeout(() => {
        if (onModelLoaded) {
          onModelLoaded()
        }
      }, 600)
    }
  }, [nodes, materials, animations, onModelLoaded])

  // Keep carts upright as wheel rotates
  useFrame(() => {
    if (group.current) {
      const wheelRoot = group.current.getObjectByName('WHEEL_ROOT')
      if (wheelRoot) {
        for (let i = 1; i <= 16; i++) {
          const cart = wheelRoot.getObjectByName(`cart_PIVOT${String(i).padStart(3, '0')}`)
          if (cart) {
            cart.rotation.z = -wheelRoot.rotation.z
          }
        }
        
        const trackedCart = wheelRoot.getObjectByName('cart_PIVOT001')
        if (trackedCart && onCartPositionUpdate) {
          const worldPosition = new THREE.Vector3()
          trackedCart.getWorldPosition(worldPosition)
          onCartPositionUpdate([worldPosition.x, worldPosition.y, worldPosition.z])
        }
      }
    }
  })

  // Control wheel animation
  useEffect(() => {
    if (actions && animations.length > 0) {
      const wheelAnimation = actions[Object.keys(actions)[0]]

      if (wheelAnimation) {
        wheelAnimation.reset()
        wheelAnimation.play()

        setTimeout(() => {
          wheelAnimation.timeScale = 0.3
        }, 0)
      }
      
      if (onRestartAnimation) {
        onRestartAnimation(() => {
          if (wheelAnimation) {
            wheelAnimation.reset()
            wheelAnimation.play()
            wheelAnimation.timeScale = 0.3
          }
        })
      }
    }
  }, [actions, animations, onRestartAnimation])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="WHEEL_ROOT" position={[-0.021, 14.456, -5.927]} scale={0.65}>
          <group name="cart_PIVOT001" position={[-17.067, 0.193, -0.067]}>
            <mesh
              name="cart-frame001"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame001'].geometry}
              material={materials['wheel-cart']}
              position={[0.255, -0.52, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT002" position={[-15.888, -6.475, -0.067]}>
            <mesh
              name="cart-frame002"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame002'].geometry}
              material={materials['wheel-cart']}
              position={[0.361, -0.423, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT003" position={[-12.404, -11.964, -0.067]}>
            <mesh
              name="cart-frame003"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame003'].geometry}
              material={materials['wheel-cart']}
              position={[0.519, -0.375, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT004" position={[-6.676, -15.778, -0.067]}>
            <mesh
              name="cart-frame004"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame004'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT005" position={[0.042, -17.097, -0.067]}>
            <mesh
              name="cart-frame005"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame005'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT006" position={[6.484, -15.771, -0.067]}>
            <mesh
              name="cart-frame006"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame006'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT007" position={[12.079, -12.074, -0.067]}>
            <mesh
              name="cart-frame007"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame007'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT008" position={[15.674, -6.446, -0.067]}>
            <mesh
              name="cart-frame008"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame008'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT009" position={[16.897, -0.066, -0.067]}>
            <mesh
              name="cart-frame009"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame009'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT010" position={[15.661, 6.524, -0.067]}>
            <mesh
              name="cart-frame010"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame010'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT011" position={[12.083, 11.859, -0.067]}>
            <mesh
              name="cart-frame011"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame011'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT012" position={[6.566, 15.698, -0.067]}>
            <mesh
              name="cart-frame012"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame012'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT013" position={[-0.04, 17.002, -0.067]}>
            <mesh
              name="cart-frame013"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame013'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT014" position={[-6.443, 15.721, -0.067]}>
            <mesh
              name="cart-frame014"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame014'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT015" position={[-11.955, 12.099, -0.067]}>
            <mesh
              name="cart-frame015"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame015'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <group name="cart_PIVOT016" position={[-15.684, 6.464, -0.067]}>
            <mesh
              name="cart-frame016"
              castShadow
              receiveShadow
              geometry={nodes['cart-frame016'].geometry}
              material={materials['wheel-cart']}
              position={[0.2, -0.248, -0.101]}
              scale={[1.504, 0.935, 1.705]}
            />
          </group>
          <mesh
            name="frame-left"
            castShadow
            receiveShadow
            geometry={nodes['frame-left'].geometry}
            material={materials['big-metal']}
            position={[-0.055, -27.095, -0.018]}
          />
          <mesh
            name="frame-right"
            castShadow
            receiveShadow
            geometry={nodes['frame-right'].geometry}
            material={materials['big-metal']}
            position={[-0.055, -27.095, -0.018]}
          />
        </group>
        <mesh
          name="hold-center"
          castShadow
          receiveShadow
          geometry={nodes['hold-center'].geometry}
          material={materials['wheel-cart']}
          position={[-0.057, -3.164, -5.939]}
          scale={0.65}
        />
        <mesh
          name="hold-bottom"
          castShadow
          receiveShadow
          geometry={nodes['hold-bottom'].geometry}
          material={materials.metal}
          position={[-0.057, -3.124, -5.967]}
          scale={0.667}
        />
        <mesh
          name="hold-vertical-left-left"
          castShadow
          receiveShadow
          geometry={nodes['hold-vertical-left-left'].geometry}
          material={materials['big-metal']}
          position={[-0.057, -3.164, -5.939]}
          scale={0.65}
        />
        <mesh
          name="hold-vertical-left-right"
          castShadow
          receiveShadow
          geometry={nodes['hold-vertical-left-right'].geometry}
          material={materials['big-metal']}
          position={[-0.057, -3.164, -5.939]}
          scale={0.65}
        />
        <mesh
          name="hold-vertical-right-left"
          castShadow
          receiveShadow
          geometry={nodes['hold-vertical-right-left'].geometry}
          material={materials['big-metal']}
          position={[-0.057, -3.164, -5.939]}
          scale={0.65}
        />
        <mesh
          name="hold-vertical-right-right"
          castShadow
          receiveShadow
          geometry={nodes['hold-vertical-right-right'].geometry}
          material={materials['big-metal']}
          position={[-0.057, -3.164, -5.939]}
          scale={0.65}
        />
        <mesh
          name="cashier"
          castShadow
          receiveShadow
          geometry={nodes.cashier.geometry}
          material={materials['wheel-cart']}
          position={[-0.014, 1.604, 2.072]}
          scale={[1.019, 1.518, 1.019]}
        />
      </group>
    </group>
  )
}

useGLTF.preload('./model/winterfest-wheel.glb')