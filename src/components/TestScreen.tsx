import React, { useState, useEffect, useCallback } from 'react';
import type { Question, UserResponse, MemoryCheckpoint } from '../types';
import type { TripleMemoryBattery } from '../data/questions';
import { saveActiveSession, type TestStage } from '../utils/testStorage';
import { MatrixCellSvg } from './MatrixSvg';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  Key,
  ArrowRight,
  Brain,
  Layers,
  Sparkles,
} from 'lucide-react';

export type { TestStage };

interface TestScreenProps {
  sessionId?: string;
  questions: Question[];
  memoryBattery: TripleMemoryBattery;
  responses: Record<number, UserResponse>;
  initialStage?: TestStage;
  initialCurrentIndex?: number;
  initialSecondsElapsed?: number;
  initialIsPaused?: boolean;
  initialCheckpoint1Choice?: number | null;
  initialCheckpoint2Choice?: number | null;
  initialCheckpoint3Choice?: number | null;
  onAnswer: (questionId: number, optionId: number) => void;
  onToggleFlag: (questionId: number) => void;
  onSubmit: (totalTimeSeconds: number, checkpoints: MemoryCheckpoint[]) => void;
}

export const TestScreen: React.FC<TestScreenProps> = ({
  sessionId = 'default_session',
  questions,
  memoryBattery,
  responses,
  initialStage = 'anchor1',
  initialCurrentIndex = 0,
  initialSecondsElapsed = 0,
  initialIsPaused = false,
  initialCheckpoint1Choice = null,
  initialCheckpoint2Choice = null,
  initialCheckpoint3Choice = null,
  onAnswer,
  onToggleFlag,
  onSubmit,
}) => {
  const [stage, setStage] = useState<TestStage>(initialStage);
  const [currentIndex, setCurrentIndex] = useState(initialCurrentIndex);
  const [secondsElapsed, setSecondsElapsed] = useState(initialSecondsElapsed);
  const [isPaused, setIsPaused] = useState(initialIsPaused);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Checkpoint answers: option indices (0 to 3) or null
  const [checkpoint1Choice, setCheckpoint1Choice] = useState<number | null>(initialCheckpoint1Choice);
  const [checkpoint2Choice, setCheckpoint2Choice] = useState<number | null>(initialCheckpoint2Choice);
  const [checkpoint3Choice, setCheckpoint3Choice] = useState<number | null>(initialCheckpoint3Choice);

  // Temporary selection inside current checkpoint screen
  const [tempCheckpointChoice, setTempCheckpointChoice] = useState<number | null>(null);

  // Keep active test session continuously synchronized to localStorage
  useEffect(() => {
    saveActiveSession({
      sessionId,
      questions,
      memoryBattery,
      responses,
      stage,
      currentIndex,
      secondsElapsed,
      isPaused,
      checkpoint1Choice,
      checkpoint2Choice,
      checkpoint3Choice,
      lastUpdated: Date.now(),
    });
  }, [
    sessionId,
    questions,
    memoryBattery,
    responses,
    stage,
    currentIndex,
    secondsElapsed,
    isPaused,
    checkpoint1Choice,
    checkpoint2Choice,
    checkpoint3Choice,
  ]);

  // Persist snapshot immediately on page refresh, tab switch, or browser close
  useEffect(() => {
    const handleUnloadOrHide = () => {
      saveActiveSession({
        sessionId,
        questions,
        memoryBattery,
        responses,
        stage,
        currentIndex,
        secondsElapsed,
        isPaused: true, // Always paused upon browser reload/tab switch to protect user's time score
        checkpoint1Choice,
        checkpoint2Choice,
        checkpoint3Choice,
        lastUpdated: Date.now(),
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && stage === 'questions') {
        setIsPaused(true);
        handleUnloadOrHide();
      }
    };

    window.addEventListener('beforeunload', handleUnloadOrHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleUnloadOrHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    sessionId,
    questions,
    memoryBattery,
    responses,
    stage,
    currentIndex,
    secondsElapsed,
    checkpoint1Choice,
    checkpoint2Choice,
    checkpoint3Choice,
  ]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const userResp = responses[currentQuestion?.id];
  const selectedOption = userResp?.selectedOption ?? null;
  const isFlagged = userResp?.isFlagged ?? false;

  // Timer only runs during actual question solving
  useEffect(() => {
    if (stage !== 'questions' || isPaused) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, isPaused]);

  // Next Item handler enforcing checkpoint checkpoints
  const handleNextItem = useCallback(() => {
    if (currentIndex === 7 && checkpoint1Choice === null) {
      setTempCheckpointChoice(null);
      setStage('checkpoint1');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentIndex === 15 && checkpoint2Choice === null) {
      setTempCheckpointChoice(null);
      setStage('checkpoint2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentIndex === questions.length - 1) {
      if (checkpoint3Choice === null) {
        setTempCheckpointChoice(null);
        setStage('checkpoint3');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setShowSubmitModal(true);
      }
      return;
    }
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, checkpoint1Choice, checkpoint2Choice, checkpoint3Choice, questions.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (stage !== 'questions' || isPaused || showSubmitModal) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIndex = parseInt(e.key, 10) - 1;
        if (optIndex < currentQuestion.options.length) {
          onAnswer(currentQuestion.id, optIndex);
        }
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
        const optIndex = map[e.key.toLowerCase()];
        if (optIndex < currentQuestion.options.length) {
          onAnswer(currentQuestion.id, optIndex);
        }
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        handleNextItem();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key.toLowerCase() === 'f') {
        onToggleFlag(currentQuestion.id);
      }
    },
    [stage, isPaused, showSubmitModal, currentQuestion, currentIndex, questions.length, onAnswer, onToggleFlag, handleNextItem]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.values(responses).filter(r => r.selectedOption !== null).length;
  const unansweredCount = questions.length - answeredCount;

  // Compile full checkpoints payload and submit
  const finalizeSubmission = (finalCp3Choice: number) => {
    const cp1: MemoryCheckpoint = {
      id: 1,
      type: 'word',
      label: 'Verbal Word Trace (Phase 1)',
      target: memoryBattery.step1.target,
      options: memoryBattery.step1.options,
      correctOptionIndex: memoryBattery.step1.correctIndex,
      userSelectedIndex: checkpoint1Choice,
      isCorrect: checkpoint1Choice === memoryBattery.step1.correctIndex,
      phaseContext: 'Evaluated post Question 8 under spatial problem load',
    };
    const cp2: MemoryCheckpoint = {
      id: 2,
      type: 'code',
      label: 'Alphanumeric Code Trace (Phase 2)',
      target: memoryBattery.step2.target,
      options: memoryBattery.step2.options,
      correctOptionIndex: memoryBattery.step2.correctIndex,
      userSelectedIndex: checkpoint2Choice,
      isCorrect: checkpoint2Choice === memoryBattery.step2.correctIndex,
      phaseContext: 'Evaluated post Question 16 under quantitative induction load',
    };
    const cp3: MemoryCheckpoint = {
      id: 3,
      type: 'compound',
      label: 'Compound Key Trace (Phase 3)',
      target: memoryBattery.step3.target,
      options: memoryBattery.step3.options,
      correctOptionIndex: memoryBattery.step3.correctIndex,
      userSelectedIndex: finalCp3Choice,
      isCorrect: finalCp3Choice === memoryBattery.step3.correctIndex,
      phaseContext: 'Evaluated post Question 20 under Mensa high-ceiling load',
    };
    onSubmit(secondsElapsed, [cp1, cp2, cp3]);
  };

  // ============================================================
  // INTERSTITIAL 1: PHASE 1 ANCHOR (WORD)
  // ============================================================
  if (stage === 'anchor1') {
    return (
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 sm:py-20 animate-fade-in">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 mb-6">
            <Brain className="h-7 w-7" />
          </div>

          <span className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Memory Anchor 1 of 3 • Verbal Trace
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Commit Word to Memory
          </h2>

          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Commit the following word to memory now. <strong>Do not write it down</strong>. You will be prompted to recall this word under cognitive load after Question 8.
          </p>

          <div className="my-8 rounded-2xl border-2 border-slate-900 bg-slate-900 py-6 px-8 text-3xl sm:text-4xl font-extrabold tracking-widest text-white font-mono shadow-md">
            {memoryBattery.step1.target}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setStage('questions');
                setCurrentIndex(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 hover:scale-[1.02]"
            >
              <span>I Have Memorized It — Begin Phase 1 (Q1–Q8)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6 text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-900 block">Phase 1 (Q1–8)</span>
              <span>Abstract & Spatial</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Phase 2 (Q9–16)</span>
              <span>Quantitative Series</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Phase 3 (Q17–20)</span>
              <span>Mensa Synthesis</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // INTERSTITIAL 2: CHECKPOINT 1 RECALL (POST-Q8)
  // ============================================================
  if (stage === 'checkpoint1') {
    return (
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 sm:py-20 animate-fade-in">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-6 border border-amber-200">
            <Key className="h-7 w-7" />
          </div>

          <span className="rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
            Delayed Memory Checkpoint 1 of 3
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Recall Assigned Word
          </h2>

          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Before beginning Question 1, you committed an assigned verbal word to memory. Select your exact word below:
          </p>

          {/* 4 Choices */}
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {memoryBattery.step1.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = tempCheckpointChoice === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setTempCheckpointChoice(idx)}
                  className={`group relative flex items-center justify-between rounded-2xl border p-4.5 transition-all focus:outline-none ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-mono text-base font-bold text-slate-900 tracking-wide">
                      {opt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            disabled={tempCheckpointChoice === null}
            onClick={() => {
              if (tempCheckpointChoice === null) return;
              setCheckpoint1Choice(tempCheckpointChoice);
              setStage('anchor2');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40"
          >
            <span>Confirm Word Recall & Proceed</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // INTERSTITIAL 3: PHASE 2 ANCHOR (CODE)
  // ============================================================
  if (stage === 'anchor2') {
    return (
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 sm:py-20 animate-fade-in">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 mb-6">
            <Brain className="h-7 w-7" />
          </div>

          <span className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Memory Anchor 2 of 3 • Alphanumeric Trace
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Commit Alphanumeric Code
          </h2>

          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Now commit this sequence to memory. You will be prompted to recall it under cognitive load after Question 16.
          </p>

          <div className="my-8 rounded-2xl border-2 border-slate-900 bg-slate-900 py-6 px-8 text-3xl sm:text-4xl font-extrabold tracking-widest text-white font-mono shadow-md">
            {memoryBattery.step2.target}
          </div>

          <button
            onClick={() => {
              setStage('questions');
              setCurrentIndex(8); // Begin Question 9
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 hover:scale-[1.02]"
          >
            <span>I Have Memorized It — Begin Phase 2 (Q9–Q16)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // INTERSTITIAL 4: CHECKPOINT 2 RECALL (POST-Q16)
  // ============================================================
  if (stage === 'checkpoint2') {
    return (
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 sm:py-20 animate-fade-in">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-6 border border-amber-200">
            <Key className="h-7 w-7" />
          </div>

          <span className="rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
            Delayed Memory Checkpoint 2 of 3
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Recall Alphanumeric Code
          </h2>

          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Before beginning Phase 2 (Question 9), you committed an alphanumeric code to memory. Select your exact code below:
          </p>

          {/* 4 Choices */}
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {memoryBattery.step2.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = tempCheckpointChoice === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setTempCheckpointChoice(idx)}
                  className={`group relative flex items-center justify-between rounded-2xl border p-4.5 transition-all focus:outline-none ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-mono text-base font-bold text-slate-900 tracking-wide">
                      {opt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            disabled={tempCheckpointChoice === null}
            onClick={() => {
              if (tempCheckpointChoice === null) return;
              setCheckpoint2Choice(tempCheckpointChoice);
              setStage('anchor3');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40"
          >
            <span>Confirm Code Recall & Proceed</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // INTERSTITIAL 5: PHASE 3 ANCHOR (COMPOUND)
  // ============================================================
  if (stage === 'anchor3') {
    return (
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 sm:py-20 animate-fade-in">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 mb-6">
            <Layers className="h-7 w-7" />
          </div>

          <span className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Memory Anchor 3 of 3 • Final Compound Trace
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Commit Compound Identifier
          </h2>

          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Commit this compound identifier to memory. You will be tested after the high-ceiling Mensa section (Question 20).
          </p>

          <div className="my-8 rounded-2xl border-2 border-slate-900 bg-slate-900 py-6 px-8 text-3xl sm:text-4xl font-extrabold tracking-widest text-white font-mono shadow-md">
            {memoryBattery.step3.target}
          </div>

          <button
            onClick={() => {
              setStage('questions');
              setCurrentIndex(16); // Begin Question 17
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 hover:scale-[1.02]"
          >
            <span>I Have Memorized It — Begin Phase 3 (Q17–Q20)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // INTERSTITIAL 6: CHECKPOINT 3 RECALL (FINAL POST-Q20)
  // ============================================================
  if (stage === 'checkpoint3') {
    return (
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 sm:py-20 animate-fade-in">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 border border-emerald-200">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Delayed Memory Checkpoint 3 of 3 • Final Verification
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Recall Compound Identifier
          </h2>

          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Select the exact compound identifier you committed to memory before entering the high-ceiling section:
          </p>

          {/* 4 Choices */}
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {memoryBattery.step3.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = tempCheckpointChoice === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setTempCheckpointChoice(idx)}
                  className={`group relative flex items-center justify-between rounded-2xl border p-4.5 transition-all focus:outline-none ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-mono text-base font-bold text-slate-900 tracking-wide">
                      {opt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            disabled={tempCheckpointChoice === null}
            onClick={() => {
              if (tempCheckpointChoice === null) return;
              setCheckpoint3Choice(tempCheckpointChoice);
              finalizeSubmission(tempCheckpointChoice);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40"
          >
            <span>Complete Assessment & Calculate Certified Score</span>
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN QUESTION SOLVING VIEW (QUESTIONS 1 TO 20)
  // ============================================================
  const phaseTitle =
    currentQuestion?.phase === 1
      ? 'Phase 1: Abstract & Spatial Logic'
      : currentQuestion?.phase === 2
      ? 'Phase 2: Verbal & Quantitative Induction'
      : 'Phase 3: High-Range Mensa Synthesis';

  const difficultyStyles = {
    easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    medium: 'text-blue-700 bg-blue-50 border-blue-200',
    hard: 'text-amber-700 bg-amber-50 border-amber-200',
    genius: 'text-purple-700 bg-purple-50 border-purple-200',
  };

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-8">
      {/* Top Test Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        {/* Progress & Phase Info */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Phase {currentQuestion.phase}
              </span>
              <span className="text-xs text-slate-500 hidden md:inline">
                {phaseTitle}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
                Question {currentIndex + 1}
              </span>
              <span className="text-sm font-medium text-slate-400">
                of {questions.length}
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block ml-2" />
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-900" />
            <span>{answeredCount} of {questions.length} Items Answered</span>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-sm font-semibold text-slate-700 shadow-2xs">
            <Clock className="h-4 w-4 text-slate-500" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume' : 'Pause'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>

          <button
            onClick={() => onToggleFlag(currentQuestion.id)}
            title="Flag for review"
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition shadow-2xs ${
              isFlagged
                ? 'border-amber-300 bg-amber-50 text-amber-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Flag className={`h-4 w-4 ${isFlagged ? 'fill-current text-amber-600' : ''}`} />
            <span className="hidden sm:inline">Flag</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-slate-900 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Workspace */}
      {isPaused ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 sm:p-16 text-center shadow-2xs animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-5 border border-amber-200 shadow-2xs">
            <Clock className="h-8 w-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Assessment Paused
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-md">
            Your progress is safely stored in local browser storage. Take a break, and resume whenever you are ready.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
              Item {currentIndex + 1} of {questions.length}
            </span>
            <span>•</span>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
              {answeredCount} of {questions.length} Answered
            </span>
            <span>•</span>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
              {formatTime(secondsElapsed)} Elapsed
            </span>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Sparkles className="h-3 w-3" />
            <span>Progress automatically saved — safe to reload or return later</span>
          </div>

          <button
            onClick={() => setIsPaused(false)}
            className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 hover:scale-[1.02]"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Resume Assessment</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Question Left Pane: Puzzle Stimulus */}
          <div className="flex flex-col items-center justify-between rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-2xs lg:col-span-7">
            {/* Metadata Bar */}
            <div className="flex w-full items-center justify-between text-xs mb-6">
              <span className="font-bold text-slate-700 text-sm">
                {currentQuestion.title}
              </span>
              <span
                className={`rounded-full border px-3 py-1 font-semibold uppercase text-[10px] tracking-wider ${
                  difficultyStyles[currentQuestion.difficulty]
                }`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <p className="w-full text-center text-base font-medium text-slate-700 mb-6 max-w-lg">
              {currentQuestion.prompt}
            </p>

            {/* Dynamic Stimulus Display */}
            <div className="my-auto flex items-center justify-center py-4 w-full">
              {/* Type 1: Visual 3x3 Matrix */}
              {currentQuestion.matrixType === '3x3' && currentQuestion.cells && (
                <div className="grid grid-cols-3 gap-3.5 sm:gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
                  {currentQuestion.cells.map((cell, idx) => (
                    <MatrixCellSvg key={idx} cell={cell} size={105} />
                  ))}
                </div>
              )}

              {/* Type 2: Visual 2x2 Matrix */}
              {currentQuestion.matrixType === '2x2' && currentQuestion.cells && (
                <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
                  {currentQuestion.cells.map((cell, idx) => (
                    <MatrixCellSvg key={idx} cell={cell} size={125} />
                  ))}
                </div>
              )}

              {/* Type 3: Number Series Progression */}
              {currentQuestion.matrixType === 'number_series' && currentQuestion.numberSeries && (
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-6">
                  {currentQuestion.numberSeries.sequence.map((item, i) => (
                    <React.Fragment key={i}>
                      <div
                        className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-2 font-mono text-xl sm:text-2xl font-extrabold shadow-2xs transition ${
                          item === '?'
                            ? 'border-dashed border-blue-500 bg-blue-50 text-blue-600 animate-pulse'
                            : 'border-slate-200 bg-white text-slate-900'
                        }`}
                      >
                        {item}
                      </div>
                      {i < (currentQuestion.numberSeries?.sequence.length ?? 0) - 1 && (
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Type 4: Verbal Analogy */}
              {currentQuestion.matrixType === 'verbal_analogy' && currentQuestion.analogy && (
                <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md my-4">
                  <div className="flex items-center justify-center gap-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-2xs">
                    <span className="font-extrabold text-slate-900 text-lg sm:text-xl">
                      {currentQuestion.analogy.pairA[0]}
                    </span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span className="font-extrabold text-slate-900 text-lg sm:text-xl">
                      {currentQuestion.analogy.pairA[1]}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    is analogous to
                  </span>

                  <div className="flex items-center justify-center gap-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-2xs">
                    <span className="font-extrabold text-slate-900 text-lg sm:text-xl">
                      {currentQuestion.analogy.pairB[0]}
                    </span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span className="flex h-10 w-24 items-center justify-center rounded-xl border-2 border-dashed border-blue-500 bg-blue-50 text-blue-600 font-bold font-mono text-lg animate-pulse">
                      ?
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
              <span>Standard Progressive Matrix Battery</span>
              <span>Wechsler Normed Protocol</span>
            </div>
          </div>

          {/* Question Right Pane: Options & Controls */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-2xs lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Select Answer
                </h4>
                <span className="text-xs text-slate-400 font-medium">Shortcuts: 1, 2, 3, 4</span>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected = selectedOption === opt.id;
                  const hasText = Boolean(opt.text);

                  return (
                    <button
                      key={opt.id}
                      onClick={() => onAnswer(currentQuestion.id, opt.id)}
                      className={`group relative flex flex-col items-center justify-center rounded-2xl border p-4 transition-all focus:outline-none ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`absolute left-3.5 top-3 flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                        }`}
                      >
                        {letter}
                      </span>

                      <div className="py-2.5 flex items-center justify-center min-h-[60px] w-full">
                        {hasText ? (
                          <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tracking-wide">
                            {opt.text}
                          </span>
                        ) : opt.elements ? (
                          <MatrixCellSvg
                            cell={{ elements: opt.elements }}
                            size={85}
                            isSelected={isSelected}
                            className="border-none bg-transparent shadow-none"
                          />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNextItem}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
              >
                <span>
                  {currentIndex === 7 && checkpoint1Choice === null
                    ? 'Submit Phase 1 & Recall'
                    : currentIndex === 15 && checkpoint2Choice === null
                    ? 'Submit Phase 2 & Recall'
                    : currentIndex === questions.length - 1
                    ? 'Final Memory Verification'
                    : 'Next Item'}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Map */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <span className="font-bold uppercase tracking-wider text-slate-600 text-xs">
            Question Map
          </span>
          <div className="flex items-center gap-5 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-slate-900" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-400" /> Flagged
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-slate-300 bg-white" /> Unanswered
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-20 gap-2">
          {questions.map((q, idx) => {
            const isAnswered = responses[q.id]?.selectedOption !== null;
            const flagged = responses[q.id]?.isFlagged;
            const isCurrent = idx === currentIndex;

            // Check if this question is locked based on checkpoint progress
            const isLocked =
              (idx >= 8 && checkpoint1Choice === null) ||
              (idx >= 16 && checkpoint2Choice === null);

            return (
              <button
                key={q.id}
                disabled={isLocked}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition ${
                  isCurrent
                    ? 'ring-2 ring-slate-900 ring-offset-2'
                    : ''
                } ${
                  isLocked
                    ? 'opacity-30 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : flagged
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : isAnswered
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {idx + 1}
                {flagged && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-800 mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Submit Cognitive Assessment?
            </h3>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              You have answered <span className="font-bold text-slate-900">{answeredCount}</span> of{' '}
              <span className="font-bold text-slate-900">{questions.length}</span> items.
              {unansweredCount > 0 && (
                <span className="text-amber-600 block mt-1 font-medium">
                  {unansweredCount} item(s) remain unanswered. Unanswered items are scored as incorrect.
                </span>
              )}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              >
                Review Items
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  if (checkpoint3Choice === null) {
                    setTempCheckpointChoice(null);
                    setStage('checkpoint3');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    finalizeSubmission(checkpoint3Choice);
                  }
                }}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
              >
                Final Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};