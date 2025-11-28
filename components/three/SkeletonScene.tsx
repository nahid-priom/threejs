'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { useScrollStore } from '@/lib/store';

/**
 * ProceduralSkeleton - Enhanced procedural skeleton with premium glow
 * This is the fallback that always renders
 */
function ProceduralSkeleton() {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const { skeletonRotation } = useScrollStore();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Base rotation speed: ~12 seconds per 360° (0.05 rad/s)
      const baseRotation = delta * 0.05;
      // Add scroll-driven offset with smooth interpolation
      groupRef.current.rotation.y += baseRotation + (skeletonRotation - groupRef.current.rotation.y) * 0.1;
    }

    // Subtle "breathing" motion - vertical float using sin wave
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.15;
      // Very subtle scale pulsing for premium feel
      const scale = 1 + Math.sin(time * 0.6) * 0.02;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {/* Main spine column - reduced intensity */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 4.5, 16]} />
        <meshStandardMaterial
          color="#8EE6FF"
          emissive="#8EE6FF"
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Reduced branching structures - fewer and softer */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const height = (i % 5) * 0.9 - 1.8;
        const radius = 0.5 + Math.sin(i * 0.5) * 0.2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}
            rotation={[0, angle, Math.PI / 4]}
          >
            <boxGeometry args={[0.08, 0.6, 0.08]} />
            <meshStandardMaterial
              color="#A78BFA"
              emissive="#A78BFA"
              emissiveIntensity={0.1}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}

      {/* Softer glowing core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#8EE6FF"
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#8EE6FF"
          emissive="#8EE6FF"
          emissiveIntensity={0.1}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

export default function SkeletonScene() {
  return <ProceduralSkeleton />;
}
