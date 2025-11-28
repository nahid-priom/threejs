'use client';

import { motion } from 'framer-motion';
import { CatalogItem } from '@/lib/catalogData';

interface CatalogCardProps {
  item: CatalogItem;
  index: number;
}

export default function CatalogCard({ item, index }: CatalogCardProps) {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 hover:border-white/40 transition-all cursor-pointer group overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -8 }}
      style={{
        boxShadow: `0 8px 32px ${item.accentColor}15, 0 0 0 1px ${item.accentColor}10`,
      }}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${item.accentColor}15 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Accent indicator */}
        <div
          className="w-12 h-1 rounded-full mb-6"
          style={{ backgroundColor: item.accentColor }}
        />

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors">
          {item.title}
        </h3>

        {/* Subtitle */}
        <p className="text-white/60 text-sm md:text-base mb-4">{item.subtitle}</p>

        {/* Description */}
        <p className="text-white/70 text-sm md:text-base mb-6 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs rounded-full bg-white/10 text-white/70 border border-white/20 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hover shadow enhancement */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 20px 60px -12px ${item.accentColor}40`,
        }}
      />
    </motion.div>
  );
}

