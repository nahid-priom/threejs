'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Mesh, Vector3 } from 'three';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { CatalogItem } from '@/lib/catalogData';

interface OrbitCardProps {
  item: CatalogItem;
  isActive: boolean;
  position: Vector3;
  rotation: number; // Angle in radians for orientation
}

/**
 * OrbitCard - Individual 3D card component with active/inactive states and hover animations
 * 
 * Active cards show full text content using Html overlay
 * Inactive cards are dimmer and don't show text to reduce clutter
 */
export default function OrbitCard({ item, isActive, position, rotation }: OrbitCardProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);

  // Animation state
  const scaleRef = useRef(1);
  const opacityRef = useRef(0.6);
  const zOffsetRef = useRef(0);
  const hoverTiltRef = useRef({ x: 0, y: 0 });

  // Create gradient texture for card material
  const gradientTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Enhanced gradient for better visibility
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(0.3, item.accentColor + '40'); // More visible accent
    gradient.addColorStop(0.5, item.accentColor + '60');
    gradient.addColorStop(0.7, item.accentColor + '40');
    gradient.addColorStop(1, '#0a0a0f');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    return texture;
  }, [item.accentColor]);

  // Create material with gradient - enhanced for active cards
  const cardMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: gradientTexture || undefined,
      color: isActive ? '#ffffff' : '#0a0a0f',
      emissive: item.accentColor,
      emissiveIntensity: isActive ? 0.4 : 0.1,
      transparent: true,
      opacity: isActive ? 0.95 : 0.25,
      metalness: 0.7,
      roughness: 0.2,
      envMapIntensity: isActive ? 2.5 : 0.8,
      depthWrite: true,
      depthTest: true,
    });
    return material;
  }, [gradientTexture, item.accentColor, isActive]);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current || !glowRef.current) return;

    // Target values based on active state
    const targetScale = isActive ? 1.2 : 1.0;
    const targetOpacity = isActive ? 0.95 : 0.25;
    const targetZOffset = isActive ? 0.8 : 0; // Active card comes further forward
    const targetEmissiveIntensity = isActive ? 0.7 : 0.08;

    // Hover effects (only on active card)
    const hoverScale = hovered && isActive ? 1.05 : 1.0;
    const hoverOpacity = hovered && isActive ? 0.03 : 0;
    const hoverEmissive = hovered && isActive ? 0.2 : 0;

    // Smooth interpolation for all properties
    const lerpSpeed = 0.15;
    scaleRef.current += (targetScale * hoverScale - scaleRef.current) * lerpSpeed;
    opacityRef.current += (targetOpacity + hoverOpacity - opacityRef.current) * lerpSpeed;
    zOffsetRef.current += (targetZOffset - zOffsetRef.current) * lerpSpeed;

    // Apply transforms
    groupRef.current.position.copy(position);
    groupRef.current.position.z += zOffsetRef.current;
    meshRef.current.scale.setScalar(scaleRef.current);
    glowRef.current.scale.setScalar(scaleRef.current * 1.05);

    // Face camera with slight rotation based on position
    const lookAtTarget = new Vector3(0, position.y * 0.3, 0);
    groupRef.current.lookAt(lookAtTarget);
    
    // Add subtle tilt based on rotation angle
    groupRef.current.rotation.z = Math.sin(rotation) * 0.1;
    groupRef.current.rotation.x = Math.cos(rotation) * 0.05;

    // Hover tilt effect (only on active card)
    if (hovered && isActive) {
      const mouse = state.pointer;
      hoverTiltRef.current.x += (mouse.y * 0.08 - hoverTiltRef.current.x) * 0.2;
      hoverTiltRef.current.y += (mouse.x * 0.08 - hoverTiltRef.current.y) * 0.2;
    } else {
      hoverTiltRef.current.x += (0 - hoverTiltRef.current.x) * 0.2;
      hoverTiltRef.current.y += (0 - hoverTiltRef.current.y) * 0.2;
    }
    groupRef.current.rotation.x += hoverTiltRef.current.x;
    groupRef.current.rotation.y += hoverTiltRef.current.y;

    // Update material properties directly for better active card visibility
    cardMaterial.opacity = opacityRef.current;
    cardMaterial.emissiveIntensity = targetEmissiveIntensity + hoverEmissive;
    cardMaterial.envMapIntensity = isActive ? 2.5 : 0.8;
    
    // Enhance color for active card
    if (isActive) {
      cardMaterial.color.setHex(0xffffff);
    } else {
      cardMaterial.color.setHex(0x0a0a0f);
    }

    // Update glow material
    if (glowRef.current.material) {
      const glowMaterial = glowRef.current.material as THREE.MeshStandardMaterial;
      glowMaterial.opacity = isActive ? 0.5 : 0.05;
      glowMaterial.emissiveIntensity = targetEmissiveIntensity + hoverEmissive;
    }
  });

  // Card dimensions
  const aspectRatio = 16 / 9;
  const width = 2.5;
  const height = width / aspectRatio;

  // Mobile detection for responsive text sizing
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => isActive && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main card plane with gradient material */}
      <mesh ref={meshRef} material={cardMaterial}>
        <planeGeometry args={[width, height, 32, 32]} />
      </mesh>

      {/* Glowing edge effect - behind card */}
      <mesh ref={glowRef} position={[0, 0, -0.01]}>
        <planeGeometry args={[width * 1.05, height * 1.05]} />
        <meshStandardMaterial
          color={item.accentColor}
          emissive={item.accentColor}
          emissiveIntensity={isActive ? 1.0 : 0.1}
          transparent
          opacity={isActive ? 0.5 : 0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Full content using Html for active card - positioned on light accessible panel */}
      {isActive && (
        <Html
          position={[0, 0, 0.02]}
          transform
          occlude={false}
          distanceFactor={isMobile ? 1.2 : 1.1}
          style={{
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
          }}
          center
          zIndexRange={[1000, 0]}
          sprite={false}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-[80%] max-w-[640px]">
              <div 
                className="rounded-2xl bg-slate-50/95 shadow-[0_18px_45px_rgba(15,23,42,0.45)] border border-slate-200 px-6 py-5 md:px-8 md:py-6 backdrop-blur-sm"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  boxShadow: `0 18px 45px rgba(15,23,42,0.45), 0 0 20px ${item.accentColor}15`,
                }}
              >
                {/* Subtitle */}
                <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-slate-600 mb-2 md:mb-3 font-medium">
                  {item.subtitle}
                </p>

                {/* Title */}
                <h3
                  className="text-xl md:text-2xl font-semibold text-slate-900 mb-2 md:mb-3 leading-tight"
                  style={{ 
                    textShadow: `0 0 8px ${item.accentColor}30, 0 2px 4px rgba(0,0,0,0.1)`,
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-3 md:mb-4 max-w-[480px]">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-300 bg-slate-100 px-3 py-[4px] md:py-1 text-[11px] md:text-xs font-medium text-slate-800 uppercase tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

