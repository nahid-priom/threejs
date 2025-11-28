'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Group, MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { cardItems } from '@/lib/catalogData';
import { GlassyCardMaterial } from './GradientMaterial';

/**
 * MainHeroCardMesh - Large front card that always faces the camera
 * Uses the first card item as the main hero card
 * Features procedural gradient material and text overlay
 */
function MainHeroCardMesh() {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const titleGroupRef = useRef<Group>(null);
  const subtitleGroupRef = useRef<Group>(null);
  const { camera } = useThree();
  const mainCard = cardItems[0]; // Use first card as main hero

  // Intro animation state
  const [introProgress, setIntroProgress] = useState(0);

  useEffect(() => {
    // Animate intro
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / 1.2, 1); // 1.2s intro
      setIntroProgress(progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, []);

  useFrame(() => {
    if (meshRef.current && glowRef.current) {
      // Always face the camera (billboard effect)
      meshRef.current.lookAt(camera.position);
      glowRef.current.lookAt(camera.position);

      // Subtle scale animation for premium feel
      const time = Date.now() * 0.001;
      const scale = 1 + Math.sin(time * 0.5) * 0.01;
      meshRef.current.scale.setScalar(scale);
    }
    if (titleGroupRef.current) {
      titleGroupRef.current.lookAt(camera.position);
    }
    if (subtitleGroupRef.current) {
      subtitleGroupRef.current.lookAt(camera.position);
    }
  });

  const aspectRatio = 16 / 9; // Standard card aspect ratio
  const width = 4;
  const height = width / aspectRatio;

  // Intro animation values
  const introScale = 0.8 + introProgress * 0.2;
  const introOpacity = introProgress;
  const introY = (1 - introProgress) * 0.3;

  // Create materials for text with opacity support (created once, updated in useFrame)
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
    <group position={[0, introY, 2.5]}>
      {/* Main card plane with procedural gradient */}
      <mesh ref={meshRef} scale={introScale}>
        <planeGeometry args={[width, height, 32, 32]} />
        <GlassyCardMaterial
          mainColor={mainCard.mainColor}
          accentColor={mainCard.accentColor}
          emissiveIntensity={0.3}
          opacity={0.95 * introOpacity}
        />
      </mesh>

      {/* Text overlay - Title */}
      <group ref={titleGroupRef} position={[0, 0.3, 0.01]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.4}
          color={mainCard.accentColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          material={titleMaterial}
        >
          {mainCard.title}
        </Text>
      </group>

      {/* Text overlay - Subtitle */}
      <group ref={subtitleGroupRef} position={[0, -0.1, 0.01]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.18}
          color={mainCard.accentColor}
          anchorX="center"
          anchorY="middle"
          material={subtitleMaterial}
        >
          {mainCard.subtitle}
        </Text>
      </group>

      {/* Glowing edge effect */}
      <mesh ref={glowRef} scale={introScale}>
        <planeGeometry args={[width * 1.05, height * 1.05]} />
        <meshStandardMaterial
          color={mainCard.accentColor}
          emissive={mainCard.accentColor}
          emissiveIntensity={0.6}
          transparent
          opacity={0.2 * introOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Additional rim light glow */}
      <mesh ref={glowRef} scale={introScale}>
        <planeGeometry args={[width * 1.1, height * 1.1]} />
        <meshStandardMaterial
          color={mainCard.accentColor}
          emissive={mainCard.accentColor}
          emissiveIntensity={0.4}
          transparent
          opacity={0.1 * introOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function MainHeroCard() {
  return <MainHeroCardMesh />;
}
