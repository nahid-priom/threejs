'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointsMaterial } from 'three';
import * as THREE from 'three';

export default function ParticleField() {
  const pointsRef = useRef<Points>(null);

  // Create particle system
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Random positions in a sphere
    positions[i3] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 20;

    // Random velocities for drift
    velocities[i3] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
  }

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      // Update particle positions with slow drift
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3] * delta * 10;
        positions[i3 + 1] += velocities[i3 + 1] * delta * 10;
        positions[i3 + 2] += velocities[i3 + 2] * delta * 10;

        // Wrap around if out of bounds
        if (Math.abs(positions[i3]) > 10) velocities[i3] *= -1;
        if (Math.abs(positions[i3 + 1]) > 10) velocities[i3 + 1] *= -1;
        if (Math.abs(positions[i3 + 2]) > 10) velocities[i3 + 2] *= -1;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8EE6FF"
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}

