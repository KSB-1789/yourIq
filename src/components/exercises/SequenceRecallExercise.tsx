import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Brain, Check, Delete, ArrowRight } from 'lucide-react';
import { zToPercentile } from '../../utils/scoring';

interface SequenceRecallProps {
  onBack: () => void;
  onFinish?: (span: number, score: number) => void;
}

export const SequenceRecallExercise: React.FC<SequenceRecallProps> = ({ onBack, onFinish }) => {
  const [spanLength, setSpanLength] = useState(4);
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [phase, setPhase] = useState<'showing' | 'input' | 'correct' | 'wrong' | 'summary'>('showing');
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [peakSpan, setPeakSpan] = useState(4);

  const timerRef = useRef<number | null>(null);

  const startRound = useCallback((length: number) => {
    setUserInput([]);
    setPhase('showing');
    setCurrentDigit(null);

    const digits: number[] = [];
    while (digits.length < length) {
      const d = Math.floor(Math.random() * 10);
      if (digits.length === 0 || digits[digits.length - 1] !== d) {
        digits.push(d);
      }
    }
    setSequence(digits);

    let idx = 0;
    const flashNext = () => {
      if (idx < digits.length) {
        setCurrentDigit(digits[idx]);
        idx++;
        timerRef.current = window.setTimeout(() => {
          setCurrentDigit(null);
          timerRef.current = window.setTimeout(flashNext, 200);
        }, 750);
      } else {
        setCurrentDigit(null);
        setPhase('input');
      }
    };

    timerRef.current = window.setTimeout(flashNext, 600);
  }, []);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      startRound(spanLength);
    }, 50);
    return () => {
      clearTimeout(mountTimer);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [mode, spanLength, startRound]);

  const handleDigitPress = (d: number) => {
    if (phase !== 'input') return;
    if (userInput.length < sequence.length) {
      setUserInput(prev => [...prev, d]);
    }
  };

  const handleDelete = () => {
    if (phase !== 'input') return;
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleVerify = () => {
    if (userInput.length !== sequence.length) return;

    const expected = mode === 'reverse' ? [...sequence].reverse() : sequence;
    const isCorrect = userInput.every((val, i) => val === expected[i]);

    if (isCorrect) {
      setPhase('correct');
      const gained = spanLength * 150;
      setScore(prev => prev + gained);
      setPeakSpan(prev => Math.max(prev, spanLength));

      timerRef.current = window.setTimeout(() => {
        const nextSpan = spanLength + 1;
        setSpanLength(nextSpan);
        startRound(nextSpan);
      }, 900);
    } else {
      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        setPhase('summary');
        if (onFinish) onFinish(peakSpan, score);
      } else {
        setPhase('wrong');
        timerRef.current = window.setTimeout(() => {
          startRound(spanLength);
        }, 1200);
      }
    }
  };

  const handleRestart = () => {
    setSpanLength(mode === 'reverse' ? 3 : 4);
    setScore(0);
    setLives(3);
    setPeakSpan(mode === 'reverse' ? 3 : 4);
    startRound(mode === 'reverse' ? 3 : 4);
  };

  // Clinical Normative Calculations
  const isReverse = mode === 'reverse';
  const meanNorm = isReverse ? 4.8 : 7.0;
  const sdNorm = isReverse ? 1.1 : 1.3;
  const zScore = (peakSpan - meanNorm) / sdNorm;
  const percentile = zToPercentile(zScore);
  const wmi = Math.max(65, Math.min(145, Math.round(100 + zScore * 15)));

  let classification = 'Average';
  let badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
  if (wmi >= 130) {
    classification = 'Very Superior (Top 2%)';
    badgeColor = 'bg-purple-100 text-purple-900 border-purple-200';
  } else if (wmi >= 120) {
    classification = 'Superior (Top 9%)';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-200';
  } else if (wmi >= 110) {
    classification = 'High Average (Top 25%)';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
  } else if (wmi >= 90) {
    classification = 'Average (Population Standard)';
    badgeColor = 'bg-slate-100 text-slate-900 border-slate-200';
  } else if (wmi >= 80) {
    classification = 'Low Average';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-200';
  } else {
    classification = 'Below Average';
    badgeColor = 'bg-rose-100 text-rose-900 border-rose-200';
  }

  // Graphical Bell curve bar calculation
  const gaugePercent = Math.min(100, Math.max(10, ((wmi - 65) / (145 - 65)) * 100));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Exercises</span>
        </button>

        <div className="flex items-center gap-5 text-sm font-semibold text-slate-800">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => {
                setMode('forward');
                setSpanLength(4);
                setPeakSpan(4);
                setScore(0);
                setLives(3);
              }}
              className={`rounded-md px-3 py-1 font-semibold transition ${
                mode === 'forward' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Forward Span
            </button>
            <button
              onClick={() => {
                setMode('reverse');
                setSpanLength(3);
                setPeakSpan(3);
                setScore(0);
                setLives(3);
              }}
              className={`rounded-md px-3 py-1 font-semibold transition ${
                mode === 'reverse' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Reverse Span (Harder)
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-normal">Span:</span>
            <span className="font-bold">{spanLength}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-normal">Lives:</span>
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  i < lives ? 'bg-rose-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-normal">Score:</span>
            <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-2xs text-center flex flex-col items-center">
        <div className="max-w-md w-full mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            {mode === 'forward' ? 'Forward Digit Span' : 'Reverse Executive Manipulation'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'forward'
              ? 'Memorize the digits in the exact order they appear, then enter them forward.'
              : 'Memorize the sequence, then enter the digits in REVERSE order (backwards).'}
          </p>
        </div>

        {/* Phase: Showing Digits */}
        {phase === 'showing' && (
          <div className="my-10 flex flex-col items-center justify-center min-h-[160px]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Memorize Sequence ({sequence.length} Digits)
            </span>
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-slate-900 bg-slate-900 text-5xl font-extrabold font-mono text-white shadow-md animate-scale-up">
              {currentDigit !== null ? currentDigit : '...'}
            </div>
          </div>
        )}

        {/* Phase: User Input */}
        {(phase === 'input' || phase === 'correct' || phase === 'wrong') && (
          <div className="my-6 flex flex-col items-center w-full max-w-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {mode === 'reverse' ? 'Enter in REVERSE order' : 'Enter in FORWARD order'}
            </span>

            {/* User Input Slots */}
            <div className="flex items-center justify-center gap-2 mb-6 min-h-[48px]">
              {sequence.map((_, idx) => {
                const val = userInput[idx];
                const isCurrent = userInput.length === idx;
                return (
                  <div
                    key={idx}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 font-mono text-lg font-bold transition-all ${
                      val !== undefined
                        ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                        : isCurrent
                        ? 'border-blue-600 bg-blue-50/50 text-blue-600 animate-pulse'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {val !== undefined ? val : ''}
                  </div>
                );
              })}
            </div>

            {/* Status Message */}
            <div className="h-6 mb-4">
              {phase === 'correct' && (
                <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <Check className="h-4 w-4" /> Correct sequence! Expanding span to {spanLength + 1}...
                </span>
              )}
              {phase === 'wrong' && (
                <span className="text-xs font-bold text-rose-600">
                  Incorrect sequence. {lives > 0 ? `${lives} lives remaining.` : 'Workout complete.'}
                </span>
              )}
            </div>

            {/* Virtual Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleDigitPress(num)}
                  className="rounded-xl border border-slate-200 bg-white py-3.5 text-lg font-bold text-slate-800 hover:bg-slate-50 active:scale-95 transition shadow-2xs"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleDelete}
                className="rounded-xl border border-slate-200 bg-slate-50 py-3.5 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
              >
                <Delete className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDigitPress(0)}
                className="rounded-xl border border-slate-200 bg-white py-3.5 text-lg font-bold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
              >
                0
              </button>
              <button
                onClick={handleVerify}
                disabled={userInput.length !== sequence.length}
                className="rounded-xl bg-slate-900 text-white py-3.5 flex items-center justify-center font-bold text-xs disabled:opacity-40 transition hover:bg-slate-800"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Detailed Psychometric Summary Screen */}
        {phase === 'summary' && (
          <div className="mt-4 p-8 rounded-3xl border border-slate-200 bg-white max-w-xl w-full text-left shadow-2xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Workout Diagnostic Report
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
                  Working Memory Analysis
                </h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badgeColor}`}>
                {classification}
              </span>
            </div>

            {/* 3 Core Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Working Memory Index
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  WMI {wmi}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Wechsler Normed (SD 15)
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Normative Percentile
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  {percentile}%
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Top {(100 - percentile).toFixed(1)}% of Adults
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Peak Digit Span
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  {peakSpan} Digits
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Adult Mean: {meanNorm} Digits
                </span>
              </div>
            </div>

            {/* Population Distribution Gauge */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Population Distribution</span>
                <span className="font-bold text-slate-900">Your Placement: WMI {wmi}</span>
              </div>

              {/* Progress bar */}
              <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${gaugePercent}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Low (&lt; 85)</span>
                <span>Adult Mean ({isReverse ? '4.8 Rev' : '7.0 Fwd'})</span>
                <span>Superior (120+)</span>
                <span>Mensa (130+)</span>
              </div>
            </div>

            {/* Diagnostic Clinical Interpretation */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-xs text-slate-700 leading-relaxed space-y-2 mb-6">
              <p>
                <strong>Clinical Assessment:</strong> Your {isReverse ? 'reverse' : 'forward'} span of{' '}
                <strong>{peakSpan} digits</strong> places your working memory capacity at the{' '}
                <strong>{percentile}th percentile</strong> of adult normative cohorts.
              </p>
              <p>
                {isReverse ? (
                  <>
                    Unlike forward recall (which utilizes passive acoustic storage in the phonological loop),
                    <strong> reverse span requires active executive manipulation</strong> in the central executive buffer (Gwm).
                    You must hold the representations in temporary storage while sequentially inverting order. An adult reverse span of {peakSpan}{' '}
                    exceeds standard adult thresholds (population mean = 4.8 digits) and indicates {classification.toLowerCase()} executive manipulation control.
                  </>
                ) : (
                  <>
                    Within standardized psychometric norming (adult baseline mean = 7.0 digits),
                    your forward span of {peakSpan} indicates {classification.toLowerCase()} storage capacity within the phonological loop.
                    To target active cognitive manipulation and resist cognitive decay, switch to <strong>Reverse Span</strong> mode.
                  </>
                )}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retry Exercise</span>
              </button>

              <button
                onClick={() => {
                  setMode(isReverse ? 'forward' : 'reverse');
                  handleRestart();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              >
                <span>Switch to {isReverse ? 'Forward Span' : 'Reverse Mode'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
          <Brain className="h-4 w-4" />
          <span>Strengthening phonological loop capacity, attention span, and working memory recall.</span>
        </div>
      </div>
    </div>
  );
};
