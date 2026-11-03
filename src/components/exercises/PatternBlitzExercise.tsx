import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Clock, Brain, CheckCircle2, XCircle } from 'lucide-react';
import { MatrixCellSvg } from '../MatrixSvg';
import { QUESTIONS } from '../../data/questions';
import type { Question } from '../../types';
import { zToPercentile } from '../../utils/scoring';

interface PatternBlitzProps {
  onBack: () => void;
  onFinish?: (score: number, accuracy: number) => void;
}

function getRandomPool(): Question[] {
  return QUESTIONS.filter(q => q.cells && q.cells.length > 0)
    .sort(() => Math.random() - 0.5)
    .slice(0, 15);
}

export const PatternBlitzExercise: React.FC<PatternBlitzProps> = ({ onBack, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(true);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>(() => getRandomPool());
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // 45s Timer
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const currentQ = shuffledQuestions[currentIndex];

  const handleSelectOption = (optId: number) => {
    if (!isActive || !currentQ) return;

    setTotalAnswered(prev => prev + 1);
    const isCorrect = optId === currentQ.correctAnswer;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setScore(prev => prev + 120);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsActive(false);
      }
    }, 300);
  };

  const handleRestart = () => {
    setShuffledQuestions(getRandomPool());
    setCurrentIndex(0);
    setTimeLeft(45);
    setIsActive(true);
    setScore(0);
    setCorrectCount(0);
    setTotalAnswered(0);
  };

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const meanNorm = 7.0;
  const sdNorm = 2.0;
  const zScore = (correctCount - meanNorm) / sdNorm;
  const fluidIndex = Math.max(70, Math.min(150, Math.round(100 + zScore * 15)));
  const percentile = zToPercentile(zScore);
  const latency = totalAnswered > 0 ? (45 / totalAnswered).toFixed(1) : '0.0';

  let classification = 'Average Processing Speed';
  let badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';

  if (fluidIndex >= 130) {
    classification = 'Very Superior (Inductive Velocity)';
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (fluidIndex >= 120) {
    classification = 'Superior Pattern Deduction';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (fluidIndex >= 110) {
    classification = 'High Average Matrix Speed';
    badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
  } else if (fluidIndex >= 90) {
    classification = 'Average Processing Speed';
    badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';
  } else {
    classification = 'Developing Inductive Speed';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  const gaugePercent = Math.min(100, Math.max(0, ((fluidIndex - 70) / (145 - 70)) * 100));

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

        <div className="flex items-center gap-6 text-sm font-semibold text-slate-800">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 font-mono">
            <Clock className="h-4 w-4 text-slate-500" />
            <span>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-normal">Score:</span>
            <span className="text-base font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-normal">Progress:</span>
            <span className="font-bold">{currentIndex + 1}/{shuffledQuestions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-2xs text-center flex flex-col items-center">
        <div className="max-w-md w-full mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Pattern Matrix Blitz
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Solve progressive matrix puzzles as rapidly as possible under time pressure.
          </p>
        </div>

        {isActive && currentQ ? (
          <div className="w-full max-w-lg flex flex-col items-center">
            {/* Matrix View */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner my-4">
              {currentQ.matrixType === '3x3' && currentQ.cells && (
                <div className="grid grid-cols-3 gap-2.5">
                  {currentQ.cells.map((cell, idx) => (
                    <MatrixCellSvg key={idx} cell={cell} size={76} />
                  ))}
                </div>
              )}
              {currentQ.matrixType === '2x2' && currentQ.cells && (
                <div className="grid grid-cols-2 gap-3">
                  {currentQ.cells.map((cell, idx) => (
                    <MatrixCellSvg key={idx} cell={cell} size={90} />
                  ))}
                </div>
              )}
            </div>

            {/* Feedback */}
            <div className="h-6 my-2">
              {feedback === 'correct' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Correct (+120)
                </span>
              )}
              {feedback === 'wrong' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                  <XCircle className="h-4 w-4" /> Incorrect
                </span>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3.5 w-full mt-2">
              {currentQ.options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className="group relative flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3 hover:border-slate-300 hover:bg-white active:scale-95 transition shadow-2xs"
                  >
                    <span className="absolute left-3 top-2.5 flex h-5 w-5 items-center justify-center rounded-md bg-slate-200 text-[10px] font-bold text-slate-600 group-hover:bg-slate-300">
                      {letter}
                    </span>
                    {opt.elements ? (
                      <MatrixCellSvg
                        cell={{ elements: opt.elements }}
                        size={60}
                        className="border-none bg-transparent shadow-none"
                      />
                    ) : (
                      <span className="font-mono font-bold text-sm text-slate-800">{opt.text}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Detailed Psychometric Summary Screen */
          <div className="mt-4 p-8 rounded-3xl border border-slate-200 bg-white max-w-xl w-full text-left shadow-2xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Blitz Diagnostic Report
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
                  Fluid Induction & Speed Analysis
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
                  Fluid Speed Index
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  FSI {fluidIndex}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Wechsler Scale (SD 15)
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
                  Deduction Latency
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  {latency}s
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Throughput / Matrix
                </span>
              </div>
            </div>

            {/* Population Distribution Gauge */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Fluid Speed Population Benchmark</span>
                <span className="font-bold text-slate-900">Your Placement: FSI {fluidIndex}</span>
              </div>

              <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${gaugePercent}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Low (&lt; 4)</span>
                <span>Adult Average (7.0)</span>
                <span>Superior (10+)</span>
                <span>Ceiling (12+)</span>
              </div>
            </div>

            {/* Diagnostic Clinical Interpretation */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-xs text-slate-700 leading-relaxed space-y-2 mb-6">
              <p>
                <strong>Clinical Assessment:</strong> You solved <strong>{correctCount} matrix items</strong> with an accuracy rate of{' '}
                <strong>{accuracy}%</strong> at an average throughput of <strong>{latency} seconds per matrix</strong>, placing your inductive processing velocity ($G_s / G_f$) at the{' '}
                <strong>{percentile}th percentile</strong> of adult cohorts.
              </p>
              <p>
                Speeded matrix reasoning tests the interaction between cognitive processing speed ($G_s$) and fluid reasoning ($G_f$). 
                Under time pressure, high scorers rapidly parse multi-layered geometric rules (e.g., Boolean superposition, shape rotation, and arithmetic balance) without exhaustive trial-and-error. 
                {correctCount >= 10
                  ? ' Your rapid latency and strong accuracy demonstrate exceptional pattern synthesis and instant inductive inference under temporal stress.'
                  : correctCount >= 7
                  ? ' Your performance demonstrates robust adult baseline processing speed with steady rule isolation.'
                  : ' Time pressure constrained inductive throughput. Frequent training reduces perceptual latency and speeds up relational pattern extraction.'}
              </p>
            </div>

            <button
              onClick={() => {
                if (onFinish) onFinish(score, accuracy);
                handleRestart();
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Blitz</span>
            </button>
          </div>
        )}

        {isActive && (
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
            <Brain className="h-4 w-4" />
            <span>Targeting rapid visual induction, processing speed (Gs), and rule extraction under pressure.</span>
          </div>
        )}
      </div>
    </div>
  );
};
