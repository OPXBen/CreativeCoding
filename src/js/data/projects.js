import { mondrianSketch } from '../sketches/mondrian';
import { orbitSketch } from '../sketches/orbit';
import { starfieldSketch } from '../sketches/starfield';
import { magnetSketch } from '../sketches/magnet';
import { randomPointsAndShapesSketch } from '../sketches/randomPointsAndShapes';
import { gameOfLifeSketch } from '../sketches/gameOfLife';
import { lSystemSketch } from '../sketches/L-System';

export const CATEGORIES = [
  {
    id: 'Shapes',
    title: 'Shapes',
    description: 'Exploring geometric patterns and algorithmic compositions.',
    previewUrl: new URL('../../images/shapes.png', import.meta.url).href
  },
  {
    id: 'Motion',
    title: 'Motion',
    description: 'Dynamic movement and temporal oscillations.',
    previewUrl: new URL('../../images/motion.jpg', import.meta.url).href
  },
  {
    id: 'Particles',
    title: 'Particles',
    description: 'Systems of small elements interacting in space.',
    previewUrl: new URL('../../images/particles.webp', import.meta.url).href
  },
  {
    id: 'Interaction',
    title: 'Interaction',
    description: 'Reactive canvases that respond to your input.',
    previewUrl: new URL('../../images/interactions.jpg', import.meta.url).href
  },

  {
    id: 'Agents',
    title: 'Agents',
    description: 'Autonomous systems and emergent behaviors.',
    previewUrl: 'https://picsum.photos/seed/agents/600/400'
  }

];

export const PROJECTS = [
  {
    id: 'shapes-1',
    title: 'Mondrian Generator',
    category: 'Shapes',
    description: 'Procedural Mondrian-style grid composition.',
    sketch: mondrianSketch,
    oneShot: true
  },
  {
    id: 'motion-1',
    title: 'Orbiting Spheres',
    category: 'Motion',
    description: 'Gravitational dance of spheres around a center point.',
    sketch: orbitSketch,
    controls: [
      { id: 'amountOfBalls', label: 'Number of Orbits', type: 'range', min: 5, max: 50, step: 1, default: 15 }
    ]
  },
  {
    id: 'particles-1',
    title: 'Starfield',
    category: 'Particles',
    description: 'Traveling through a field of distant stars.',
    sketch: starfieldSketch,
    controls: [
      { id: 'maxStarSize', label: 'Max Star Size', type: 'range', min: 0, max: 75, step: 5, default: 15 }
    ]
  },
  {
    id: 'interact-1',
    title: 'Magnet Lines',
    category: 'Interaction',
    description: 'Lines that pivot to follow your cursor.',
    sketch: magnetSketch
  },
  {
    id: 'shapes-2',
    title: 'Random Generative Map',
    category: 'Shapes',
    description: 'A multi-generational algorithmic map generator.',
    sketch: randomPointsAndShapesSketch,
    controls: [
      { id: 'maxGens', label: 'Generations', type: 'range', min: 1, max: 6, step: 1, default: 3 },
      { id: 'pointsPerGen', label: 'Complexity', type: 'range', min: 5, max: 50, step: 5, default: 10 }
    ]
  },
  {
    id: 'agents-1',
    title: 'L-Systems',
    category: 'Agents',
    description: 'A cellular automaton based on L-System rules.',
    sketch: lSystemSketch,
    controls: [
      { id: 'framesPerUpdate', label: 'Speed', type: 'range', min: 1, max: 10, step: 1, default: 3 },
      { id: 'maxGens', label: 'Generations', type: 'range', min: 1, max: 10, step: 1, default: 5 },
      { id: 'angleMax', label: 'Max Turn Angle', type: 'range', min: 0, max: 360, step: 15, default: 45 }
    ]
  },

    {
    id: 'agents-2',
    title: 'Game of Life',
    category: 'Agents',
    description: 'John Conway’s cellular automaton simulation.',
    sketch: gameOfLifeSketch,
    controls: [
      { id: 'resolution', label: 'Resolution', type: 'range', min: 2, max: 40, step: 2, default: 10 },
      { id: 'speed', label: 'Speed (Frame Delay)', type: 'range', min: 1, max: 20, step: 1, default: 5 }
    ]
  }
];
