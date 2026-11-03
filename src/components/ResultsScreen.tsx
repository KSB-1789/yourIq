import React, { useState } from 'react';
import type { TestResult, Question } from '../types';
import { BellCurveChart } from './BellCurveChart';
import { CertificateModal } from './CertificateModal';
import { ExplanationsReview } from './ExplanationsReview';
import {
  Download,
  Share2,
  RotateCcw,
  Check,
  ChevronDown,
  Layers,
  Compass,
  Hash,
  Zap,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Home,
} from 'lucide-react';

interface ResultsScreenProps {
  result: TestResult;
  questions: Question[];
  onRetake: () => void;
  onGoHome?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  questions,
  onRetake,
  onGoHome,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showExplanations, setShowExplanations] = useState(true);

  const handleShare = () => {
    const text = `Cognitive Assessment Results:\nStandard IQ: ${result.iqScore} (${result.classification})\nPercentile: ${result.percentile}th percentile\nAccuracy: ${result.correctCount}/${result.totalQuestions}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const domainIcons: Record<string, React.ReactNode> = {
    fluid_reasoning: <Layers className="h-5 w-5 text-slate-800" />,
    spatial_visual: <Compass className="h-5 w-5 text-slate-800" />,
    numerical_relational: <Hash className="h-5 w-5 text-slate-800" />,
    processing_pattern: <Zap className="h-5 w-5 text-slate-800" />,
    memory_recall: <Brain className="h-5 w-5 text-slate-800" />,
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 animate-fade-in">
      {/* Top Header & Export Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Assessment Complete
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Cognitive Evaluation Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
              title="Return to Home"
            >
              <Home className="h-4 w-4 text-slate-500" />
              <span>Home</span>
            </button>
          )}

          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            <span>Official Certificate</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            {copiedShare ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={onRetake}
            title="Retake assessment"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-2xs transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Retake</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-2xs">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          {/* Left Column: Primary IQ Score */}
          <div className="flex flex-col items-center justify-center text-center md:col-span-5 md:border-r md:border-slate-100 md:pr-10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Standardized IQ
            </span>

            <div className="my-3 flex items-baseline justify-center">
              <span className="text-8xl sm:text-9xl font-extrabold tracking-tight text-slate-900 font-['Satoshi',sans-serif]">
                {result.iqScore}
              </span>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-800">
              {result.classification}
            </div>

            <div className="mt-4 text-xs text-slate-500 font-medium">
              95% Confidence Interval: [{result.confidenceInterval[0]} — {result.confidenceInterval[1]}]
            </div>
          </div>

          {/* Right Column: Performance Breakdown */}
          <div className="flex flex-col justify-center space-y-5 md:col-span-7">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Percentile
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                  {result.percentile}%
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Normative Rank
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Accuracy
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                  {result.correctCount}/{result.totalQuestions}
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  {result.rawScorePercentage}% Raw
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Duration
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                  {formatTime(result.totalTimeSeconds)}
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Total Time
                </span>
              </div>
            </div>

            {/* Performance Narrative */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-sm text-slate-600 leading-relaxed font-normal">
              <p>
                <strong>Evaluation Summary:</strong> Your performance is within the{' '}
                <span className="text-slate-900 font-bold">{result.classification}</span> category on the Wechsler norming scale (Mean 100, SD 15).
                {result.iqScore >= 130
                  ? ' This score satisfies the typical qualification standard for high-IQ societies including Mensa (top 2.2% of the population).'
                  : result.iqScore >= 115
                  ? ' This score reflects superior analytical problem-solving and strong inductive reasoning abilities exceeding 84% of the population.'
                  : ' This score demonstrates balanced, solid cognitive problem-solving within the standard adult norm.'}
              </p>
            </div>

            {/* Delayed Memory Status Tile */}
            {result.memoryCheckpoints && result.memoryCheckpoints.length > 0 ? (
              <div className={`rounded-2xl border p-5 text-xs ${
                result.memoryRecallPassed
                  ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                  : 'border-amber-200 bg-amber-50/60 text-amber-900'
              }`}>
                <div className="flex items-center justify-between pb-3.5 border-b border-black/5 mb-3.5">
                  <div className="flex items-center gap-3">
                    {result.memoryRecallPassed ? (
                      <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-bold block text-sm">
                        3-Step Delayed Memory Recall: {result.memoryRetentionRate ?? 100}% Retention
                      </span>
                      <span className="text-xs opacity-90 mt-0.5 block">
                        {result.memoryRecallPassed
                          ? 'Successfully resisted retroactive cognitive interference across all 3 evaluation checkpoints.'
                          : 'Interim problem solving induced partial cognitive interference on memory traces.'}
                      </span>
                    </div>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 font-bold text-[11px] uppercase tracking-wider ${
                    result.memoryRecallPassed ? 'bg-emerald-200/80 text-emerald-950' : 'bg-amber-200/80 text-amber-950'
                  }`}>
                    {result.memoryCheckpoints.filter(c => c.isCorrect).length}/3 Verified
                  </span>
                </div>

                {/* 3 Checkpoint Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {result.memoryCheckpoints.map(cp => (
                    <div
                      key={cp.id}
                      className="flex items-center justify-between rounded-xl bg-white/80 border border-slate-200/60 p-3 text-slate-800 shadow-2xs"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Phase {cp.id} {cp.type === 'word' ? 'Word' : cp.type === 'code' ? 'Code' : 'Compound'}
                        </span>
                        <span className="font-mono font-bold text-xs">{cp.target}</span>
                      </div>
                      {cp.isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          <Check className="h-3 w-3" /> Retained
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                          Decayed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`flex items-center justify-between rounded-2xl border p-4 text-xs ${
                result.memoryRecallPassed
                  ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                  : 'border-amber-200 bg-amber-50/60 text-amber-900'
              }`}>
                <div className="flex items-center gap-3">
                  {result.memoryRecallPassed ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-bold block text-sm">
                      {result.memoryRecallPassed ? 'Delayed Memory Recall: 100% Retention' : 'Delayed Memory Recall: Incomplete'}
                    </span>
                    <span className="text-xs opacity-90 mt-0.5 block">
                      {result.memoryRecallPassed
                        ? 'Successfully resisted retroactive cognitive interference during the multi-phase evaluation.'
                        : 'Cognitive load caused memory trace decay during interim problem solving.'}
                    </span>
                  </div>
                </div>
                <span className={`rounded-lg px-2.5 py-1 font-bold text-[11px] uppercase tracking-wider ${
                  result.memoryRecallPassed ? 'bg-emerald-200/80 text-emerald-950' : 'bg-amber-200/80 text-amber-950'
                }`}>
                  {result.memoryRecallPassed ? 'Verified' : 'Retrain'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bell Curve Visualizer */}
      <div className="mt-8">
        <BellCurveChart userIq={result.iqScore} userPercentile={result.percentile} />
      </div>

      {/* Domain Breakdown - 4 Columns Across on Desktop */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-2xs">
        <div className="border-b border-slate-100 pb-5 mb-8">
          <h2 className="text-xl font-bold text-slate-900 font-['Satoshi',sans-serif]">
            Cognitive Domain Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standardized sub-scale estimates across the four tested dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {result.domainScores.map(domain => {
            const pctWidth = Math.min(100, Math.max(10, ((domain.score - 65) / (145 - 65)) * 100));
            return (
              <div
                key={domain.domain}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {domainIcons[domain.domain]}
                      <span className="text-sm font-bold text-slate-900">{domain.name}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-slate-900">
                        IQ {domain.score}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-4 leading-relaxed font-normal">
                    {domain.shortDesc}
                  </p>
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all duration-500"
                      style={{ width: `${pctWidth}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{domain.correct} of {domain.total} correct</span>
                    <span className="font-semibold text-slate-700">{domain.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solutions & Explanations Accordion */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-slate-900 transition"
          >
            <span>{showExplanations ? 'Hide Answer Review' : 'View Question Solutions & Logic'}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showExplanations ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {showExplanations && (
          <ExplanationsReview questions={questions} responses={result.userResponses} />
        )}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        result={result}
      />
    </div>
  );
};
