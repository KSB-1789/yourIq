import type { TestResult } from '../types';

const STORAGE_KEY = 'standard_assessment_history_v1';

export function getHistory(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveResult(result: TestResult): TestResult[] {
  try {
    const current = getHistory();
    // Avoid duplicate IDs
    const filtered = current.filter(r => r.assessmentId !== result.assessmentId);
    const updated = [result, ...filtered].slice(0, 20); // Keep latest 20
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [result];
  }
}

export function deleteResult(assessmentId: string): TestResult[] {
  try {
    const current = getHistory();
    const updated = current.filter(r => r.assessmentId !== assessmentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
