'use client';

import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';

const accretionVertexShader = `
    uniform float uTime;
    attribute float aRandom;
    attribute vec3 aColor;
    varying vec3 vColor;
    
    void main() {
        vColor = aColor;
        
        // Original attributes
        vec3 pos = position;
        
        // Calculate distance from center (radius in XZ plane)
        float r = length(pos.xz);
        
        // Differential rotation: faster near the center
        float speed = 3.0 / pow(r, 1.5);
        float angle = speed * uTime * 0.15;
        
        // Rotate in XZ plane
        float s = sin(angle);
        float c = cos(angle);
        
        float newX = pos.x * c - pos.z * s;
        float newZ = pos.x * s + pos.z * c;
        
        pos.x = newX;
        pos.z = newZ;
        
        // Add vertical wavy motion
        pos.y += sin(uTime * 2.0 + aRandom * 10.0) * 0.05 * clamp(r - 1.0, 0.0, 1.0);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size attenuation
        gl_PointSize = (8.0 * aRandom + 2.0) * (5.0 / -mvPosition.z);
    }
`;

const accretionFragmentShader = `
    varying vec3 vColor;
    
    void main() {
        // Point shape (circle with soft edges)
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float alpha = 1.0 - smoothstep(0.1, 0.5, distanceToCenter);
        
        if (alpha < 0.01) discard;
        
        gl_FragColor = vec4(vColor, alpha * 0.9);
    }
`;

function GPUParticleDisk({ innerRadius, outerRadius, particleCount, color1, color2 }: any) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const geometryData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);
    
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    
    for (let i = 0; i < particleCount; i++) {
        // Distribute more towards the inner radius
        const t = Math.pow(Math.random(), 1.5);
        const r = innerRadius + t * (outerRadius - innerRadius);
        const theta = Math.random() * Math.PI * 2;
        
        // Thickness depends on radius (bulges slightly or flat)
        const y = (Math.random() - 0.5) * 0.15 * (r - innerRadius + 0.5);
        
        positions[i * 3] = Math.cos(theta) * r;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(theta) * r;
        
        // Color gradient
        const mixColor = c1.clone().lerp(c2, t);
        // Dim outer edges
        mixColor.multiplyScalar(1.0 - t * 0.8);
        
        colors[i * 3] = mixColor.r;
        colors[i * 3 + 1] = mixColor.g;
        colors[i * 3 + 2] = mixColor.b;
        
        randoms[i] = Math.random();
    }
    
    return { positions, colors, randoms };
  }, [innerRadius, outerRadius, particleCount, color1, color2]);

  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={particleCount} array={geometryData.positions} itemSize={3} />
            <bufferAttribute attach="attributes-aColor" count={particleCount} array={geometryData.colors} itemSize={3} />
            <bufferAttribute attach="attributes-aRandom" count={particleCount} array={geometryData.randoms} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
            ref={materialRef}
            vertexShader={accretionVertexShader}
            fragmentShader={accretionFragmentShader}
            uniforms={{
                uTime: { value: 0 }
            }}
            transparent={true}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
        />
    </points>
  );
}

function BlackHole() {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(groupRef.current){
             // Slow tilt and pan
             groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1 + Math.PI / 6;
             groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.08) * 0.05 + Math.PI / 12;
        }
    });

    return (
        <group ref={groupRef}>
            {/* The Event Horizon */}
            <Sphere args={[1, 64, 64]}>
                <meshBasicMaterial color="black" />
            </Sphere>
            
            {/* Inner intense glow (Photon Ring / Corona) */}
            <Sphere args={[1.05, 32, 32]}>
                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </Sphere>
            <Sphere args={[1.15, 32, 32]}>
                <meshBasicMaterial color="#ffdd66" transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </Sphere>
            <Sphere args={[1.3, 32, 32]}>
                <meshBasicMaterial color="#ff5500" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </Sphere>

            {/* GPU Particle accretion disks */}
            {/* Inner hot dense disk */}
            <GPUParticleDisk 
                innerRadius={1.05} 
                outerRadius={2.5} 
                particleCount={25000} 
                color1="#ffffff" 
                color2="#ff8800" 
            />
            
            {/* Outer warm sparse disk */}
            <GPUParticleDisk 
                innerRadius={2.2} 
                outerRadius={6.0} 
                particleCount={25000} 
                color1="#ff5500" 
                color2="#220033" 
            />
            
            {/* Distant dust / particles */}
            <GPUParticleDisk 
                innerRadius={5.0} 
                outerRadius={10.0} 
                particleCount={5000} 
                color1="#442288" 
                color2="#050011" 
            />
            
            {/* Jet / Poles effect (optional subtle blue ring rotated) */}
            <group rotation={[Math.PI/2, 0, 0]}>
                <GPUParticleDisk 
                    innerRadius={1.0} 
                    outerRadius={4.0} 
                    particleCount={5000} 
                    color1="#4422ff" 
                    color2="#000022" 
                />
            </group>
        </group>
    );
}

export default function BlackholeBackground() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', background: '#020005' }}>
            <Canvas camera={{ position: [0, 1.5, 7], fov: 60 }}>
                <color attach="background" args={['#010002']} />
                {/* Background stars slowly rotating over time can be done by wrapping in a group, but Stars is fine */}
                <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
                <BlackHole />
            </Canvas>
        </div>
    );
}
