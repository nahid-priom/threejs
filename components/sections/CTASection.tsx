'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-black/50 to-black">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to Create Something Amazing?
        </h2>
        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
          Let's discuss how we can bring your vision to life with immersive 3D experiences and
          cutting-edge web technology.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book a Demo
          </motion.button>
          <motion.button
            className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </div>
        <motion.div
          className="mt-16 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-white/60">
            © 2024 CodLinker. Built with Next.js, Three.js, and React Three Fiber.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

