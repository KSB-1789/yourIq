export type CognitiveDomain = 
  | 'fluid_reasoning'
  | 'spatial_visual'
  | 'numerical_relational'
  | 'memory_recall'
  | 'processing_pattern';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'genius';

export type MatrixType = 
  | '3x3' 
  | '2x2' 
  | 'number_series' 
  | 'verbal_analogy' 
  | 'delayed_recall' 
  | 'odd_one_out';

export interface ShapeElement {
  type: 'circle' | 'square' | 'triangle' | 'diamond' | 'cross' | 'star' | 'polygon' | 'line' | 'dots' | 'composite';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rotation?: number;
  scale?: number;
  count?: number;
  nested?: ShapeElement[];
  customSvg?: string;
  gridDots?: boolean[];
  lines?: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; dashed?: boolean }[];
  text?: string;
}

export interface CellData {
  elements: ShapeElement[];
  isTarget?: boolean;
  label?: string;
}

export interface OptionData {
  id: number;
  text?: string; // For text/verbal/numerical options
  elements?: ShapeElement[]; // For visual SVG options
}

export interface Question {
  id: number;
  originalId?: number;
  title: string;
  phase: 1 | 2 | 3;
  domain: CognitiveDomain;
  difficulty: DifficultyLevel;
  weight: number;
  prompt: string;
  matrixType: MatrixType;
  // Specific data representations
  cells?: CellData[]; // For 3x3 or 2x2 visual puzzles
  numberSeries?: {
    sequence: (number | string)[];
    operation?: string;
  };
  analogy?: {
    pairA: [string, string];
    pairB: [string, string];
  };
  options: OptionData[];
  correctAnswer: number;
  explanation: {
    title: string;
    rule: string;
    breakdown: string[];
    whyCorrect: string;
  };
}

export interface UserResponse {
  questionId: number;
  selectedOption: number | null;
  timeSpentSeconds: number;
  isFlagged: boolean;
}

export interface DomainScore {
  domain: CognitiveDomain;
  name: string;
  shortDesc: string;
  score: number;
  percentile: number;
  correct: number;
  total: number;
  status: 'Superior' | 'Above Average' | 'High Average' | 'Average' | 'Standard';
  color: string;
}

export interface MemoryCheckpoint {
  id: 1 | 2 | 3;
  type: 'word' | 'code' | 'compound';
  label: string;
  target: string;
  options: string[];
  correctOptionIndex: number;
  userSelectedIndex: number | null;
  isCorrect: boolean;
  phaseContext: string;
}

export interface TestResult {
  assessmentId: string;
  timestamp: string;
  totalQuestions: number;
  correctCount: number;
  rawScorePercentage: number;
  iqScore: number;
  percentile: number;
  confidenceInterval: [number, number];
  classification: string;
  domainScores: DomainScore[];
  memoryRecallPassed: boolean;
  memoryCheckpoints?: MemoryCheckpoint[];
  memoryRetentionRate?: number;
  totalTimeSeconds: number;
  userResponses: Record<number, UserResponse>;
  verifiedHash: string;
}
