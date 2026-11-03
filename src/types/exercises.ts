export type ExerciseType = 
  | 'spatial_memory'
  | 'sequence_recall'
  | 'mental_rotation'
  | 'pattern_blitz';

export interface ExerciseMeta {
  id: ExerciseType;
  title: string;
  category: string;
  tagline: string;
  description: string;
  cognitivePillar: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Adaptive';
  duration: string;
  metricLabel: string;
}

export interface ExerciseScoreRecord {
  id: string;
  exerciseId: ExerciseType;
  date: string;
  score: number;
  maxLevel: number;
  accuracy: number;
  summary: string;
}

export const EXERCISES: ExerciseMeta[] = [
  {
    id: 'spatial_memory',
    title: 'Spatial Grid Recall',
    category: 'Visual-Spatial Working Memory',
    tagline: 'Sequential visual location memory',
    description: 'Observe illuminated tile sequences on a 4×4 spatial matrix and reproduce the exact sequential pathway as span length increases.',
    cognitivePillar: 'Working Memory (Gwm)',
    difficulty: 'Adaptive',
    duration: '3–5 Min',
    metricLabel: 'Spatial Span (Target: 6+)',
  },
  {
    id: 'sequence_recall',
    title: 'Working Memory Span',
    category: 'Phonological Working Memory',
    tagline: 'Digit recall & reverse manipulation',
    description: 'Flash numerical sequences of expanding lengths. Train both forward recall and reverse executive working memory manipulation.',
    cognitivePillar: 'Executive Attention (Gs)',
    difficulty: 'Adaptive',
    duration: '3–5 Min',
    metricLabel: 'Digit Span (Target: 7+)',
  },
  {
    id: 'mental_rotation',
    title: 'Mental Rotation Sprint',
    category: 'Spatial Perception & 3D Logic',
    tagline: 'Shepard-Metzler spatial rotation',
    description: 'Rapidly discern whether two 2D/3D shapes are identical rotated configurations or mirrored distractors under time constraints.',
    cognitivePillar: 'Spatial Visualization (Gv)',
    difficulty: 'Advanced',
    duration: '45 Sec',
    metricLabel: 'Accuracy & Reaction Speed',
  },
  {
    id: 'pattern_blitz',
    title: 'Pattern Matrix Blitz',
    category: 'Fluid Reasoning & Processing',
    tagline: 'Speeded matrix rule extraction',
    description: 'Timed progressive matrix problems. Solve pattern logic, rotation, and boolean superposition as fast as possible.',
    cognitivePillar: 'Fluid Intelligence (Gf)',
    difficulty: 'Intermediate',
    duration: '45 Sec',
    metricLabel: 'Pattern Throughput',
  },
];
