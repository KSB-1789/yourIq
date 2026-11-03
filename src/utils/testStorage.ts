import type { Question, UserResponse } from '../types';
import type { TripleMemoryBattery } from '../data/questions';

export type TestStage =
  | 'anchor1'
  | 'questions'
  | 'checkpoint1'
  | 'anchor2'
  | 'checkpoint2'
  | 'anchor3'
  | 'checkpoint3';

export interface ActiveTestSession {
  sessionId: string;
  questions: Question[];
  memoryBattery: TripleMemoryBattery;
  responses: Record<number, UserResponse>;
  stage: TestStage;
  currentIndex: number;
  secondsElapsed: number;
  isPaused: boolean;
  checkpoint1Choice: number | null;
  checkpoint2Choice: number | null;
  checkpoint3Choice: number | null;
  lastUpdated: number;
}

const ACTIVE_SESSION_KEY = 'cognitive_active_test_session_v1';

export function getActiveSession(): ActiveTestSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveTestSession;

    // Validate structure integrity
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.questions) &&
      parsed.questions.length > 0 &&
      parsed.memoryBattery &&
      typeof parsed.responses === 'object' &&
      typeof parsed.currentIndex === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveActiveSession(session: ActiveTestSession): void {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Graceful handling for quota exceeded or blocked storage
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {
    // Ignore
  }
}

export function hasActiveSession(): boolean {
  return getActiveSession() !== null;
}
