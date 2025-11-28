export type CatalogItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accentColor: string;
  order: number;
};

export type CardItem = {
  id: string;
  title: string;
  subtitle: string;
  mainColor: string; // base gradient color
  accentColor: string; // edge glow / gradient end
};

export const catalogItems: CatalogItem[] = [
  {
    id: 'sustainable-horizons',
    title: 'Sustainable Horizons',
    subtitle: 'Immersive 3D editorial experience',
    description:
      'A cinematic narrative where the camera orbits around a living structural spine, revealing layered content panels.',
    tags: ['Three.js', 'WebGL', 'Interactive Story'],
    accentColor: '#8EE6FF',
    order: 0,
  },
  {
    id: 'digital-ecosystems',
    title: 'Digital Ecosystems',
    subtitle: 'Interactive data visualization',
    description:
      'Explore complex relationships through an immersive 3D network visualization that responds to user interaction.',
    tags: ['Data Viz', 'React', 'WebGL'],
    accentColor: '#A78BFA',
    order: 1,
  },
  {
    id: 'architectural-visions',
    title: 'Architectural Visions',
    subtitle: 'Virtual space exploration',
    description:
      'Navigate through architectural concepts rendered in real-time, with dynamic lighting and spatial audio.',
    tags: ['Architecture', '3D Modeling', 'VR Ready'],
    accentColor: '#F472B6',
    order: 2,
  },
  {
    id: 'molecular-journey',
    title: 'Molecular Journey',
    subtitle: 'Scientific visualization',
    description:
      'Dive into the microscopic world with an interactive 3D representation of molecular structures and reactions.',
    tags: ['Science', 'Education', 'WebGL'],
    accentColor: '#34D399',
    order: 3,
  },
  {
    id: 'cosmic-narrative',
    title: 'Cosmic Narrative',
    subtitle: 'Space exploration experience',
    description:
      'Embark on a journey through the cosmos with procedurally generated star systems and celestial bodies.',
    tags: ['Space', 'Procedural', 'Immersive'],
    accentColor: '#FBBF24',
    order: 4,
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    subtitle: 'AI visualization platform',
    description:
      'Visualize artificial intelligence in action through an interactive representation of neural network architectures.',
    tags: ['AI', 'Machine Learning', 'Interactive'],
    accentColor: '#60A5FA',
    order: 5,
  },
];

// Card data for 3D scene - procedural content only (no images)
export const cardItems: CardItem[] = [
  {
    id: 'sustainable-horizons',
    title: 'SUSTAINABLE HORIZONS',
    subtitle: 'Case Study',
    mainColor: '#0a1a2e',
    accentColor: '#8EE6FF',
  },
  {
    id: 'harmonic-state',
    title: 'HARMONIC STATE',
    subtitle: 'Interactive Story',
    mainColor: '#1a0a2e',
    accentColor: '#A78BFA',
  },
  {
    id: 'digital-constellations',
    title: 'DIGITAL CONSTELLATIONS',
    subtitle: 'Data Visualization',
    mainColor: '#2e0a1a',
    accentColor: '#F472B6',
  },
  {
    id: 'neural-territories',
    title: 'NEURAL TERRITORIES',
    subtitle: 'AI Exploration',
    mainColor: '#0a2e1a',
    accentColor: '#34D399',
  },
  {
    id: 'luminous-systems',
    title: 'LUMINOUS SYSTEMS',
    subtitle: 'Space Journey',
    mainColor: '#2e1a0a',
    accentColor: '#FBBF24',
  },
  {
    id: 'quantum-realities',
    title: 'QUANTUM REALITIES',
    subtitle: 'Scientific Viz',
    mainColor: '#0a1a2e',
    accentColor: '#60A5FA',
  },
  {
    id: 'cosmic-narrative',
    title: 'COSMIC NARRATIVE',
    subtitle: 'Immersive Experience',
    mainColor: '#1a0a2e',
    accentColor: '#EC4899',
  },
];

