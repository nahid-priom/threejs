'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { cardItems } from '@/lib/catalogData';
import { useScrollStore } from '@/lib/store';
import { GlassyCardMaterial } from './GradientMaterial';

/**
 * Single orbiting card component with procedural gradient material, text, and hover effects
 */
function OrbitingCard({ card, index, totalCards }: { card: typeof cardItems[0]; index: number; totalCards: number }) {
  const cardRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const titleGroupRef = useRef<Group>(null);
  const subtitleGroupRef = useRef<Group>(null);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);

  // Calculate orbital position
  const radius = 4 + (index % 3) * 0.5; // Vary radius for depth
  const verticalOffset = ((index % 5) - 2) * 0.6; // Distribute vertically
  const baseAngle = (index / totalCards) * Math.PI * 2;

  // Intro animation with stagger
  useEffect(() => {
    const startTime = Date.now() + index * 100; // Stagger by 100ms per card
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.max(0, Math.min(elapsed / 1.0, 1)); // 1s intro per card
      setIntroProgress(progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [index]);

  useFrame((state, delta) => {
    if (!cardRef.current || !meshRef.current || !glowRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Continuous orbital rotation around Y axis
    const orbitSpeed = 0.1; // Slow, cinematic rotation
    const angle = baseAngle + time * orbitSpeed;
    
    // Calculate position in orbit
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const baseY = verticalOffset + Math.sin(time * 0.4 + index) * 0.3; // Subtle vertical float
    const introYOffset = (1 - introProgress) * 0.3; // Intro animation offset
    const y = baseY + introYOffset;

    cardRef.current.position.set(x, y, z);

    // Face camera with slight offset for depth
    const lookAtTarget = new THREE.Vector3(0, y * 0.5, 0);
    cardRef.current.lookAt(lookAtTarget);

    // Subtle tilt based on position in orbit (clamped for elegance)
    cardRef.current.rotation.z = Math.sin(angle) * 0.1;
    cardRef.current.rotation.x = Math.cos(angle) * 0.05;

    // Hover effect: scale and glow
    const targetScale = hovered ? 1.05 : 1;
    const currentScale = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * 0.1);
    
    // Update glow intensity
    if (glowRef.current.material) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      const targetIntensity = hovered ? 0.8 : 0.3;
      material.emissiveIntensity = material.emissiveIntensity + (targetIntensity - material.emissiveIntensity) * 0.1;
    }

    // Make text groups face camera
    if (titleGroupRef.current) {
      titleGroupRef.current.lookAt(camera.position);
    }
    if (subtitleGroupRef.current) {
      subtitleGroupRef.current.lookAt(camera.position);
    }
  });

  const aspectRatio = 16 / 9;
  const width = 2.2;
  const height = width / aspectRatio;

  // Intro animation values
  const introScale = 0.8 + introProgress * 0.2;
  const introOpacity = introProgress;

  // Create materials for text with opacity support
  const titleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: introOpacity,
      }),
    [introOpacity]
  );
  const subtitleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.8 * introOpacity,
      }),
    [introOpacity]
  );

  return (
    <group
      ref={cardRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main card plane with procedural gradient */}
      <mesh ref={meshRef} scale={introScale}>
        <planeGeometry args={[width, height, 32, 32]} />
        <GlassyCardMaterial
          mainColor={card.mainColor}
          accentColor={card.accentColor}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          opacity={hovered ? 0.95 : 0.75}
          hovered={hovered}
        />
      </mesh>

      {/* Text overlay - Title */}
      <group ref={titleGroupRef} position={[0, 0.15, 0.01]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.22}
          color={card.accentColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
          material={titleMaterial}
        >
          {card.title}
        </Text>
      </group>

      {/* Text overlay - Subtitle */}
      <group ref={subtitleGroupRef} position={[0, -0.08, 0.01]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.1}
          color={card.accentColor}
          anchorX="center"
          anchorY="middle"
          material={subtitleMaterial}
        >
          {card.subtitle}
        </Text>
      </group>

      {/* Glowing edge effect */}
      <mesh ref={glowRef} scale={introScale}>
        <planeGeometry args={[width * 1.05, height * 1.05]} />
        <meshStandardMaterial
          color={card.accentColor}
          emissive={card.accentColor}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          transparent
          opacity={hovered ? 0.3 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * OrbitingCards - Container for all orbiting cards
 * Creates a group that rotates around the skeleton
 */
export default function OrbitingCards() {
  // Use all cards except the first one (which is the main hero card)
  const orbitingCards = cardItems.slice(1);

  return (
    <group>
      {orbitingCards.map((card, index) => (
        <OrbitingCard key={card.id} card={card} index={index} totalCards={orbitingCards.length} />
      ))}
    </group>
  );
}
