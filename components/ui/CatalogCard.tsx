'use client';

import { motion } from 'framer-motion';
import { CatalogItem } from '@/lib/catalogData';

interface CatalogCardProps {
  item: CatalogItem;
  index: number;
  isActive?: boolean;
  showMinimal?: boolean;
}

export default function CatalogCard({ item, index, isActive = false, showMinimal = false }: CatalogCardProps) {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border transition-all cursor-pointer group overflow-hidden"
      initial={!isActive ? { opacity: 0, y: 50 } : undefined}
      whileInView={!isActive ? { opacity: 1, y: 0 } : undefined}
      viewport={!isActive ? { once: true, margin: '-100px' } : undefined}
      transition={!isActive ? { duration: 0.6, delay: index * 0.1 } : undefined}
      whileHover={isActive ? { scale: 1.03, y: -8 } : undefined}
      style={{
        borderColor: isActive ? `${item.accentColor}40` : 'rgba(255, 255, 255, 0.2)',
        boxShadow: isActive
          ? `0 20px 60px -12px ${item.accentColor}40, 0 0 0 1px ${item.accentColor}30`
          : `0 8px 32px ${item.accentColor}15, 0 0 0 1px ${item.accentColor}10`,
      }}
    >
      {/* Active glow effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${item.accentColor}20 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Hover glow effect (only when active) */}
      {isActive && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${item.accentColor}25 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Accent indicator */}
        <div
          className="w-12 h-1 rounded-full mb-6"
          style={{ backgroundColor: item.accentColor }}
        />

        {/* Title */}
        <h3 className={`text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors ${
          showMinimal ? 'text-white/60' : 'text-white'
        }`}>
          {item.title}
        </h3>

        {/* Subtitle - only show when not minimal */}
        {!showMinimal && (
          <p className="text-white/60 text-sm md:text-base mb-4">{item.subtitle}</p>
        )}

        {/* Description - only show when not minimal */}
        {!showMinimal && (
          <p className="text-white/70 text-sm md:text-base mb-6 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Tags - only show when not minimal */}
        {!showMinimal && (
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
        )}
      </div>

      {/* Active shadow enhancement */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 20px 60px -12px ${item.accentColor}40`,
          }}
        />
      )}
    </motion.div>
  );
}

