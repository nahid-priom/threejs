'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * GradientMaterial - Procedural gradient material for cards
 * Creates a vertical gradient from mainColor to accentColor with glassy properties
 */
export function GradientMaterial({
  mainColor,
  accentColor,
  emissiveIntensity = 0.2,
  opacity = 0.95,
  hovered = false,
}: {
  mainColor: string;
  accentColor: string;
  emissiveIntensity?: number;
  opacity?: number;
  hovered?: boolean;
}) {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        mainColor: { value: new THREE.Color(mainColor) },
        accentColor: { value: new THREE.Color(accentColor) },
        time: { value: 0 },
        hoverIntensity: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 mainColor;
        uniform vec3 accentColor;
        uniform float time;
        uniform float hoverIntensity;
        varying vec2 vUv;
        
        void main() {
          // Vertical gradient from top (mainColor) to bottom (accentColor)
          float gradientFactor = vUv.y;
          
          // Add subtle noise for texture
          float noise = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time * 0.7) * 0.02;
          
          // Mix colors with gradient
          vec3 color = mix(mainColor, accentColor, gradientFactor + noise);
          
          // Add hover glow
          float edgeGlow = smoothstep(0.0, 0.1, min(vUv.x, 1.0 - vUv.x)) * 
                          smoothstep(0.0, 0.1, min(vUv.y, 1.0 - vUv.y));
          color += accentColor * hoverIntensity * (1.0 - edgeGlow) * 0.3;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
    });
  }, [mainColor, accentColor, opacity]);

  useFrame((state) => {
    if (shaderMaterial.uniforms) {
      shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.hoverIntensity.value = hovered ? 1.0 : 0.0;
    }
  });

  return <primitive object={shaderMaterial} attach="material" />;
}

/**
 * GlassyCardMaterial - Standard material with procedural gradient texture and glassy properties
 * Creates a canvas-based gradient texture for reliable rendering
 */
export function GlassyCardMaterial({
  mainColor,
  accentColor,
  emissiveIntensity = 0.2,
  opacity = 0.95,
  hovered = false,
}: {
  mainColor: string;
  accentColor: string;
  emissiveIntensity?: number;
  opacity?: number;
  hovered?: boolean;
}) {
  const gradientTexture = useMemo(() => {
    // Safety check for browser environment
    if (typeof document === 'undefined') return null;
    
    // Create canvas for gradient
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Create vertical gradient from mainColor (top) to accentColor (bottom)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, mainColor);
    gradient.addColorStop(0.5, accentColor);
    gradient.addColorStop(1, mainColor); // Slight return to mainColor at bottom for depth

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle noise/pattern for texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 10;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }
    ctx.putImageData(imageData, 0, 0);

    // Create Three.js texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    return texture;
  }, [mainColor, accentColor]);

  return (
    <meshStandardMaterial
      map={gradientTexture || undefined}
      color={gradientTexture ? '#ffffff' : mainColor}
      emissive={accentColor}
      emissiveIntensity={hovered ? emissiveIntensity * 1.5 : emissiveIntensity}
      transparent
      opacity={hovered ? Math.min(opacity + 0.05, 1) : opacity}
      metalness={0.8}
      roughness={0.1}
      envMapIntensity={1.5}
    />
  );
}

