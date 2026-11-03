import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Brain } from 'lucide-react';
import { zToPercentile } from '../../utils/scoring';
import { saveGymScore } from '../../utils/gymStorage';

interface SpatialMemoryProps {
  onBack: () => void;
  onFinish?: (span: number, score: number) => void;
}

export const SpatialMemoryExercise: React.FC<SpatialMemoryProps> = ({ onBack, onFinish }) => {
  const [level, setLevel] = useState(3);
  const [phase, setPhase] = useState<'preview' | 'recall' | 'success' | 'fail' | 'gameover'>('preview');
  const [sequence, setSequence] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [userClicks, setUserClicks] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [maxSpan, setMaxSpan] = useState(3);

  const timerRef = useRef<number | null>(null);

  const startNewRound = useCallback((currentLevel: number) => {
    setUserClicks([]);
    setPhase('preview');

    const newSeq: number[] = [];
    while (newSeq.length < currentLevel) {
      const tile = Math.floor(Math.random() * 16);
      if (newSeq[newSeq.length - 1] !== tile) {
        newSeq.push(tile);
      }
    }
    setSequence(newSeq);

    let step = 0;
    const playNext = () => {
      if (step < newSeq.length) {
        setActiveTile(newSeq[step]);
        step++;
        timerRef.current = window.setTimeout(() => {
          setActiveTile(null);
          timerRef.current = window.setTimeout(playNext, 250);
        }, 650);
      } else {
        setActiveTile(null);
        setPhase('recall');
      }
    };

    timerRef.current = window.setTimeout(playNext, 600);
  }, []);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      startNewRound(3);
    }, 50);
    return () => {
      clearTimeout(mountTimer);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [startNewRound]);

  const handleTileClick = (index: number) => {
    if (phase !== 'recall') return;

    const nextIndex = userClicks.length;
    const expected = sequence[nextIndex];

    if (index === expected) {
      const updatedClicks = [...userClicks, index];
      setUserClicks(updatedClicks);

      if (updatedClicks.length === sequence.length) {
        setPhase('success');
        const points = level * 100;
        setScore(prev => prev + points);
        setMaxSpan(prev => Math.max(prev, level));

        timerRef.current = window.setTimeout(() => {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          startNewRound(nextLevel);
        }, 900);
      }
    } else {
      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        setPhase('gameover');
        saveGymScore('spatial_memory', 'Max Block Span', `${maxSpan} Units`, maxSpan);
        if (onFinish) onFinish(maxSpan, score);
      } else {
        setPhase('fail');
        timerRef.current = window.setTimeout(() => {
          startNewRound(level);
        }, 1200);
      }
    }
  };

  const handleRestart = () => {
    setLevel(3);
    setScore(0);
    setLives(3);
    setMaxSpan(3);
    startNewRound(3);
  };

  // Corsi Block Clinical Normative Calculations
  // Adult Corsi benchmark: Mean = 5.4 units, SD = 1.0 unit
  const meanNorm = 5.4;
  const sdNorm = 1.0;
  const zScore = (maxSpan - meanNorm) / sdNorm;
  const percentile = zToPercentile(zScore);
  const spatialIndex = Math.max(65, Math.min(145, Math.round(100 + zScore * 15)));

  let classification = 'Average';
  let badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
  if (spatialIndex >= 130) {
    classification = 'Very Superior (Top 2%)';
    badgeColor = 'bg-purple-100 text-purple-900 border-purple-200';
  } else if (spatialIndex >= 120) {
    classification = 'Superior (Top 9%)';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-200';
  } else if (spatialIndex >= 110) {
    classification = 'High Average (Top 25%)';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
  } else if (spatialIndex >= 90) {
    classification = 'Average (Population Standard)';
    badgeColor = 'bg-slate-100 text-slate-900 border-slate-200';
  } else if (spatialIndex >= 80) {
    classification = 'Low Average';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-200';
  } else {
    classification = 'Below Average';
    badgeColor = 'bg-rose-100 text-rose-900 border-rose-200';
  }

  const gaugePercent = Math.min(100, Math.max(10, ((spatialIndex - 65) / (145 - 65)) * 100));

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
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-normal">Span:</span>
            <span className="font-bold">{level}</span>
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
            Spatial Grid Recall (Corsi Test)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {phase === 'preview' && 'Observe the illuminated sequence on the grid.'}
            {phase === 'recall' && `Repeat the pattern (${userClicks.length}/${sequence.length} clicked).`}
            {phase === 'success' && 'Sequence correct! Increasing memory span.'}
            {phase === 'fail' && 'Incorrect tile. Retrying sequence.'}
            {phase === 'gameover' && 'Exercise completed.'}
          </p>
        </div>

        {/* 4x4 Interactive Grid */}
        <div className="grid grid-cols-4 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm w-full aspect-square">
          {[...Array(16)].map((_, idx) => {
            const isFlashed = activeTile === idx;
            const isClicked = userClicks.includes(idx);

            let tileStyle = 'bg-white border-slate-200 text-slate-400';
            if (isFlashed) {
              tileStyle = 'bg-blue-600 border-blue-600 text-white shadow-md scale-95';
            } else if (isClicked) {
              tileStyle = 'bg-slate-900 border-slate-900 text-white scale-95';
            }

            return (
              <button
                key={idx}
                disabled={phase !== 'recall'}
                onClick={() => handleTileClick(idx)}
                className={`rounded-xl border transition-all duration-200 flex items-center justify-center font-bold text-sm focus:outline-none ${tileStyle} ${
                  phase === 'recall' ? 'hover:border-slate-400 hover:bg-slate-100 cursor-pointer' : 'cursor-default'
                }`}
              />
            );
          })}
        </div>

        {/* Status / Game Over View */}
        {phase === 'gameover' && (
          <div className="mt-8 p-8 rounded-3xl border border-slate-200 bg-white max-w-xl w-full text-left shadow-2xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Workout Diagnostic Report
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
                  Visuospatial Memory Analysis
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
                  Visuospatial Index
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  VMI {spatialIndex}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Corsi Scale (SD 15)
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
                  Peak Block Span
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  {maxSpan} Units
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Adult Mean: {meanNorm} Units
                </span>
              </div>
            </div>

            {/* Population Distribution Gauge */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Corsi Population Distribution</span>
                <span className="font-bold text-slate-900">Your Placement: VMI {spatialIndex}</span>
              </div>

              <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${gaugePercent}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Low (&lt; 4)</span>
                <span>Adult Average (5.4)</span>
                <span>Superior (7+)</span>
                <span>Ceiling (8+)</span>
              </div>
            </div>

            {/* Diagnostic Clinical Interpretation */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-xs text-slate-700 leading-relaxed space-y-2 mb-6">
              <p>
                <strong>Clinical Assessment:</strong> Your visual-spatial block span of{' '}
                <strong>{maxSpan} units</strong> places your visuospatial working memory capacity (Gv / Corsi span) at the{' '}
                <strong>{percentile}th percentile</strong> of adult cohorts.
              </p>
              <p>
                While auditory digit span relies on vocal-articulatory loop rehearsal, the Corsi Block-Tapping Test targets
                the dorsal visual pathway and right frontoparietal spatial networks. An adult span of {maxSpan} units{' '}
                {maxSpan >= 7
                  ? 'reflects superior spatial coordinate encoding, characteristic of advanced STEM and surgical mental rotation proficiency.'
                  : maxSpan >= 5
                  ? 'reflects solid, standard adult spatial coordinate retention within typical population parameters.'
                  : 'indicates potential spatial sketchpad susceptibility under sequential load. Regular practice expands active coordinate chunking.'}
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Exercise</span>
            </button>
          </div>
        )}

        {phase !== 'gameover' && (
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
            <Brain className="h-4 w-4" />
            <span>Targeting visual-spatial working memory capacity & sequential retrieval.</span>
          </div>
        )}
      </div>
    </div>
  );
};
