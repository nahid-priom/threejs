'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useScrollStore } from '@/lib/store';
import {
  scrollToOrbitAngle,
  scrollToCameraDistance,
  scrollToSkeletonRotation,
  getActiveItemIndex,
} from '@/lib/scrollSections';
import { catalogItems } from '@/lib/catalogData';

export default function ScrollRig() {
  const { camera } = useThree();
  const {
    setScrollProgress,
    setActiveItemId,
    setCameraOrbitAngle,
    setCameraDistance,
    setSkeletonRotation,
    cameraOrbitAngle,
    cameraDistance,
  } = useScrollStore();

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) over the scrollable area
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

      setScrollProgress(progress);

      // Map scroll to camera and skeleton transformations
      const orbitAngle = scrollToOrbitAngle(progress);
      const distance = scrollToCameraDistance(progress);
      const skeletonRot = scrollToSkeletonRotation(progress);

      setCameraOrbitAngle(orbitAngle);
      setCameraDistance(distance);
      setSkeletonRotation(skeletonRot);

      // Update active item based on scroll
      const activeIndex = getActiveItemIndex(progress);
      setActiveItemId(catalogItems[activeIndex]?.id || null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress, setActiveItemId, setCameraOrbitAngle, setCameraDistance, setSkeletonRotation]);

  useFrame(() => {
    // Smoothly interpolate camera position based on scroll state
    // Camera orbits around skeleton at origin - more subtle movement
    const targetX = Math.cos(cameraOrbitAngle) * cameraDistance;
    const targetZ = Math.sin(cameraOrbitAngle) * cameraDistance;
    const targetY = Math.sin(cameraOrbitAngle * 0.5) * 0.8; // Reduced vertical tilt

    // Smooth camera movement with slower interpolation for subtlety
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    // Camera always looks at the skeleton (origin)
    camera.lookAt(0, 0, 0);
  });

  return null;
}

