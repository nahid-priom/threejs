'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="mx-auto max-w-7xl flex items-center justify-between"
        animate={{
          backgroundColor: scrolled ? 'rgba(10, 10, 15, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-8">
          <a href="#" className="text-white font-bold text-xl">
            CodLinker
          </a>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#work" className="text-white/80 hover:text-white transition-colors">
              Work
            </a>
            <a href="#catalog" className="text-white/80 hover:text-white transition-colors">
              Catalog
            </a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        <motion.button
          className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book a Demo
        </motion.button>
      </motion.div>
    </motion.nav>
  );
}

