import React, { useState } from 'react';
import type { TestResult } from '../types';
import {
  ArrowRight,
  Clock,
  Layers,
  Compass,
  Hash,
  Zap,
  HelpCircle,
  Eye,
  Award,
  BarChart3,
  Brain,
  ShieldCheck,
  Play,
} from 'lucide-react';
import { MatrixCellSvg } from './MatrixSvg';

interface WelcomeScreenProps {
  onStart: () => void;
  questionCount: number;
  latestResult?: TestResult | null;
  onOpenHistory?: () => void;
  activeSessionInfo?: {
    currentIndex: number;
    totalQuestions: number;
    secondsElapsed: number;
    answeredCount: number;
  } | null;
  onResume?: () => void;
  onDiscardActive?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  questionCount,
  latestResult,
  onOpenHistory,
  activeSessionInfo,
  onResume,
  onDiscardActive,
}) => {
  const [activeSampleTab, setActiveSampleTab] = useState<'matrix' | 'series'>('matrix');
  const [showDemoSolution, setShowDemoSolution] = useState(false);

  // Sample visual matrix for the landing preview
  const demoCells = [
    { elements: [{ type: 'circle' as const, stroke: '#2563eb', strokeWidth: 2.5 }] },
    { elements: [{ type: 'triangle' as const, stroke: '#2563eb', strokeWidth: 2.5 }] },
    { elements: [{ type: 'square' as const, stroke: '#2563eb', strokeWidth: 2.5 }] },
    { elements: [{ type: 'triangle' as const, stroke: '#2563eb', strokeWidth: 2.5 }] },
    { elements: [{ type: 'square' as const, stroke: '#2563eb', strokeWidth: 2.5 }] },
    { elements: [{ type: 'circle' as const, stroke: '#2563eb', strokeWidth: 2.5 }] },
    { elements: [{ type: 'square' as const, stroke: '#2563eb', strokeWidth: 2.5 }] },
    { elements: [{ type: 'circle' as const, stroke: '#2563eb', strokeWidth: 2.5 }] },
    {
      elements: showDemoSolution
        ? [{ type: 'triangle' as const, stroke: '#2563eb', strokeWidth: 2.5 }]
        : [],
      isTarget: !showDemoSolution,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 sm:py-20 animate-fade-in">
      {/* Expansive 2-Column Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Authoritative Core Value Proposition */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {latestResult && onOpenHistory && (
            <div className="mb-4">
              <button
                onClick={onOpenHistory}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition shadow-2xs"
              >
                <Award className="h-3.5 w-3.5 text-blue-600" />
                <span>Previous Assessment: <strong>IQ {latestResult.iqScore}</strong> ({latestResult.percentile}th percentile) • View History</span>
              </button>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-['Satoshi',sans-serif] leading-[1.08]">
            The Standardized IQ Test
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
            Determine your verified Wechsler IQ score, population percentile, and cognitive profile across 3 scientifically structured phases. 100% free with instant, unredacted certified results.
          </p>

          {/* Core Deliverable Badges */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
              <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
              <span>Wechsler Normed (SD 15)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
              <Brain className="h-3.5 w-3.5 text-amber-600" />
              <span>Delayed Memory Working Index</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              <span>Printable Performance Certificate</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
              <span>Zero Paywalls or Tracking</span>
            </span>
          </div>

          {/* Active In-Progress Assessment Banner */}
          {activeSessionInfo && onResume && (
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/80 p-5 sm:p-6 shadow-2xs animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <Clock className="h-4 w-4" />
                  <span>Assessment In Progress • Auto-Saved</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-800 bg-blue-100/90 px-2.5 py-0.5 rounded-full">
                  Item {activeSessionInfo.currentIndex + 1} of {activeSessionInfo.totalQuestions}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                You have an uncompleted assessment in progress ({activeSessionInfo.answeredCount} answered, {Math.floor(activeSessionInfo.secondsElapsed / 60)}m {activeSessionInfo.secondsElapsed % 60}s elapsed). You can resume right where you left off.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={onResume}
                  className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Resume Assessment</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
                {onDiscardActive && (
                  <button
                    onClick={onDiscardActive}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-rose-600 transition"
                  >
                    Discard & Start Fresh
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Primary CTA & Specs */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-sm transition hover:bg-slate-800 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <span>{activeSessionInfo ? 'Start New Assessment' : 'Begin 3-Phase Assessment'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> ~15-20 Minutes
              </span>
              <span>•</span>
              <span>{questionCount} Progressive Items</span>
              <span>•</span>
              <span>3 Distinct Phases</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Blueprint & Sample Item Showcase */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
          {/* Blueprint Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Test Blueprint
            </h3>
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                onClick={() => {
                  setActiveSampleTab('matrix');
                  setShowDemoSolution(false);
                }}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  activeSampleTab === 'matrix'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Matrix Item
              </button>
              <button
                onClick={() => {
                  setActiveSampleTab('series');
                  setShowDemoSolution(false);
                }}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  activeSampleTab === 'series'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sequence Item
              </button>
            </div>
          </div>

          {/* Sample Tab 1: Visual Matrix */}
          {activeSampleTab === 'matrix' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
                {demoCells.map((cell, idx) => (
                  <MatrixCellSvg key={idx} cell={cell} size={76} />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between w-full">
                <span className="text-xs text-slate-500 font-medium">
                  Rule: Latin Square shape cycle
                </span>
                <button
                  onClick={() => setShowDemoSolution(!showDemoSolution)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white transition shadow-2xs"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span>{showDemoSolution ? 'Hide Solution' : 'Reveal Solution'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Sample Tab 2: Number Sequence */}
          {activeSampleTab === 'series' && (
            <div className="flex flex-col items-center py-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[3, 6, 12, 24, 48].map((num, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white font-mono text-sm font-bold text-slate-800 shadow-2xs">
                      {num}
                    </div>
                    <ArrowRight className="h-3 w-3 text-slate-300" />
                  </React.Fragment>
                ))}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 font-mono text-sm font-bold shadow-2xs transition ${
                    showDemoSolution
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-extrabold'
                      : 'border-dashed border-blue-400 bg-slate-50 text-blue-600'
                  }`}
                >
                  {showDemoSolution ? '96' : '?'}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between w-full">
                <span className="text-xs text-slate-500 font-medium">
                  Rule: Multiplicative doubling (× 2)
                </span>
                <button
                  onClick={() => setShowDemoSolution(!showDemoSolution)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white transition shadow-2xs"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span>{showDemoSolution ? 'Hide Solution' : 'Reveal Solution (96)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3-Phase Summary Strip inside blueprint */}
          <div className="mt-6 border-t border-slate-100 pt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="rounded-xl bg-slate-50 p-2">
              <span className="font-bold text-slate-900 block">Phase 1</span>
              <span className="text-slate-500">Visual Logic</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2">
              <span className="font-bold text-slate-900 block">Phase 2</span>
              <span className="text-slate-500">Delayed Memory</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2">
              <span className="font-bold text-slate-900 block">Phase 3</span>
              <span className="text-slate-500">Quantitative</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 3-Phase Assessment Journey (Expansive 3-Column Grid Across Desktop) */}
      <div className="mt-20 sm:mt-28">
        <div className="mb-10 text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            The 3-Phase Evaluation Journey
          </h2>
          <p className="mt-2 text-base text-slate-600 font-normal max-w-3xl">
            Designed to eliminate the monotony of single-type matrix tests, this battery evaluates fluid intelligence through a dynamic multi-phase progression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1 Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs transition hover:border-slate-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-700">
                  Phase 01
                </span>
                <span className="text-xs font-semibold text-slate-400">Questions 1–8</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 mb-5">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Visual & Spatial Logic
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                Begins by committing an assigned verbal word anchor to memory. You will then solve 8 progressive Latin squares, rotational symmetries, and 3D folding nets, tested by Memory Checkpoint 1 at Question 8.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500 font-medium">
              Evaluates: Non-verbal fluid reasoning (Gf) & spatial visualization (Gv).
            </div>
          </div>

          {/* Phase 2 Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs transition hover:border-slate-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 font-mono text-xs font-bold text-amber-700">
                  Phase 02
                </span>
                <span className="text-xs font-semibold text-slate-400">Questions 9–16</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 mb-5">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Quantitative & Relational
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                Commit an alphanumeric sequence to memory before solving 8 complex numerical series and graduate analogies under continuous interference, tested by Memory Checkpoint 2 at Question 16.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500 font-medium">
              Evaluates: Working memory capacity (Gwm) & inductive analogy deduction.
            </div>
          </div>

          {/* Phase 3 Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs transition hover:border-slate-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="rounded-lg bg-purple-50 px-2.5 py-1 font-mono text-xs font-bold text-purple-700">
                  Phase 03
                </span>
                <span className="text-xs font-semibold text-slate-400">Questions 17–20</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-800 mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Mensa High-Range Synthesis
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                Memorize a final compound key, then solve 4 high-ceiling Boolean XOR and modular lattice items (IQ &gt; 125). Concludes with Memory Checkpoint 3 to verify total cognitive trace fidelity.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500 font-medium">
              Evaluates: Mensa high-range abstract synthesis & speed under interference.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Cognitive Dimensions - 4 Columns Across on Desktop */}
      <div className="mt-20 sm:mt-28">
        <div className="mb-10 text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Evaluated Cognitive Dimensions
          </h2>
          <p className="mt-2 text-base text-slate-600 font-normal max-w-3xl">
            Calibrated on the Cattell-Horn-Carroll (CHC) psychometric framework of human cognitive abilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs transition hover:border-slate-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800 mb-5">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Fluid Reasoning</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              Inductive rule discovery, Latin square permutations, and abstract matrix problem-solving independent of formal schooling.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs transition hover:border-slate-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800 mb-5">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Spatial & Visual Logic</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              Mental manipulation of 2D/3D shapes, orthogonal surface folding, and topological rotational symmetry.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs transition hover:border-slate-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800 mb-5">
              <Hash className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Quantitative Induction</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              Arithmetic sequence extrapolation, relational numeric grids, and modular mathematical pattern induction.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs transition hover:border-slate-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800 mb-5">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Working Memory</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              Active memory encoding, delayed retrieval under cognitive interference, and resistance to proactive forgetting.
            </p>
          </div>
        </div>
      </div>

      {/* Deliverables Showcase Strip */}
      <div className="mt-20 sm:mt-28 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-2xs">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Verified Deliverables Included
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
            Every candidate receives a full unredacted diagnostic report immediately upon submission.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Deliverable 01
            </span>
            <span className="text-xl font-extrabold text-slate-900 block mt-2">
              Standardized IQ
            </span>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Wechsler scale norming (Mean 100, SD 15) with SEM ±6 point confidence intervals.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Deliverable 02
            </span>
            <span className="text-xl font-extrabold text-slate-900 block mt-2">
              Gaussian Bell Curve
            </span>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Interactive normal distribution placement and population percentile rank.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Deliverable 03
            </span>
            <span className="text-xl font-extrabold text-slate-900 block mt-2">
              Memory Retention
            </span>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Delayed recall rating under cognitive interference with dedicated training recommendations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Deliverable 04
            </span>
            <span className="text-xl font-extrabold text-slate-900 block mt-2">
              PDF Certificate
            </span>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Printable Certificate of Performance with verifiable evaluation hash and candidate name.
            </p>
          </div>
        </div>
      </div>

      {/* Readiness & Instructions Card */}
      <div className="mt-16 sm:mt-20 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="h-5 w-5 text-slate-500" />
          <h3 className="text-base font-bold text-slate-900">
            Assessment Instructions & Guidelines
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 pt-2">
          <div>
            <span className="font-bold text-slate-800 block mb-1">
              1. Uninterrupted Environment
            </span>
            Set aside ~15 to 20 minutes in a quiet location. The test is timed, and speed is factored into processing adjustments.
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-1">
              2. Working Memory Commitment
            </span>
            Do not write down your assigned access code in Phase 1. The test specifically measures internal working memory fidelity under cognitive load.
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-1">
              3. Full Solutions Included
            </span>
            Upon submission, you will receive full visual and logical explanations for all 20 problems to review your deductive reasoning.
          </div>
        </div>
      </div>
    </div>
  );
};
