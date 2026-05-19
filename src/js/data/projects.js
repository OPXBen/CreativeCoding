import { mondrianSketch } from '../sketches/mondrian';
import { orbitSketch } from '../sketches/orbit';
import { starfieldSketch } from '../sketches/starfield';
import { magnetSketch } from '../sketches/magnet';
import { randomPointsAndShapesSketch } from '../sketches/randomPointsAndShapes';
import { markovChainSketch } from '../sketches/markovChain';

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
    description: 'Autonomous entities following simple rules.',

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
    title: 'Markov Chain Automaton',
    category: 'Agents',
    description: 'A cellular automaton based on Markov chain rules.',
    sketch: markovChainSketch,
    controls: [
      { id: 'framesPerUpdate', label: 'Speed', type: 'range', min: 1, max: 10, step: 1, default: 5 }
    ]
  }
];
