'use client';

import { motion } from 'framer-motion';
import { catalogItems } from '@/lib/catalogData';
import CatalogCard from '@/components/ui/CatalogCard';
import { useScrollStore } from '@/lib/store';
import { useEffect, useRef } from 'react';

export default function CatalogSection() {
  const { setActiveItemId } = useScrollStore();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Set first item as active when section is visible
            if (catalogItems[0]) {
              setActiveItemId(catalogItems[0].id);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [setActiveItemId]);

  return (
    <section id="catalog" className="relative bg-gradient-to-b from-transparent via-black/30 to-black/50 py-20 md:py-32">
      <div ref={sectionRef} className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore Experiences
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-white/60 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse our immersive 3D projects and concepts.
          </motion.p>
        </motion.div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {catalogItems.map((item, index) => (
            <CatalogCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

