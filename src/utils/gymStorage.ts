import type { ExerciseType } from '../types/exercises';

export interface ExerciseRecord {
  bestScore: number;
  bestMetricLabel: string;
  bestMetricValue: number | string;
  lastPlayed: string;
}

export type GymRecords = Partial<Record<ExerciseType, ExerciseRecord>>;

const GYM_STORAGE_KEY = 'cognitive_gym_records_v1';

export function getGymRecords(): GymRecords {
  try {
    const raw = localStorage.getItem(GYM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveGymScore(
  id: ExerciseType,
  metricLabel: string,
  metricValue: number | string,
  metricNumericVal: number
): GymRecords {
  try {
    const current = getGymRecords();
    const existing = current[id];

    const isNewBest = !existing || metricNumericVal > (existing.bestScore || 0);

    const updated: GymRecords = {
      ...current,
      [id]: {
        bestScore: isNewBest ? metricNumericVal : (existing?.bestScore ?? metricNumericVal),
        bestMetricLabel: metricLabel,
        bestMetricValue: isNewBest ? metricValue : (existing?.bestMetricValue ?? metricValue),
        lastPlayed: new Date().toISOString(),
      },
    };

    localStorage.setItem(GYM_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return {};
  }
}
