import { create } from 'zustand';

interface ScrollState {
  scrollProgress: number;
  activeItemId: string | null;
  cameraOrbitAngle: number;
  cameraDistance: number;
  skeletonRotation: number;
  mouseX: number;
  mouseY: number;
  setScrollProgress: (progress: number) => void;
  setActiveItemId: (id: string | null) => void;
  setCameraOrbitAngle: (angle: number) => void;
  setCameraDistance: (distance: number) => void;
  setSkeletonRotation: (rotation: number) => void;
  setMousePosition: (x: number, y: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollProgress: 0,
  activeItemId: null,
  cameraOrbitAngle: 0,
  cameraDistance: 8,
  skeletonRotation: 0,
  mouseX: 0,
  mouseY: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveItemId: (id) => set({ activeItemId: id }),
  setCameraOrbitAngle: (angle) => set({ cameraOrbitAngle: angle }),
  setCameraDistance: (distance) => set({ cameraDistance: distance }),
  setSkeletonRotation: (rotation) => set({ skeletonRotation: rotation }),
  setMousePosition: (x, y) => set({ mouseX: x, mouseY: y }),
}));

