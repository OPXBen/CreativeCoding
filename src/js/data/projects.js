import { mondrianSketch } from '../sketches/mondrian';
import { orbitSketch } from '../sketches/orbit';
import { starfieldSketch } from '../sketches/starfield';
import { magnetSketch } from '../sketches/magnet';

export const CATEGORIES = [
  {
    id: 'Shapes',
    title: 'Shapes',
    description: 'Exploring geometric patterns and algorithmic compositions.',
    previewUrl: 'https://picsum.photos/seed/shapes/600/400'
  },
  {
    id: 'Motion',
    title: 'Motion',
    description: 'Dynamic movement and temporal oscillations.',
    previewUrl: 'https://picsum.photos/seed/motion/600/400'
  },
  {
    id: 'Particles',
    title: 'Particles',
    description: 'Systems of small elements interacting in space.',
    previewUrl: 'https://picsum.photos/seed/particles/600/400'
  },
  {
    id: 'Interaction',
    title: 'Interaction',
    description: 'Reactive canvases that respond to your input.',
    previewUrl: 'https://picsum.photos/seed/interaction/600/400'
  }
];

export const PROJECTS = [
  {
    id: 'shapes-1',
    title: 'Mondrian Generator',
    category: 'Shapes',
    description: 'Procedural Mondrian-style grid composition.',
    sketch: mondrianSketch
  },
  {
    id: 'motion-1',
    title: 'Orbiting Spheres',
    category: 'Motion',
    description: 'Gravitational dance of spheres around a center point.',
    sketch: orbitSketch
  },
  {
    id: 'particles-1',
    title: 'Starfield',
    category: 'Particles',
    description: 'Traveling through a field of distant stars.',
    sketch: starfieldSketch
  },
  {
    id: 'interact-1',
    title: 'Magnet Lines',
    category: 'Interaction',
    description: 'Lines that pivot to follow your cursor.',
    sketch: magnetSketch
  }
];
