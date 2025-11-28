import { catalogItems } from './catalogData';

export const SCROLL_SECTION_HEIGHT = 100; // vh units
export const TOTAL_SCROLL_HEIGHT = catalogItems.length * SCROLL_SECTION_HEIGHT;

// Calculate which catalog item should be active based on scroll progress
export function getActiveItemIndex(scrollProgress: number): number {
  const clamped = Math.max(0, Math.min(1, scrollProgress));
  const index = Math.floor(clamped * catalogItems.length);
  return Math.min(index, catalogItems.length - 1);
}

// Map scroll to camera orbit angle (more subtle rotation)
export function scrollToOrbitAngle(scrollProgress: number): number {
  // Reduced rotation for subtlety - 180° max over entire scroll
  return scrollProgress * Math.PI;
}

// Map scroll to camera distance (zoom in/out)
export function scrollToCameraDistance(scrollProgress: number): number {
  // More subtle zoom - start at 8, slight zoom to 7, then back
  const phase = scrollProgress * Math.PI * 2;
  return 7.5 + Math.sin(phase * 0.5) * 0.8;
}

// Map scroll to skeleton rotation offset
export function scrollToSkeletonRotation(scrollProgress: number): number {
  // Skeleton rotates slower and more subtly
  return scrollProgress * Math.PI * 0.3;
}

