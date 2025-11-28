'use client';

import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { CatalogItem } from '@/lib/catalogData';
import OrbitCard from './OrbitCard';

interface OrbitCardRailProps {
  items: CatalogItem[];
  scrollProgress: number; // 0–1 from scroll rig
}

/**
 * OrbitCardRail - Creates a helix/snake path of cards around the skeleton
 * 
 * Cards are positioned along a parametric helix curve:
 * - Radius: 2.5–3.5 units around the skeleton
 * - Vertical span: Cards slowly rise/fall as they orbit
 * - Scroll-driven: scrollProgress shifts all cards along the helix
 * 
 * The card closest to the front (facing camera) is marked as active
 */
export default function OrbitCardRail({ items, scrollProgress }: OrbitCardRailProps) {
  // Helix path parameters
  const radius = 3.0; // Base radius around skeleton
  const radiusVariation = 0.3; // Slight variation for depth
  const baseY = 0; // Center Y position
  const verticalSpan = 2.5; // Total vertical range
  const totalRotation = Math.PI * 2.5; // 1.25 full rotations for snake effect

  // Calculate positions for each card
  const cardPositions = useMemo(() => {
    return items.map((item, i) => {
      // Compute t value: index-based position + scroll offset
      // This creates the snake effect as scrollProgress changes
      // Map scroll progress to 1.5 rotations for smooth snake motion
      const scrollOffset = scrollProgress * 1.5; // 1.5 full rotations over scroll
      const t = ((i / items.length) + scrollOffset) % 1;
      
      // Parametric helix function
      const angle = t * totalRotation;
      const currentRadius = radius + Math.sin(t * Math.PI * 4) * radiusVariation;
      
      const x = currentRadius * Math.cos(angle);
      const z = currentRadius * Math.sin(angle);
      const y = baseY + (t - 0.5) * verticalSpan; // Center around baseY
      
      const position = new Vector3(x, y, z);
      
      // Calculate forward-facing factor (how much the card faces the camera)
      // Cards with angle near 0 or 2π are facing forward (toward positive z)
      // Camera is typically at [0, 0, 8], so cards with positive z are closer
      const forwardFactor = Math.cos(angle); // 1 when angle=0 (facing forward), -1 when angle=π (facing back)
      
      return {
        position,
        rotation: angle,
        zDistance: z, // Z distance from origin (positive = closer to camera)
        forwardFactor,
      };
    });
  }, [items, scrollProgress, radius, radiusVariation, baseY, verticalSpan, totalRotation]);

  // Determine active card index
  // Active card is the one closest to camera (highest z) AND facing forward
  const activeIndex = useMemo(() => {
    let maxScore = -Infinity;
    let activeIdx = 0;
    
    cardPositions.forEach((card, i) => {
      // Score combines:
      // 1. Z distance (higher z = closer to camera at [0,0,8])
      // 2. Forward-facing factor (facing camera = higher score)
      const zScore = card.zDistance; // Positive z = closer to camera
      const forwardScore = card.forwardFactor; // 1 when facing forward, -1 when facing back
      const combinedScore = zScore * 0.7 + forwardScore * 1.5; // Weighted combination
      
      if (combinedScore > maxScore) {
        maxScore = combinedScore;
        activeIdx = i;
      }
    });
    
    return activeIdx;
  }, [cardPositions]);

  return (
    <group>
      {items.map((item, i) => {
        const cardData = cardPositions[i];
        if (!cardData) return null;
        
        return (
          <OrbitCard
            key={item.id}
            item={item}
            isActive={i === activeIndex}
            position={cardData.position}
            rotation={cardData.rotation}
          />
        );
      })}
    </group>
  );
}

