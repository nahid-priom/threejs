'use client';

import { motion } from 'framer-motion';

const techStack = [
  { name: 'Next.js', description: 'React framework for production' },
  { name: 'React Three Fiber', description: 'React renderer for Three.js' },
  { name: 'TypeScript', description: 'Type-safe JavaScript' },
  { name: 'Framer Motion', description: 'Animation library' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS' },
  { name: 'Zustand', description: 'State management' },
];

export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 py-20 bg-black/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">About This Project</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            This immersive 3D catalog was built using cutting-edge web technologies to create a
            cinematic browsing experience. The camera orbits around a central structure, revealing
            content panels that respond to scroll position, creating a seamless narrative flow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
              <p className="text-white/60">{tech.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-white/80 text-lg mb-8">
            The implementation features scroll-driven camera movements, dynamic lighting, particle
            effects, and smooth transitions that create an engaging user experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

