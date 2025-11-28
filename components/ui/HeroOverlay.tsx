'use client';

import { motion } from 'framer-motion';

export default function HeroOverlay() {
  const handleExploreClick = () => {
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWatchVideoClick = () => {
    // Scroll to video section if it exists, or open video modal
    const videoSection = document.getElementById('video') || document.getElementById('about');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center md:items-center pt-20 md:pt-0">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Glass panel background for readability */}
        <motion.div
          className="relative bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Label */}
            <motion.p
              className="text-sm text-white/60 uppercase tracking-wider mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Immersive 3D Catalog
            </motion.p>

            {/* Main heading */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Experience the
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Future of Web
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-base md:text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              A cinematic narrative where the camera orbits around a living structural spine,
              revealing layered content panels that respond to your journey through our catalog.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                onClick={handleExploreClick}
                className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg shadow-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Experiences
              </motion.button>
              <motion.button
                onClick={handleWatchVideoClick}
                className="px-8 py-3 border-2 border-white/80 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Video
              </motion.button>
            </motion.div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(142, 230, 255, 0.1) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
