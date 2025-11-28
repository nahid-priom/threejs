'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import SkeletonScene from './SkeletonScene';
import OrbitingCards from './OrbitingCards';
import MainHeroCard from './MainHeroCard';
import ScrollRig from './ScrollRig';
import ParticleField from './ParticleField';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useScrollStore } from '@/lib/store';

/**
 * MouseParallaxRig - Handles mouse movement for subtle parallax effects
 */
function MouseParallaxRig() {
  const { setMousePosition } = useScrollStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePosition]);

  return null;
}

/**
 * ParallaxCamera - Applies subtle camera tilt based on mouse position
 */
function ParallaxCamera() {
  const { camera } = useThree();
  const { mouseX, mouseY } = useScrollStore();

  useFrame(() => {
    // Subtle camera tilt based on mouse - limited to prevent chaos
    const maxTilt = 0.3; // Maximum tilt in radians
    const targetRotationX = mouseY * maxTilt * 0.5;
    const targetRotationY = mouseX * maxTilt * 0.5;

    // Smooth interpolation
    camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;
  });

  return null;
}

/**
 * PostProcessingEffects - Post-processing effects wrapper
 * Wrapped in Suspense and conditionally rendered to avoid initialization errors
 */
function PostProcessingEffects() {
  const { gl, scene, camera } = useThree();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for renderer and scene to be fully initialized
    if (gl && scene && camera) {
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        setReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [gl, scene, camera]);

  if (!ready) return null;

  return (
    <EffectComposer>
      {/* Bloom for glowing edges and emissive materials */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
      />
    </EffectComposer>
  );
}

export default function ThreeHeroCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
        frameloop="always"
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        
        {/* Enhanced lighting setup for premium feel */}
        <ambientLight intensity={0.4} color="#1a1a2e" />
        
        {/* Main key light - soft and warm */}
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          color="#ffffff"
          castShadow
        />
        
        {/* Colored rim lights for depth */}
        <pointLight position={[6, 4, 6]} intensity={1.0} color="#8EE6FF" />
        <pointLight position={[-6, -4, 6]} intensity={0.8} color="#A78BFA" />
        
        {/* Subtle fill light */}
        <pointLight position={[0, -5, 3]} intensity={0.5} color="#4a4a6e" />
        
        {/* Dark environment backdrop */}
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 5, 25]} />
        
        {/* Environment for reflections */}
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>
        
        {/* Main scene components - skeleton only, cards hidden */}
        <Suspense fallback={null}>
          <SkeletonScene />
          {/* Cards hidden to simplify hero */}
          {/* <MainHeroCard /> */}
          {/* <OrbitingCards /> */}
          <ParticleField />
        </Suspense>
        
        <ScrollRig />
        <MouseParallaxRig />
        <ParallaxCamera />
        
        {/* Post-processing effects - temporarily disabled due to initialization issues */}
        {/* Uncomment when postprocessing library is fixed or updated */}
        {/* <Suspense fallback={null}>
          <PostProcessingEffects />
        </Suspense> */}
      </Canvas>
    </div>
  );
}
