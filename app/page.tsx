'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/ui/Navbar';
import HeroOverlay from '@/components/ui/HeroOverlay';
import CatalogSection from '@/components/sections/CatalogSection';
import AboutSection from '@/components/sections/AboutSection';
import CTASection from '@/components/sections/CTASection';

// Lazy load the 3D canvas for better performance
const ThreeHeroCanvas = dynamic(() => import('@/components/three/ThreeHeroCanvas'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#0a0a0f]" />,
});

export default function Home() {
  return (
    <main className="relative">
      {/* 3D Hero Canvas - Full viewport background */}
      <ThreeHeroCanvas />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Overlay */}
      <section id="work" className="relative min-h-screen">
        <HeroOverlay />
      </section>

      {/* Catalog Sections */}
      <CatalogSection />

      {/* About Section */}
      <AboutSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}

