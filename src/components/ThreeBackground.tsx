'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingNode({ position, color, speed = 1 }: any) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={1.5} floatIntensity={2} position={position}>
      <Icosahedron ref={ref as any} args={[1, 1]}>
        <meshStandardMaterial color={color} wireframe transparent opacity={0.3} />
      </Icosahedron>
      <Sphere args={[0.2, 32, 32]}>
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.8} distort={0.6} speed={3} />
      </Sphere>
    </Float>
  );
}

export default function ThreeBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#f8fafc' }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 40 }} dpr={[1, 2]}>
        <fog attach="fog" args={['#f8fafc', 5, 40]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} color="#4f46e5" intensity={5} />
        <pointLight position={[10, 5, -10]} color="#ec4899" intensity={5} />
        
        {/* Infinite nodes array */}
        {Array.from({ length: 50 }).map((_, i) => (
          <FloatingNode 
            key={i} 
            position={[
              (Math.random() - 0.5) * 45, 
              (Math.random() - 0.5) * 35, 
              (Math.random() - 0.5) * 20 - 5
            ]} 
            color={Math.random() > 0.6 ? '#6366f1' : Math.random() > 0.5 ? '#ec4899' : '#06b6d4'}
            speed={Math.random() * 0.8 + 0.2}
          />
        ))}
      </Canvas>
    </div>
  );
}
