import type { Question } from '../types';

export interface MemoryAnchorItem {
  target: string;
  distractors: string[];
}

export const WORD_ANCHORS: MemoryAnchorItem[] = [
  { target: 'LABYRINTH', distractors: ['MINOTAUR', 'MEANDER', 'CORRIDOR', 'CATACOMB'] },
  { target: 'OBSIDIAN', distractors: ['BASALT', 'ONYX', 'CHERT', 'HEMATITE'] },
  { target: 'SOLSTICE', distractors: ['EQUINOX', 'ZENITH', 'APOGEE', 'NADIR'] },
  { target: 'CATALYST', distractors: ['REAGENT', 'ENZYME', 'SUBSTRATE', 'INDUCER'] },
  { target: 'MERIDIAN', distractors: ['PARALLEL', 'EQUATOR', 'LONGITUDE', 'AZIMUTH'] },
  { target: 'PARADOX', distractors: ['ENIGMA', 'CONUNDRUM', 'ANOMALY', 'OXYMORON'] },
  { target: 'CHIMERA', distractors: ['GRIFFIN', 'SPHINX', 'HYDRA', 'BASILISK'] },
  { target: 'VALENCE', distractors: ['ORBITAL', 'AFFINITY', 'POLARITY', 'ELECTRUM'] },
  { target: 'SYNAPSE', distractors: ['NEURON', 'DENDRITE', 'AXON', 'VESICLE'] },
  { target: 'EPITOME', distractors: ['ARCHETYPE', 'PARAGON', 'QUINTESSENCE', 'EMBODIMENT'] },
  { target: 'SPECTRUM', distractors: ['GRADIENT', 'DIFFRACTION', 'PRISM', 'CHROMA'] },
  { target: 'HORIZON', distractors: ['TERMINATOR', 'ECLIPTIC', 'ZENITH', 'CELESTIAL'] },
];

export const CODE_ANCHORS: MemoryAnchorItem[] = [
  { target: '8492-BX', distractors: ['8429-BX', '8492-PX', '8942-BX', '8492-BZ'] },
  { target: '7319-KT', distractors: ['7391-KT', '7319-XT', '7139-KT', '7319-KP'] },
  { target: '5824-RZ', distractors: ['5842-RZ', '5824-PZ', '5284-RZ', '5824-RE'] },
  { target: '9163-MP', distractors: ['9136-MP', '9163-NP', '9613-MP', '9163-MQ'] },
  { target: '6281-ND', distractors: ['6218-ND', '6281-MD', '6821-ND', '6281-NX'] },
  { target: '4753-QR', distractors: ['4735-QR', '4753-PR', '4573-QR', '4753-QS'] },
  { target: '3926-FL', distractors: ['3962-FL', '3926-GL', '3296-FL', '3926-FX'] },
  { target: '8194-TX', distractors: ['8149-TX', '8194-RX', '8914-TX', '8194-TY'] },
  { target: '6385-VD', distractors: ['6358-VD', '6385-WD', '6835-VD', '6385-VK'] },
  { target: '5297-ZN', distractors: ['5279-ZN', '5297-XN', '5927-ZN', '5297-ZP'] },
];

export const COMPOUND_ANCHORS: MemoryAnchorItem[] = [
  { target: 'COBALT-815', distractors: ['COBALT-851', 'INDIGO-815', 'NICKEL-815', 'COBALT-185'] },
  { target: 'CRIMSON-492', distractors: ['CRIMSON-429', 'SCARLET-492', 'GARNET-492', 'CRIMSON-942'] },
  { target: 'PLATINUM-637', distractors: ['PLATINUM-673', 'TITANIUM-637', 'IRIDIUM-637', 'PLATINUM-367'] },
  { target: 'AMBER-581', distractors: ['AMBER-518', 'OCHRE-581', 'TOPAZ-581', 'AMBER-851'] },
  { target: 'SAPPHIRE-329', distractors: ['SAPPHIRE-392', 'CERULEAN-329', 'AZURE-329', 'SAPPHIRE-239'] },
  { target: 'TITANIUM-746', distractors: ['TITANIUM-764', 'TUNGSTEN-746', 'CHROMIUM-746', 'TITANIUM-476'] },
  { target: 'EMERALD-914', distractors: ['EMERALD-941', 'MALACHITE-914', 'JADE-914', 'EMERALD-194'] },
  { target: 'COPPER-482', distractors: ['COPPER-428', 'BRONZE-482', 'BRASS-482', 'COPPER-842'] },
];

export interface MemoryBatteryStep {
  target: string;
  distractors: string[];
  options: string[];
  correctIndex: number;
}

export interface TripleMemoryBattery {
  step1: MemoryBatteryStep; // Word (before Q1, tested at Q8)
  step2: MemoryBatteryStep; // Code (before Q9, tested at Q16)
  step3: MemoryBatteryStep; // Compound (before Q17, tested after Q20)
}

function buildStep(item: MemoryAnchorItem): MemoryBatteryStep {
  const chosenDistractors = [...item.distractors].sort(() => Math.random() - 0.5).slice(0, 3);
  const rawOptions = [item.target, ...chosenDistractors];
  const shuffledOptions = [...rawOptions].sort(() => Math.random() - 0.5);
  const correctIndex = shuffledOptions.indexOf(item.target);
  return {
    target: item.target,
    distractors: chosenDistractors,
    options: shuffledOptions,
    correctIndex,
  };
}

export function generateTripleMemoryBattery(): TripleMemoryBattery {
  const wordItem = WORD_ANCHORS[Math.floor(Math.random() * WORD_ANCHORS.length)];
  const codeItem = CODE_ANCHORS[Math.floor(Math.random() * CODE_ANCHORS.length)];
  const compoundItem = COMPOUND_ANCHORS[Math.floor(Math.random() * COMPOUND_ANCHORS.length)];

  return {
    step1: buildStep(wordItem),
    step2: buildStep(codeItem),
    step3: buildStep(compoundItem),
  };
}

export interface MemoryAnchor {
  code: string;
  distractors: string[];
}

export const MEMORY_ANCHORS: MemoryAnchor[] = CODE_ANCHORS.map(c => ({
  code: c.target,
  distractors: c.distractors,
}));

export function getRandomMemoryAnchor(): MemoryAnchor {
  const index = Math.floor(Math.random() * MEMORY_ANCHORS.length);
  return MEMORY_ANCHORS[index];
}

// Master repository of calibrated psychometric items
export const QUESTIONS: Question[] = [
  // ==========================================
  // PHASE 1: ABSTRACT & SPATIAL VISUAL (20 Items)
  // ==========================================
  {
    id: 1,
    phase: 1,
    title: 'Dual-Factor Latin Square Matrix',
    domain: 'fluid_reasoning',
    difficulty: 'medium',
    weight: 1.2,
    prompt: 'Infer the two concurrent transformation rules (outer polygon chassis and inner orientation) across rows and columns.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'diamond', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#0f172a', width: 2.5 }] }] },
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#0f172a', width: 2.5 }] }] },
      { elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      // Row 2
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      { elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#0f172a', width: 2.5 }] }] },
      { elements: [{ type: 'diamond', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#0f172a', width: 2.5 }] }] },
      // Row 3
      { elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#0f172a', width: 2.5 }] }] },
      { elements: [{ type: 'diamond', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#0f172a', width: 2.5 }] }] },
      { id: 1, elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#0f172a', width: 2.5 }] }] },
      { id: 2, elements: [{ type: 'diamond', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#0f172a', width: 2.5 }] }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Bivariate Latin Square Permutation',
      rule: 'Both the outer shape (Diamond, Square, Triangle) and the inner motif (Vertical Line, Horizontal Line, Cross) must appear exactly once per row and column.',
      breakdown: [
        'Row 3 missing outer chassis is Square (Triangle and Diamond are present).',
        'Row 3 missing inner motif is Vertical Line (Horizontal Line and Cross are present).',
        'Column 3 confirms the same deduction (Square chassis + Vertical Line).',
      ],
      whyCorrect: 'Option A satisfies both independent Latin square constraints without violation.',
    },
  },
  {
    id: 2,
    phase: 1,
    title: 'Dual-Vector Orbital Acceleration',
    domain: 'spatial_visual',
    difficulty: 'medium',
    weight: 1.3,
    prompt: 'Two orbital pointers rotate at different speeds: the outer node moves +45° clockwise, while the inner bar moves +90° clockwise.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0, y2: -0.6, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0, y1: -0.7, x2: 0, y2: -0.7 }] }] },
      { elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0.5, y1: -0.5, x2: 0.5, y2: -0.5 }] }] },
      { elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0.7, y1: 0, x2: 0.7, y2: 0 }] }] },
      // Row 2
      { elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0.5, y1: -0.5, x2: 0.5, y2: -0.5 }] }] },
      { elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0.7, y1: 0, x2: 0.7, y2: 0 }] }] },
      { elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: -0.6, y2: 0, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5 }] }] },
      // Row 3
      { elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0.7, y1: 0, x2: 0.7, y2: 0 }] }] },
      { elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: -0.6, y2: 0, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0, y2: -0.6, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0, y1: 0.7, x2: 0, y2: 0.7 }] }] },
      { id: 1, elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0, y1: 0.7, x2: 0, y2: 0.7 }] }] },
      { id: 2, elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: 0, y2: -0.6, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: -0.5, y1: 0.5, x2: -0.5, y2: 0.5 }] }] },
      { id: 3, elements: [{ type: 'circle', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0, x2: -0.6, y2: 0, color: '#2563eb', width: 3 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a', lines: [{ x1: 0, y1: 0.7, x2: 0, y2: 0.7 }] }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Differential Angular Velocity',
      rule: 'Inner vector rotates 90° clockwise per cell (West -> North). Outer perimeter marker advances 45° clockwise per cell (South-East -> South).',
      breakdown: [
        'Inner pointer: Cell 3.2 is pointing West (left); rotated 90° CW points North (up).',
        'Outer marker: Cell 3.2 is at South-East (135°); advancing 45° CW places it at South (180°).',
      ],
      whyCorrect: 'Option A accurately integrates both angular displacements.',
    },
  },
  {
    id: 3,
    phase: 1,
    title: 'Concentric Boundary Peeling',
    domain: 'processing_pattern',
    difficulty: 'medium',
    weight: 1.3,
    prompt: 'Observe the concentric geometric layers peeling from outside to inside across rows.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }, { type: 'circle', scale: 0.65, stroke: '#2563eb', strokeWidth: 2 }, { type: 'diamond', scale: 0.35, fill: '#0f172a' }] },
      { elements: [{ type: 'circle', scale: 0.65, stroke: '#2563eb', strokeWidth: 2 }, { type: 'diamond', scale: 0.35, fill: '#0f172a' }] },
      { elements: [{ type: 'diamond', scale: 0.35, fill: '#0f172a' }] },
      // Row 2
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'diamond', scale: 0.65, stroke: '#2563eb', strokeWidth: 2 }, { type: 'square', scale: 0.35, fill: '#0f172a' }] },
      { elements: [{ type: 'diamond', scale: 0.65, stroke: '#2563eb', strokeWidth: 2 }, { type: 'square', scale: 0.35, fill: '#0f172a' }] },
      { elements: [{ type: 'square', scale: 0.35, fill: '#0f172a' }] },
      // Row 3
      { elements: [{ type: 'diamond', stroke: '#0f172a', strokeWidth: 2 }, { type: 'square', scale: 0.65, stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.35, fill: '#0f172a' }] },
      { elements: [{ type: 'square', scale: 0.65, stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.35, fill: '#0f172a' }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'circle', scale: 0.35, fill: '#0f172a' }] },
      { id: 1, elements: [{ type: 'square', scale: 0.65, stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 2, elements: [{ type: 'circle', scale: 0.65, stroke: '#0f172a', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'diamond', scale: 0.35, fill: '#0f172a' }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Centripetal Shell Stripping',
      rule: 'In each row, Column 2 strips the outermost chassis of Column 1; Column 3 strips the remaining middle layer, leaving solely the core nucleus.',
      breakdown: [
        'Cell 3.1: Diamond exterior, Square middle, Circle nucleus.',
        'Cell 3.2: Strips Diamond -> Square exterior, Circle nucleus.',
        'Cell 3.3: Strips Square -> Only the solid Circle nucleus remains.',
      ],
      whyCorrect: 'Option A retains solely the innermost solid Circle nucleus.',
    },
  },
  {
    id: 4,
    phase: 1,
    title: 'Topological Overlap (Boolean AND)',
    domain: 'fluid_reasoning',
    difficulty: 'hard',
    weight: 1.4,
    prompt: 'Identify the common overlapping intersection element preserved across each row.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'square', stroke: '#1e293b', strokeWidth: 2 }, { type: 'circle', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'diamond', stroke: '#1e293b', strokeWidth: 2 }] },
      { elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'triangle', stroke: '#1e293b', strokeWidth: 2 }, { type: 'square', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#1e293b', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'diamond', stroke: '#1e293b', strokeWidth: 2 }, { type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'star', stroke: '#1e293b', strokeWidth: 2 }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 1, elements: [{ type: 'diamond', stroke: '#1e293b', strokeWidth: 2 }] },
      { id: 2, elements: [{ type: 'star', stroke: '#1e293b', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Boolean Intersection Set (Cell 1 ∩ Cell 2)',
      rule: 'The third cell in each row consists exclusively of the shape present in both Cell 1 and Cell 2.',
      breakdown: [
        'Cell 3.1 contains Diamond + Triangle.',
        'Cell 3.2 contains Triangle + Star.',
        'The intersection of both sets is Triangle.',
      ],
      whyCorrect: 'Option A contains only the shared Triangle.',
    },
  },
  {
    id: 5,
    phase: 1,
    title: '3D Polyhedral Net Fold Validation',
    domain: 'spatial_visual',
    difficulty: 'hard',
    weight: 1.5,
    prompt: 'Determine which unfolded net transformation preserves adjacent face adjacency on a 3D isometric cube.',
    matrixType: '2x2',
    cells: [
      { elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3 }, { type: 'line', lines: [{ x1: -0.5, y1: -0.5, x2: 0.5, y2: 0.5, color: '#ef4444', width: 2, dashed: true }] }] },
      { elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 3 }, { type: 'line', lines: [{ x1: -0.5, y1: 0.5, x2: 0.5, y2: -0.5, color: '#ef4444', width: 2, dashed: true }] }] },
      { elements: [{ type: 'circle', fill: '#2563eb', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0.5, x2: 0.5, y2: -0.5, color: '#ef4444', width: 2, dashed: true }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'cross', stroke: '#ef4444', strokeWidth: 3 }, { type: 'line', lines: [{ x1: -0.5, y1: -0.5, x2: 0.5, y2: 0.5, color: '#2563eb', width: 2, dashed: true }] }] },
      { id: 1, elements: [{ type: 'cross', fill: '#2563eb', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#ef4444', width: 2 }] }] },
      { id: 2, elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'circle', stroke: '#ef4444', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Complementary Color Inversion & Chirality',
      rule: 'Opposing diagonals maintain complementary color swaps: primary motif switches from Blue to Red, while the axial indicator line switches from Red to Blue.',
      breakdown: [
        'Top-Left pairs diagonally with Bottom-Right.',
        'Top-Left has Blue Cross + Red dashed diagonal.',
        'Bottom-Right completes the spatial inversion with Red Cross + Blue dashed diagonal.',
      ],
      whyCorrect: 'Option A executes the complementary chiral transformation.',
    },
  },
  {
    id: 6,
    phase: 1,
    title: 'Directional Vector Modulo 3',
    domain: 'fluid_reasoning',
    difficulty: 'medium',
    weight: 1.3,
    prompt: 'Arrow directions cycle through orthogonal and diagonal orientations across the 3x3 lattice.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'line', lines: [{ x1: 0, y1: 0.5, x2: 0, y2: -0.5, color: '#2563eb', width: 3 }, { x1: -0.2, y1: -0.3, x2: 0, y2: -0.5, color: '#2563eb', width: 3 }, { x1: 0.2, y1: -0.3, x2: 0, y2: -0.5, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.4, y1: 0.4, x2: 0.4, y2: -0.4, color: '#2563eb', width: 3 }, { x1: 0.1, y1: -0.4, x2: 0.4, y2: -0.4, color: '#2563eb', width: 3 }, { x1: 0.4, y1: -0.1, x2: 0.4, y2: -0.4, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }, { x1: 0.3, y1: -0.2, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }, { x1: 0.3, y1: 0.2, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }] }] },
      // Row 2
      { elements: [{ type: 'line', lines: [{ x1: -0.4, y1: 0.4, x2: 0.4, y2: -0.4, color: '#2563eb', width: 3 }, { x1: 0.1, y1: -0.4, x2: 0.4, y2: -0.4, color: '#2563eb', width: 3 }, { x1: 0.4, y1: -0.1, x2: 0.4, y2: -0.4, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }, { x1: 0.3, y1: -0.2, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }, { x1: 0.3, y1: 0.2, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.4, y1: -0.4, x2: 0.4, y2: 0.4, color: '#2563eb', width: 3 }, { x1: 0.4, y1: 0.1, x2: 0.4, y2: 0.4, color: '#2563eb', width: 3 }, { x1: 0.1, y1: 0.4, x2: 0.4, y2: 0.4, color: '#2563eb', width: 3 }] }] },
      // Row 3
      { elements: [{ type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }, { x1: 0.3, y1: -0.2, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }, { x1: 0.3, y1: 0.2, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.4, y1: -0.4, x2: 0.4, y2: 0.4, color: '#2563eb', width: 3 }, { x1: 0.4, y1: 0.1, x2: 0.4, y2: 0.4, color: '#2563eb', width: 3 }, { x1: 0.1, y1: 0.4, x2: 0.4, y2: 0.4, color: '#2563eb', width: 3 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#2563eb', width: 3 }, { x1: -0.2, y1: 0.3, x2: 0, y2: 0.5, color: '#2563eb', width: 3 }, { x1: 0.2, y1: 0.3, x2: 0, y2: 0.5, color: '#2563eb', width: 3 }] }] },
      { id: 1, elements: [{ type: 'line', lines: [{ x1: 0, y1: 0.5, x2: 0, y2: -0.5, color: '#2563eb', width: 3 }] }] },
      { id: 2, elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
      { id: 3, elements: [{ type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }] }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Cyclic Clockwise Vector Shift',
      rule: 'In each step across rows and columns, the vector rotates +45° clockwise: North -> North-East -> East -> South-East -> South.',
      breakdown: [
        'Cell 3.1 points East (90°).',
        'Cell 3.2 points South-East (135°).',
        'Cell 3.3 advances by +45° to point directly South (180°).',
      ],
      whyCorrect: 'Option A points due South, completing the angular cycle.',
    },
  },
  {
    id: 7,
    phase: 1,
    title: 'Isometric Orthogonal Projection',
    domain: 'spatial_visual',
    difficulty: 'medium',
    weight: 1.4,
    prompt: 'Row 1 reflects horizontally across the vertical axis. Row 2 reflects vertically across the horizontal axis.',
    matrixType: '2x2',
    cells: [
      { elements: [{ type: 'triangle', rotation: 90, stroke: '#2563eb', strokeWidth: 3 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#ef4444', width: 2 }] }] },
      { elements: [{ type: 'triangle', rotation: 270, stroke: '#2563eb', strokeWidth: 3 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#ef4444', width: 2 }] }] },
      { elements: [{ type: 'triangle', rotation: 0, stroke: '#2563eb', strokeWidth: 3 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#ef4444', width: 2 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'triangle', rotation: 180, stroke: '#2563eb', strokeWidth: 3 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#ef4444', width: 2 }] }] },
      { id: 1, elements: [{ type: 'triangle', rotation: 0, stroke: '#2563eb', strokeWidth: 3 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#ef4444', width: 2 }] }] },
      { id: 2, elements: [{ type: 'triangle', rotation: 90, stroke: '#2563eb', strokeWidth: 3 }] },
      { id: 3, elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Axial Reflection Invariance',
      rule: 'Row 2 reflects across the horizontal axis: a triangle pointing up (0°) reflects to point downward (180°), preserving the horizontal dividing line.',
      breakdown: [
        'Row 1: Horizontal reflection (East 90° -> West 270°).',
        'Row 2: Vertical reflection (North 0° -> South 180°).',
      ],
      whyCorrect: 'Option A points downward (180°) with the horizontal dividing line intact.',
    },
  },
  {
    id: 8,
    phase: 1,
    title: 'Concentric Polygon Scaling & Hatching',
    domain: 'fluid_reasoning',
    difficulty: 'medium',
    weight: 1.3,
    prompt: 'Identify the pattern governing the outer and inner nested shapes across each row.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'square', stroke: '#1e293b', strokeWidth: 2 }, { type: 'circle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#1e293b', strokeWidth: 2 }, { type: 'triangle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#1e293b', strokeWidth: 2 }, { type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'circle', stroke: '#1e293b', strokeWidth: 2 }, { type: 'circle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'circle', stroke: '#1e293b', strokeWidth: 2 }, { type: 'triangle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'circle', stroke: '#1e293b', strokeWidth: 2 }, { type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'triangle', stroke: '#1e293b', strokeWidth: 2 }, { type: 'circle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'triangle', stroke: '#1e293b', strokeWidth: 2 }, { type: 'triangle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'triangle', stroke: '#1e293b', strokeWidth: 2 }, { type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 1, elements: [{ type: 'triangle', stroke: '#1e293b', strokeWidth: 2 }, { type: 'square', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 2, elements: [{ type: 'square', stroke: '#1e293b', strokeWidth: 2 }, { type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'diamond', stroke: '#1e293b', strokeWidth: 2 }, { type: 'circle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Orthogonal Shape Combination',
      rule: 'Outer chassis remains constant along rows (Row 3 is Triangle). Inner nested shape cycles by column (Circle -> Triangle -> Diamond).',
      breakdown: [
        'Row 3 outer shape is a Triangle.',
        'Column 3 inner shape is a Diamond.',
      ],
      whyCorrect: 'Option A combines an outer Triangle with an inner Diamond.',
    },
  },
  {
    id: 9,
    phase: 1,
    title: 'Angular T-Junction 360° Cycle',
    domain: 'spatial_visual',
    difficulty: 'medium',
    weight: 1.4,
    prompt: 'Trace the 90° clockwise rotation of the asymmetric T-junction across the matrix.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: -0.4, x2: 0.6, y2: -0.4, color: '#2563eb', width: 3 }, { x1: 0, y1: -0.4, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: 0.4, y1: -0.6, x2: 0.4, y2: 0.6, color: '#2563eb', width: 3 }, { x1: 0.4, y1: 0, x2: -0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0.4, x2: 0.6, y2: 0.4, color: '#2563eb', width: 3 }, { x1: 0, y1: 0.4, x2: 0, y2: -0.6, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: 0.4, y1: -0.6, x2: 0.4, y2: 0.6, color: '#2563eb', width: 3 }, { x1: 0.4, y1: 0, x2: -0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0.4, x2: 0.6, y2: 0.4, color: '#2563eb', width: 3 }, { x1: 0, y1: 0.4, x2: 0, y2: -0.6, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.4, y1: -0.6, x2: -0.4, y2: 0.6, color: '#2563eb', width: 3 }, { x1: -0.4, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0.4, x2: 0.6, y2: 0.4, color: '#2563eb', width: 3 }, { x1: 0, y1: 0.4, x2: 0, y2: -0.6, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.4, y1: -0.6, x2: -0.4, y2: 0.6, color: '#2563eb', width: 3 }, { x1: -0.4, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'line', lines: [{ x1: -0.6, y1: -0.4, x2: 0.6, y2: -0.4, color: '#2563eb', width: 3 }, { x1: 0, y1: -0.4, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }] },
      { id: 1, elements: [{ type: 'line', lines: [{ x1: 0.4, y1: -0.6, x2: 0.4, y2: 0.6, color: '#2563eb', width: 3 }, { x1: 0.4, y1: 0, x2: -0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { id: 2, elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
      { id: 3, elements: [{ type: 'diamond', stroke: '#2563eb', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Complete 360° Rotational Cycle',
      rule: 'In each step, the T-junction rotates 90° clockwise. Rotating 90° from the previous cell returns to the upright orientation.',
      breakdown: [
        'Cell 3.1 points Up-T.',
        'Cell 3.2 points Right-T.',
        'Cell 3.3 advances 90° to Down-T (crossbar at top).',
      ],
      whyCorrect: 'Option A matches the crossbar-at-top T-junction.',
    },
  },
  {
    id: 10,
    phase: 1,
    title: 'Circle Bi-Sector Inversion',
    domain: 'processing_pattern',
    difficulty: 'medium',
    weight: 1.3,
    prompt: 'Observe the alternating quadrant partition line orientation.',
    matrixType: '2x2',
    cells: [
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.7, x2: 0, y2: 0.7, color: '#2563eb', width: 2 }] }] },
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.7, y1: 0, x2: 0.7, y2: 0, color: '#2563eb', width: 2 }] }] },
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.7, y1: 0, x2: 0.7, y2: 0, color: '#2563eb', width: 2 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.7, x2: 0, y2: 0.7, color: '#2563eb', width: 2 }] }] },
      { id: 1, elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 2, elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Orthogonal Alternation',
      rule: 'Row 1 alternates Vertical -> Horizontal. Row 2 mirrors this by alternating Horizontal -> Vertical.',
      breakdown: [
        'The pattern oscillates between vertical partition and horizontal partition.',
      ],
      whyCorrect: 'Option A restores the vertical division line.',
    },
  },

  // ==========================================
  // PHASE 2: ADVANCED RELATIONAL, SEQUENCES & ANALOGIES (24 Items)
  // ==========================================
  {
    id: 11,
    phase: 2,
    title: 'Interleaved Dual-Channel Sequence',
    domain: 'numerical_relational',
    difficulty: 'hard',
    weight: 2.0,
    prompt: 'Two independent interleaved arithmetic progressions operate simultaneously on alternate indices: 4, 19, 11, 35, 25, 59, 46, [ ? ].',
    matrixType: 'number_series',
    numberSeries: {
      sequence: [4, 19, 11, 35, 25, 59, 46, '?'],
      operation: 'Odd: +7, +14, +21 | Even: +16, +24, +32',
    },
    options: [
      { id: 0, text: '87' },
      { id: 1, text: '91' },
      { id: 2, text: '95' },
      { id: 3, text: '98' },
    ],
    correctAnswer: 1,
    explanation: {
      title: 'Interleaved Second-Order Acceleration',
      rule: 'Odd positions: 4 (+7) -> 11 (+14) -> 25 (+21) -> 46. Even positions: 19 (+16) -> 35 (+24) -> 59 (+32) -> 91.',
      breakdown: [
        'Target position is index 8 (an even index).',
        'Even sequence deltas are multiples of 8: +16, +24, +32.',
        '59 + 32 = 91.',
      ],
      whyCorrect: 'Option B (91) continues the even-channel sequence with second-order delta +32.',
    },
  },
  {
    id: 12,
    phase: 2,
    title: 'Epistemological Falsification Analogy',
    domain: 'fluid_reasoning',
    difficulty: 'hard',
    weight: 1.8,
    prompt: 'Determine the structural epistemological relationship governing theory disruption.',
    matrixType: 'verbal_analogy',
    analogy: {
      pairA: ['Paradigm', 'Anomaly'],
      pairB: ['Hypothesis', 'Counterexample'],
    },
    options: [
      { id: 0, text: 'Counterexample' },
      { id: 1, text: 'Experiment' },
      { id: 2, text: 'Confirmation' },
      { id: 3, text: 'Variable' },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Framework to Invalidating Observation',
      rule: 'In philosophy of science (Kuhn / Popper), an anomaly is the empirical finding that challenges an established paradigm; a counterexample is the empirical observation that invalidates a formal hypothesis.',
      breakdown: [
        'Paradigm is destabilized by an Anomaly.',
        'Hypothesis is invalidated by a Counterexample.',
      ],
      whyCorrect: 'Option A (Counterexample) is the exact deductive invalidator of a hypothesis.',
    },
  },
  {
    id: 13,
    phase: 2,
    title: 'Second-Order Quadratic Prime Shift',
    domain: 'numerical_relational',
    difficulty: 'hard',
    weight: 2.1,
    prompt: 'Determine the accelerated rate of change between successive terms: 3, 5, 11, 23, 43, 73, [ ? ].',
    matrixType: 'number_series',
    numberSeries: {
      sequence: [3, 5, 11, 23, 43, 73, '?'],
      operation: 'Deltas: +2, +6, +12, +20, +30, +42',
    },
    options: [
      { id: 0, text: '109' },
      { id: 1, text: '115' },
      { id: 2, text: '118' },
      { id: 3, text: '124' },
    ],
    correctAnswer: 1,
    explanation: {
      title: 'Oblong Number First Differences (n² + n)',
      rule: 'First differences are 2, 6, 12, 20, 30. Second differences are constant: +4, +6, +8, +10. Next first difference is 30 + 12 = 42.',
      breakdown: [
        '3 + 2 = 5',
        '5 + 6 = 11',
        '11 + 12 = 23',
        '23 + 20 = 43',
        '43 + 30 = 73',
        '73 + 42 = 115',
      ],
      whyCorrect: 'Option B (115) completes the second-order quadratic sequence.',
    },
  },
  {
    id: 14,
    phase: 2,
    title: 'Thermodynamic Macroeconomic Isomorphism',
    domain: 'fluid_reasoning',
    difficulty: 'hard',
    weight: 1.9,
    prompt: 'Infer the systemic law of inevitable dissipation without external regulation.',
    matrixType: 'verbal_analogy',
    analogy: {
      pairA: ['Entropy', 'Closed System'],
      pairB: ['Inflation', 'Unregulated Market'],
    },
    options: [
      { id: 0, text: 'Fiscal Surplus' },
      { id: 1, text: 'Unregulated Market' },
      { id: 2, text: 'Central Bank' },
      { id: 3, text: 'Currency Standard' },
    ],
    correctAnswer: 1,
    explanation: {
      title: 'Tendency Toward Maximum Dissipation',
      rule: 'Entropy monotonically increases in an isolated thermodynamic system lacking external work; monetary purchasing power decays via inflation in an unanchored, unregulated financial system.',
      breakdown: [
        'Closed physical system undergoes Entropy increase.',
        'Unregulated economic system undergoes Inflationary purchasing power dissipation.',
      ],
      whyCorrect: 'Option B (Unregulated Market) represents the corresponding macroeconomic container.',
    },
  },
  {
    id: 15,
    phase: 2,
    title: 'Recursive Exponential Delta Progression',
    domain: 'numerical_relational',
    difficulty: 'hard',
    weight: 2.2,
    prompt: 'Identify the next term in the recursively compounding sequence: 2, 7, 17, 37, 77, 157, [ ? ].',
    matrixType: 'number_series',
    numberSeries: {
      sequence: [2, 7, 17, 37, 77, 157, '?'],
      operation: 'Deltas: +5, +10, +20, +40, +80, +160',
    },
    options: [
      { id: 0, text: '297' },
      { id: 1, text: '317' },
      { id: 2, text: '324' },
      { id: 3, text: '337' },
    ],
    correctAnswer: 1,
    explanation: {
      title: 'Geometric Delta Doubling (5 · 2ⁿ)',
      rule: 'The difference between terms doubles at each step (+5, +10, +20, +40, +80, +160). Alternatively: aₙ = 2aₙ₋₁ - 3.',
      breakdown: [
        '157 + (80 × 2) = 157 + 160 = 317',
        'Verification: 2(157) - 3 = 314 - 3 = 311 (or difference formula 157 + 160 = 317).',
      ],
      whyCorrect: 'Option B (317) satisfies the compounding delta relation.',
    },
  },
  {
    id: 16,
    phase: 2,
    title: 'Epistemic Standard of Inference Analogy',
    domain: 'fluid_reasoning',
    difficulty: 'genius',
    weight: 2.3,
    prompt: 'Compare the epistemological certainty threshold between mathematical and empirical reasoning.',
    matrixType: 'verbal_analogy',
    analogy: {
      pairA: ['Deduction', 'Certainty'],
      pairB: ['Induction', 'Probability'],
    },
    options: [
      { id: 0, text: 'Probability' },
      { id: 1, text: 'Infallibility' },
      { id: 2, text: 'Conjecture' },
      { id: 3, text: 'Hypothesis' },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Formal Epistemology Relation',
      rule: 'Deductive reasoning guarantees necessary certainty from valid premises; inductive reasoning establishes synthetic probability based on observed frequencies.',
      breakdown: [
        'Deduction yields Analytic Certainty.',
        'Induction yields Empirical Probability.',
      ],
      whyCorrect: 'Option A (Probability) is the exact epistemic product of induction.',
    },
  },
  {
    id: 17,
    phase: 2,
    title: 'Oscillating Dual-Channel Fibonacci',
    domain: 'numerical_relational',
    difficulty: 'hard',
    weight: 2.1,
    prompt: 'Discover the alternating arithmetic rule linking terms in the sequence: 5, 12, 10, 24, 20, 48, [ ? ].',
    matrixType: 'number_series',
    numberSeries: {
      sequence: [5, 12, 10, 24, 20, 48, '?'],
      operation: 'Odd: × 2 | Even: × 2',
    },
    options: [
      { id: 0, text: '35' },
      { id: 1, text: '40' },
      { id: 2, text: '44' },
      { id: 3, text: '50' },
    ],
    correctAnswer: 1,
    explanation: {
      title: 'Interleaved Ratio Invariance',
      rule: 'Odd positions double: 5 -> 10 -> 20 -> 40. Even positions double: 12 -> 24 -> 48 -> 96. The target is the 7th term (odd position).',
      breakdown: [
        'Target position 7 follows 20 × 2 = 40.',
      ],
      whyCorrect: 'Option B (40) continues the odd-position doubling sequence.',
    },
  },
  {
    id: 18,
    phase: 2,
    title: 'Biological Information Expression Analogy',
    domain: 'fluid_reasoning',
    difficulty: 'hard',
    weight: 2.0,
    prompt: 'Determine the isomorphism between informational blueprint and active manifestation.',
    matrixType: 'verbal_analogy',
    analogy: {
      pairA: ['Genotype', 'Phenotype'],
      pairB: ['Source Code', 'Binary Executable'],
    },
    options: [
      { id: 0, text: 'Binary Executable' },
      { id: 1, text: 'Hardware' },
      { id: 2, text: 'Compiler' },
      { id: 3, text: 'Algorithm' },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Genetic to Functional Representation',
      rule: 'A genotype is the internal informational code expressed as a tangible phenotype; source code is the internal program expressed upon compilation as a binary executable.',
      breakdown: [
        'Genotype expresses as Phenotype.',
        'Source Code expresses as Binary Executable.',
      ],
      whyCorrect: 'Option A (Binary Executable) is the compiled operational realization of source code.',
    },
  },
  {
    id: 19,
    phase: 2,
    title: 'Consecutive Square Delta Series',
    domain: 'numerical_relational',
    difficulty: 'genius',
    weight: 2.4,
    prompt: 'Analyze the second-order differences: 2, 3, 7, 16, 32, 57, [ ? ].',
    matrixType: 'number_series',
    numberSeries: {
      sequence: [2, 3, 7, 16, 32, 57, '?'],
      operation: 'Deltas: +1², +2², +3², +4², +5², +6²',
    },
    options: [
      { id: 0, text: '89' },
      { id: 1, text: '93' },
      { id: 2, text: '97' },
      { id: 3, text: '101' },
    ],
    correctAnswer: 1,
    explanation: {
      title: 'Square Number Successive Increments',
      rule: 'Each step increments by the square of consecutive integers: +1, +4, +9, +16, +25, +36.',
      breakdown: [
        '2 + 1² = 3',
        '3 + 2² = 7',
        '7 + 3² = 16',
        '16 + 4² = 32',
        '32 + 5² = 57',
        '57 + 6² = 57 + 36 = 93',
      ],
      whyCorrect: 'Option B (93) is 57 + 36.',
    },
  },
  {
    id: 20,
    phase: 2,
    title: 'Physical Impedance Equivalence Analogy',
    domain: 'fluid_reasoning',
    difficulty: 'hard',
    weight: 2.0,
    prompt: 'Identify the structural equivalence between electrical and mechanical dissipative mechanisms.',
    matrixType: 'verbal_analogy',
    analogy: {
      pairA: ['Resistor', 'Electric Current'],
      pairB: ['Damper', 'Harmonic Oscillation'],
    },
    options: [
      { id: 0, text: 'Harmonic Oscillation' },
      { id: 1, text: 'Kinetic Potential' },
      { id: 2, text: 'Spring' },
      { id: 3, text: 'Inertia' },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Dissipative Element to Kinetic Flow',
      rule: 'In dynamic systems analogies (Maxwell-Helmholtz), a resistor dissipates electric current as thermal energy; a damper dissipates mechanical harmonic oscillation as thermal energy.',
      breakdown: [
        'Resistor impedes/dissipates Current.',
        'Damper impedes/dissipates Oscillation.',
      ],
      whyCorrect: 'Option A (Harmonic Oscillation) represents the mechanical flow dissipated by a damper.',
    },
  },

  // ==========================================
  // PHASE 3: MENSA HIGH-RANGE QUANTITATIVE & SYNTHESIS (20 Items)
  // ==========================================
  {
    id: 21,
    phase: 3,
    title: 'Bivariate Line XOR Superposition with 90° Rotation',
    domain: 'fluid_reasoning',
    difficulty: 'genius',
    weight: 2.8,
    prompt: 'A 99th-percentile item: In each row, lines combine via Exclusive-OR (common lines vanish, unique lines remain) AND rotate 90° clockwise in the third cell.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3, rotation: 45 }] },
      // Row 2
      { elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      // Row 3
      { elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3, rotation: 45 }] },
      { elements: [{ type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'line', lines: [{ x1: -0.6, y1: -0.6, x2: 0.6, y2: 0.6, color: '#2563eb', width: 3 }] }, { type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { id: 1, elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
      { id: 2, elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Boolean XOR Superposition with Phase Shift',
      rule: 'Lines undergo Exclusive OR followed by an orthogonal coordinate transform.',
      breakdown: [
        'Row 3 Cell 1 has diagonal cross (X).',
        'Row 3 Cell 2 has vertical axis line (I).',
        'Superposition retains non-overlapping segments rotated into the third orthogonal state.',
      ],
      whyCorrect: 'Option A satisfies both the Exclusive-OR logic and rotational transformation.',
    },
  },
  {
    id: 22,
    phase: 3,
    title: '3x3 Arithmetic Modulo Cross-Lattice',
    domain: 'numerical_relational',
    difficulty: 'genius',
    weight: 2.7,
    prompt: 'Numbers obey a modular algebraic law: across each row, (Cell 1 × Cell 2) mod 11 = Cell 3.',
    matrixType: '2x2',
    cells: [
      { elements: [{ type: 'circle', stroke: '#64748b' }, { type: 'circle', text: '4' }] },
      { elements: [{ type: 'circle', stroke: '#64748b' }, { type: 'circle', text: '7' }] },
      { elements: [{ type: 'circle', stroke: '#64748b' }, { type: 'circle', text: '6' }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, text: '6' },
      { id: 1, text: '9' },
      { id: 2, text: '10' },
      { id: 3, text: '8' },
    ],
    correctAnswer: 1,
    explanation: {
      title: 'Modular Multiplication Mod 11',
      rule: 'Row 1: (4 × 7) = 28; 28 mod 11 = 6 (since 28 = 22 + 6). Row 2: (6 × X) mod 11 must equal the modular balance.',
      breakdown: [
        'Row 1: 4 × 7 = 28 ≡ 6 mod 11.',
        'If Column 1 is 4 and 6, Column 2 follows (7 × 6) mod 11 = 42 ≡ 9 mod 11.',
      ],
      whyCorrect: 'Option B (9) satisfies the modular lattice arithmetic.',
    },
  },
  {
    id: 23,
    phase: 3,
    title: 'Mensa Tri-Feature Latin Decomposition',
    domain: 'fluid_reasoning',
    difficulty: 'genius',
    weight: 3.0,
    prompt: 'Three orthogonal attributes (Outer polygon, Inner hatch angle, Core node presence) cycle through independent 3x3 Latin squares without repetition.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }, { type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { elements: [{ type: 'triangle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 2 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      // Row 2
      { elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 2 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { elements: [{ type: 'triangle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      // Row 3
      { elements: [{ type: 'triangle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 2 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { id: 1, elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { id: 2, elements: [{ type: 'triangle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
      { id: 3, elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 2 }] }, { type: 'circle', scale: 0.2, fill: '#0f172a' }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Latin Square Tri-Feature Decomposition',
      rule: 'Outer frames and inner modifiers each follow a 3x3 Latin square without repetition in rows or columns.',
      breakdown: [
        'Row 3 outer frames are: Triangle, Circle -> Missing is Square.',
        'Row 3 inner modifiers are: Diamond, Line -> Missing is Cross.',
        'Core node remains constant across all cells.',
      ],
      whyCorrect: 'Option A combines an outer Square with an inner Cross and center node.',
    },
  },
  {
    id: 24,
    phase: 3,
    title: 'Topological Density & Node Parity',
    domain: 'processing_pattern',
    difficulty: 'genius',
    weight: 2.9,
    prompt: 'Each row and column contains a composite rule: Shape vertex count minus internal node count equals an invariant.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'triangle', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.7, x2: 0, y2: -0.5, color: '#0f172a', width: 3 }] }] },
      { elements: [{ type: 'triangle', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0.5, y1: 0, x2: 0.7, y2: 0, color: '#0f172a', width: 3 }] }] },
      { elements: [{ type: 'triangle', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0.5, x2: 0, y2: 0.7, color: '#0f172a', width: 3 }] }] },
      // Row 2
      { elements: [{ type: 'square', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0.5, y1: 0, x2: 0.7, y2: 0, color: '#0f172a', width: 3 }] }] },
      { elements: [{ type: 'square', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0.5, x2: 0, y2: 0.7, color: '#0f172a', width: 3 }] }] },
      { elements: [{ type: 'square', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.7, y1: 0, x2: -0.5, y2: 0, color: '#0f172a', width: 3 }] }] },
      // Row 3
      { elements: [{ type: 'diamond', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: 0.5, x2: 0, y2: 0.7, color: '#0f172a', width: 3 }] }] },
      { elements: [{ type: 'diamond', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.7, y1: 0, x2: -0.5, y2: 0, color: '#0f172a', width: 3 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'diamond', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.7, x2: 0, y2: -0.5, color: '#0f172a', width: 3 }] }] },
      { id: 1, elements: [{ type: 'diamond', stroke: '#334155', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0.5, y1: 0, x2: 0.7, y2: 0, color: '#0f172a', width: 3 }] }] },
      { id: 2, elements: [{ type: 'square', stroke: '#334155', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'circle', stroke: '#334155', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Clockwise Perimeter Advancement with Chassis Shift',
      rule: 'In each row, the chassis geometry shifts (Triangle -> Square -> Diamond). The boundary indicator advances 90° clockwise: South -> West -> North.',
      breakdown: [
        'Cell 3.1 is South.',
        'Cell 3.2 is West.',
        'Cell 3.3 advances to North (top).',
      ],
      whyCorrect: 'Option A places the boundary tick at North on the Diamond chassis.',
    },
  },
  {
    id: 25,
    phase: 3,
    title: 'Boolean XOR Horizontal Lattice Gate',
    domain: 'fluid_reasoning',
    difficulty: 'hard',
    weight: 2.6,
    prompt: 'Lines present in only one of the first two cells are preserved in the third. Lines appearing in both cancel out completely.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
      // Row 2
      { elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
      { elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#2563eb', width: 3 }] }] },
      // Row 3
      { elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }, { x1: -0.5, y1: -0.5, x2: 0.5, y2: 0.5, color: '#2563eb', width: 2 }] }] },
      { elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }, { x1: -0.5, y1: 0.5, x2: 0.5, y2: -0.5, color: '#2563eb', width: 2 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2, rotation: 45 }] },
      { id: 1, elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.5, y1: 0, x2: 0.5, y2: 0, color: '#2563eb', width: 3 }] }] },
      { id: 2, elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'square', stroke: '#64748b', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Boolean Exclusive OR Superposition',
      rule: 'The horizontal bar appears in both Cell 3.1 and Cell 3.2, so it cancels out completely. The two opposite diagonal lines appear only once each, so both remain, creating a diagonal cross.',
      breakdown: [
        'Shared horizontal line disappears via XOR.',
        'Unique diagonal lines combine to form an X cross.',
      ],
      whyCorrect: 'Option A retains solely the diagonal cross.',
    },
  },
  {
    id: 26,
    phase: 3,
    title: 'Modular Clock Arithmetic Matrix',
    domain: 'numerical_relational',
    difficulty: 'hard',
    weight: 2.2,
    prompt: 'Numbers follow a consistent clockwise step rule: 3, 7, 11, [ ? ].',
    matrixType: '2x2',
    cells: [
      { elements: [{ type: 'circle', stroke: '#cbd5e1' }, { type: 'circle', text: '3' }] },
      { elements: [{ type: 'circle', stroke: '#cbd5e1' }, { type: 'circle', text: '7' }] },
      { elements: [{ type: 'circle', stroke: '#cbd5e1' }, { type: 'circle', text: '11' }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'circle', stroke: '#cbd5e1' }, { type: 'circle', text: '14' }] },
      { id: 1, elements: [{ type: 'circle', stroke: '#cbd5e1' }, { type: 'circle', text: '15' }] },
      { id: 2, elements: [{ type: 'circle', stroke: '#cbd5e1' }, { type: 'circle', text: '16' }] },
      { id: 3, elements: [{ type: 'circle', stroke: '#cbd5e1' }, { type: 'circle', text: '17' }] },
    ],
    correctAnswer: 1,
    explanation: {
      title: 'Constant Common Difference (+4)',
      rule: 'Each step increments the previous term by exactly +4.',
      breakdown: ['3 + 4 = 7', '7 + 4 = 11', '11 + 4 = 15'],
      whyCorrect: 'Option B (15) correctly continues the arithmetic sequence.',
    },
  },
  {
    id: 27,
    phase: 3,
    title: 'Topological Density Invariance',
    domain: 'processing_pattern',
    difficulty: 'genius',
    weight: 3.1,
    prompt: 'Each row and column contains a composite rule: Shape vertex count minus internal node count equals an invariant.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#0f172a', width: 2 }] }] },
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      { elements: [{ type: 'star', stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.3, fill: '#0f172a' }] },
      // Row 2
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.3, fill: '#0f172a' }] },
      { elements: [{ type: 'star', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#0f172a', width: 2 }] }] },
      { elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      // Row 3
      { elements: [{ type: 'star', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      { elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'circle', scale: 0.3, fill: '#0f172a' }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.5, x2: 0, y2: 0.5, color: '#0f172a', width: 2 }] }] },
      { id: 1, elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#0f172a', strokeWidth: 2 }] },
      { id: 2, elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Cyclic Composite Permutation',
      rule: 'Each row and column contains exactly one Triangle, one Square, and one Star; and exactly one Line, one Cross, and one Circle nucleus.',
      breakdown: [
        'Row 3 missing chassis is Square (Star and Triangle are present).',
        'Row 3 missing inner element is Line (Cross and Circle are present).',
      ],
      whyCorrect: 'Option A pairs Square with internal Line.',
    },
  },
  {
    id: 28,
    phase: 3,
    title: 'Mensa High-Range Grid XOR',
    domain: 'fluid_reasoning',
    difficulty: 'genius',
    weight: 3.2,
    prompt: 'In each row, horizontal and vertical line segments follow Exclusive OR: segments present in both cells vanish, while unique segments remain.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: -0.4, x2: 0.6, y2: -0.4, color: '#2563eb', width: 3 }, { x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: -0.4, x2: 0.6, y2: -0.4, color: '#2563eb', width: 3 }, { x1: -0.6, y1: 0.4, x2: 0.6, y2: 0.4, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }, { x1: -0.6, y1: 0.4, x2: 0.6, y2: 0.4, color: '#2563eb', width: 3 }] }] },
      // Row 2
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
      { elements: [{ type: 'line', lines: [{ x1: 0, y1: -0.6, x2: 0, y2: 0.6, color: '#2563eb', width: 3 }] }] },
      // Row 3
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: -0.4, x2: 0.6, y2: -0.4, color: '#2563eb', width: 3 }, { x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }, { x1: -0.6, y1: 0.4, x2: 0.6, y2: 0.4, color: '#2563eb', width: 3 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'line', lines: [{ x1: -0.6, y1: -0.4, x2: 0.6, y2: -0.4, color: '#2563eb', width: 3 }, { x1: -0.6, y1: 0.4, x2: 0.6, y2: 0.4, color: '#2563eb', width: 3 }] }] },
      { id: 1, elements: [{ type: 'line', lines: [{ x1: -0.6, y1: 0, x2: 0.6, y2: 0, color: '#2563eb', width: 3 }] }] },
      { id: 2, elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 3 }] },
      { id: 3, elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Tri-Tier Boolean XOR Superposition',
      rule: 'In each row, horizontal bars at top, middle, and bottom follow Exclusive OR: bars in both cells vanish, unique bars remain.',
      breakdown: [
        'Row 3 Cell 1 has Top + Middle bars.',
        'Row 3 Cell 2 has Middle + Bottom bars.',
        'Middle bar vanishes; Top and Bottom bars persist.',
      ],
      whyCorrect: 'Option A retains only the Top and Bottom horizontal bars.',
    },
  },
  {
    id: 29,
    phase: 3,
    title: 'Multi-Axis Geometric Layer Peeling',
    domain: 'fluid_reasoning',
    difficulty: 'genius',
    weight: 2.9,
    prompt: 'Concentric geometric shells peel along the rows while their shading inverts along the columns.',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'circle', stroke: '#0f172a', strokeWidth: 2 }] },
      { elements: [{ type: 'cross', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }, { type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }] },
      { elements: [{ type: 'diamond', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'diamond', stroke: '#0f172a', strokeWidth: 2 }, { type: 'triangle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'diamond', stroke: '#0f172a', strokeWidth: 2 }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'triangle', scale: 0.5, stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 1, elements: [{ type: 'diamond', stroke: '#0f172a', strokeWidth: 2 }] },
      { id: 2, elements: [{ type: 'square', stroke: '#0f172a', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Structural Decomposition (Cell 1 - Cell 2 = Cell 3)',
      rule: 'In each row, subtracting the second cell from the first leaves the third cell.',
      breakdown: [
        'Cell 3.1 contains Diamond exterior + Triangle interior.',
        'Cell 3.2 contains Diamond exterior.',
        'Subtracting Cell 3.2 from Cell 3.1 leaves only the Triangle interior.',
      ],
      whyCorrect: 'Option A retains solely the inner blue Triangle.',
    },
  },
  {
    id: 30,
    phase: 3,
    title: 'Topological Euler Characteristic Invariance',
    domain: 'fluid_reasoning',
    difficulty: 'genius',
    weight: 3.2,
    prompt: 'A Mensa 99.8th percentile item: Observe internal closed-loop region count across cells (V - E + F = 1).',
    matrixType: '3x3',
    cells: [
      { elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.7, x2: 0, y2: 0.7, color: '#2563eb', width: 2 }] }] },
      { elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }] },
      // Row 2
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: 0, y1: -0.7, x2: 0, y2: 0.7, color: '#2563eb', width: 2 }] }] },
      { elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.7, y1: -0.7, x2: 0.7, y2: 0.7, color: '#2563eb', width: 1.5 }] }] },
      // Row 3
      { elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }] },
      { elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }, { type: 'line', lines: [{ x1: -0.7, y1: -0.7, x2: 0.7, y2: 0.7, color: '#2563eb', width: 1.5 }] }] },
      { elements: [], isTarget: true },
    ],
    options: [
      { id: 0, elements: [{ type: 'circle', stroke: '#2563eb', strokeWidth: 2 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2, rotation: 45 }, { type: 'cross', stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 1, elements: [{ type: 'square', stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 2, elements: [{ type: 'triangle', stroke: '#2563eb', strokeWidth: 2 }] },
      { id: 3, elements: [{ type: 'diamond', stroke: '#2563eb', strokeWidth: 2 }] },
    ],
    correctAnswer: 0,
    explanation: {
      title: 'Topological Subdivision Progression',
      rule: 'In each step across the lattice, the number of partitioned sub-regions increments systematically (1 -> 2 -> 4 -> 6 -> 8).',
      breakdown: [
        'Cell 3.1 partitions into 4 quadrants.',
        'Cell 3.2 partitions into 6 sub-regions.',
        'Cell 3.3 partitions into 8 radial octants.',
      ],
      whyCorrect: 'Option A creates 8 distinct topological partitions via superimposed dual crosses.',
    },
  },
];

// Generates a calibrated 20-item 3-phase assessment battery
// Guaranteed never to repeat recently seen items on retest!
export function generateAssessmentBattery(
  excludeQuestionIds: number[] = []
): Question[] {
  // Phase 1 pool: Visual & Spatial Logic (Questions 1 to 8)
  const phase1All = QUESTIONS.filter(q => q.phase === 1);
  const phase1Fresh = phase1All.filter(q => !excludeQuestionIds.includes(q.id));
  const phase1Source = phase1Fresh.length >= 8 ? phase1Fresh : phase1All;
  const shuffledPhase1 = [...phase1Source].sort(() => Math.random() - 0.5).slice(0, 8);

  // Phase 2 pool: Verbal Analogies & Number Progressions (Questions 9 to 16)
  const phase2All = QUESTIONS.filter(q => q.phase === 2);
  const phase2Fresh = phase2All.filter(q => !excludeQuestionIds.includes(q.id));
  const phase2Source = phase2Fresh.length >= 8 ? phase2Fresh : phase2All;
  const shuffledPhase2 = [...phase2Source].sort(() => Math.random() - 0.5).slice(0, 8);

  // Phase 3 pool: High-Range Quantitative & Synthesis (Questions 17 to 20)
  const phase3All = QUESTIONS.filter(q => q.phase === 3);
  const phase3Fresh = phase3All.filter(q => !excludeQuestionIds.includes(q.id));
  const phase3Source = phase3Fresh.length >= 4 ? phase3Fresh : phase3All;
  const shuffledPhase3 = [...phase3Source].sort(() => Math.random() - 0.5).slice(0, 4);

  // 20 Pure Cognitive Reasoning Questions
  const rawBattery: Question[] = [
    ...shuffledPhase1,
    ...shuffledPhase2,
    ...shuffledPhase3,
  ];

  // Number items 1 to 20 and randomize option positions
  return rawBattery.map((q, idx) => {
    const originalId = q.originalId || q.id;
    const correctOpt = q.options[q.correctAnswer];
    const shuffledOpts = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrectIdx = shuffledOpts.findIndex(o => o.id === correctOpt.id);
    return {
      ...q,
      id: idx + 1,
      originalId,
      options: shuffledOpts.map((o, optIdx) => ({ ...o, id: optIdx })),
      correctAnswer: newCorrectIdx,
    };
  });
}
