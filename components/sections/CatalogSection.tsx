'use client';

import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { catalogItems } from '@/lib/catalogData';
import { useScrollStore } from '@/lib/store';
import { useRef, useState } from 'react';

export default function CatalogSection() {
  const { setActiveItemId } = useScrollStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this section (0 to 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Calculate active index from scroll progress
  const activeIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, catalogItems.length - 1]
  );

  // Get the actual numeric value for activeIndex
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);

  // Listen to scroll progress changes
  useMotionValueEvent(activeIndex, 'change', (latest) => {
    const index = Math.round(latest);
    const clampedIndex = Math.max(0, Math.min(index, catalogItems.length - 1));
    setCurrentActiveIndex(clampedIndex);
    
    // Sync with 3D scene
    if (catalogItems[clampedIndex]) {
      setActiveItemId(catalogItems[clampedIndex].id);
    }
  });


  return (
    <section
      id="catalog"
      ref={sectionRef}
      className="relative bg-gradient-to-b from-transparent via-black/30 to-black/50"
      style={{ minHeight: `${catalogItems.length * 100}vh` }}
    >
      {/* Empty section - scroll tracking only. All cards are now rendered in 3D scene via OrbitCardRail */}
      <div ref={containerRef} className="sticky top-0 h-screen" />
    </section>
  );
}

