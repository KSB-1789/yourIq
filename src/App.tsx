import { useState } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TestScreen } from './components/TestScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { AboutModal } from './components/AboutModal';
import { HistoryModal } from './components/HistoryModal';
import { ExerciseHub } from './components/exercises/ExerciseHub';
import { SpatialMemoryExercise } from './components/exercises/SpatialMemoryExercise';
import { SequenceRecallExercise } from './components/exercises/SequenceRecallExercise';
import { MentalRotationExercise } from './components/exercises/MentalRotationExercise';
import { PatternBlitzExercise } from './components/exercises/PatternBlitzExercise';
import { generateAssessmentBattery, generateTripleMemoryBattery, type TripleMemoryBattery } from './data/questions';
import type { UserResponse, TestResult, Question, MemoryCheckpoint } from './types';
import type { ExerciseType } from './types/exercises';
import { calculateTestResults } from './utils/scoring';
import { getHistory, saveResult, deleteResult, clearHistory } from './utils/history';
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  type ActiveTestSession,
} from './utils/testStorage';

const SEEN_IDS_KEY = 'cognitive_seen_question_ids_v1';

function getInitialSeenIds(): number[] {
  try {
    const raw = localStorage.getItem(SEEN_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function App() {
  // Check for any active in-progress assessment session
  const [activeSession, setActiveSession] = useState<ActiveTestSession | null>(() => getActiveSession());
  const [sessionId, setSessionId] = useState<string>(() => activeSession?.sessionId || `session_${Date.now()}`);

  const [currentTab, setCurrentTab] = useState<'assessment' | 'exercises'>('assessment');
  // If user reloaded/refreshed during a test, restore straight into the assessment screen!
  const [screen, setScreen] = useState<'welcome' | 'test' | 'results'>(() => {
    return activeSession ? 'test' : 'welcome';
  });
  const [activeExercise, setActiveExercise] = useState<ExerciseType | null>(null);

  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() => {
    return activeSession ? activeSession.questions : [];
  });
  const [responses, setResponses] = useState<Record<number, UserResponse>>(() => {
    return activeSession ? activeSession.responses : {};
  });
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<TestResult[]>(() => getHistory());
  const [memoryBattery, setMemoryBattery] = useState<TripleMemoryBattery>(() => {
    return activeSession ? activeSession.memoryBattery : generateTripleMemoryBattery();
  });
  const [seenQuestionIds, setSeenQuestionIds] = useState<number[]>(() => getInitialSeenIds());

  // Start a brand-new assessment test
  const handleStartAssessment = () => {
    const newSessionId = `session_${Date.now()}`;
    const memBattery = generateTripleMemoryBattery();
    setMemoryBattery(memBattery);
    const battery = generateAssessmentBattery(seenQuestionIds);
    setActiveQuestions(battery);
    setSessionId(newSessionId);

    // Track original question IDs that were picked to ensure freshness on retest
    const newPickedIds = battery.map(q => q.originalId || q.id);
    setSeenQuestionIds(prev => {
      const combined = [...prev, ...newPickedIds];
      const updated = combined.length > 35 ? newPickedIds : combined;
      try {
        localStorage.setItem(SEEN_IDS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    const initialResponses: Record<number, UserResponse> = {};
    battery.forEach(q => {
      initialResponses[q.id] = {
        questionId: q.id,
        selectedOption: null,
        timeSpentSeconds: 0,
        isFlagged: false,
      };
    });
    setResponses(initialResponses);

    const initialSession: ActiveTestSession = {
      sessionId: newSessionId,
      questions: battery,
      memoryBattery: memBattery,
      responses: initialResponses,
      stage: 'anchor1',
      currentIndex: 0,
      secondsElapsed: 0,
      isPaused: false,
      checkpoint1Choice: null,
      checkpoint2Choice: null,
      checkpoint3Choice: null,
      lastUpdated: Date.now(),
    };
    saveActiveSession(initialSession);
    setActiveSession(initialSession);

    setCurrentTab('assessment');
    setScreen('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resume in-progress assessment from localStorage
  const handleResumeAssessment = () => {
    const session = getActiveSession();
    if (session) {
      setActiveSession(session);
      setSessionId(session.sessionId);
      setActiveQuestions(session.questions);
      setMemoryBattery(session.memoryBattery);
      setResponses(session.responses);
      setCurrentTab('assessment');
      setScreen('test');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Discard in-progress assessment
  const handleDiscardActiveAssessment = () => {
    if (window.confirm('Discard your in-progress assessment? Your recorded answers and timer will be cleared.')) {
      clearActiveSession();
      setActiveSession(null);
      setResponses({});
      setActiveQuestions([]);
    }
  };

  // Record an answer and immediately persist to storage
  const handleAnswer = (questionId: number, optionId: number) => {
    setResponses(prev => {
      const updated = {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          questionId,
          selectedOption: optionId,
        },
      };
      const session = getActiveSession();
      if (session) {
        session.responses = updated;
        saveActiveSession(session);
      }
      return updated;
    });
  };

  // Toggle flag for review and persist to storage
  const handleToggleFlag = (questionId: number) => {
    setResponses(prev => {
      const updated = {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isFlagged: !prev[questionId]?.isFlagged,
        },
      };
      const session = getActiveSession();
      if (session) {
        session.responses = updated;
        saveActiveSession(session);
      }
      return updated;
    });
  };

  // Submit test, calculate scores, and persist to history
  const handleSubmit = (totalTimeSeconds: number, checkpoints: MemoryCheckpoint[]) => {
    clearActiveSession();
    setActiveSession(null);
    const results = calculateTestResults(activeQuestions, responses, totalTimeSeconds, checkpoints);
    setTestResult(results);
    const updatedHistory = saveResult(results);
    setHistoryList(updatedHistory);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe navigation home (keeps active session saved)
  const handleGoHome = () => {
    if (screen === 'test') {
      const current = getActiveSession();
      setActiveSession(current);
      setScreen('welcome');
    } else {
      setScreen('welcome');
      setActiveExercise(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake immediately with a new randomized set
  const handleRetake = () => {
    handleStartAssessment();
  };

  // Select a historical result to view
  const handleSelectHistoryResult = (item: TestResult) => {
    setTestResult(item);
    if (activeQuestions.length === 0) {
      setActiveQuestions(generateAssessmentBattery());
    }
    setCurrentTab('assessment');
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (assessmentId: string) => {
    const updated = deleteResult(assessmentId);
    setHistoryList(updated);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistoryList([]);
  };

  const activeSessionInfo = activeSession
    ? {
        currentIndex: activeSession.currentIndex,
        totalQuestions: activeSession.questions.length,
        secondsElapsed: activeSession.secondsElapsed,
        answeredCount: Object.values(responses || {}).filter(r => r.selectedOption !== null).length,
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-['Satoshi',system-ui,sans-serif] antialiased">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          if (tab === 'assessment') {
            setScreen('welcome');
          } else {
            setActiveExercise(null);
          }
        }}
        onGoHome={handleGoHome}
        isTesting={currentTab === 'assessment' && screen === 'test'}
        onReset={handleGoHome}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyList.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Assessment Section */}
        {currentTab === 'assessment' && (
          <>
            {screen === 'welcome' && (
              <WelcomeScreen
                onStart={handleStartAssessment}
                questionCount={20}
                latestResult={historyList[0] || null}
                onOpenHistory={() => setIsHistoryOpen(true)}
                activeSessionInfo={activeSessionInfo}
                onResume={handleResumeAssessment}
                onDiscardActive={handleDiscardActiveAssessment}
              />
            )}

            {screen === 'test' && activeQuestions.length > 0 && (
              <TestScreen
                key={sessionId}
                sessionId={sessionId}
                questions={activeQuestions}
                memoryBattery={memoryBattery}
                responses={responses}
                initialStage={activeSession?.stage || 'anchor1'}
                initialCurrentIndex={activeSession?.currentIndex || 0}
                initialSecondsElapsed={activeSession?.secondsElapsed || 0}
                initialIsPaused={activeSession?.isPaused ?? false}
                initialCheckpoint1Choice={activeSession?.checkpoint1Choice ?? null}
                initialCheckpoint2Choice={activeSession?.checkpoint2Choice ?? null}
                initialCheckpoint3Choice={activeSession?.checkpoint3Choice ?? null}
                onAnswer={handleAnswer}
                onToggleFlag={handleToggleFlag}
                onSubmit={handleSubmit}
              />
            )}

            {screen === 'results' && testResult && (
              <ResultsScreen
                result={testResult}
                questions={activeQuestions.length > 0 ? activeQuestions : generateAssessmentBattery()}
                onRetake={handleRetake}
                onGoHome={handleGoHome}
              />
            )}
          </>
        )}

        {/* Cognitive Exercises / Training Gym Section */}
        {currentTab === 'exercises' && (
          <>
            {activeExercise === null && (
              <ExerciseHub
                onSelectExercise={type => {
                  setActiveExercise(type);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onTakeTest={handleStartAssessment}
              />
            )}

            {activeExercise === 'spatial_memory' && (
              <SpatialMemoryExercise onBack={() => setActiveExercise(null)} />
            )}

            {activeExercise === 'sequence_recall' && (
              <SequenceRecallExercise onBack={() => setActiveExercise(null)} />
            )}

            {activeExercise === 'mental_rotation' && (
              <MentalRotationExercise onBack={() => setActiveExercise(null)} />
            )}

            {activeExercise === 'pattern_blitz' && (
              <PatternBlitzExercise onBack={() => setActiveExercise(null)} />
            )}
          </>
        )}
      </main>

      {/* Clean, Expansive Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:px-10 lg:px-16 text-center sm:flex-row sm:text-left">
          <div>
            <div className="font-bold text-slate-800 text-sm">
              Standardized Cognitive Assessment & Training Suite
            </div>
            <p className="mt-1 text-slate-400">
              Calibrated on Wechsler distribution norming (Mean 100, SD 15). Includes working memory, spatial reasoning, and pattern logic exercises.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <button
              onClick={() => {
                setCurrentTab('assessment');
                setScreen('welcome');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-800 transition"
            >
              Assessment
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentTab('exercises');
                setActiveExercise(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-800 transition"
            >
              Training Gym
            </button>
            <span>•</span>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-slate-800 transition"
            >
              History ({historyList.length})
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-slate-800 transition"
            >
              Methodology
            </button>
          </div>
        </div>
      </footer>

      {/* About & Methodology Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyList}
        onSelectResult={handleSelectHistoryResult}
        onDeleteResult={handleDeleteHistory}
        onClearAll={handleClearHistory}
      />
    </div>
  );
}

export default App;
