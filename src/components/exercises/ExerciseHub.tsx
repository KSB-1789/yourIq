import React, { useState } from 'react';
import { EXERCISES, type ExerciseType } from '../../types/exercises';
import { Grid3X3, Binary, Rotate3D, Zap, ArrowRight, Brain, Award, ShieldCheck, Trophy } from 'lucide-react';
import { getGymRecords, type GymRecords } from '../../utils/gymStorage';

interface ExerciseHubProps {
  onSelectExercise: (type: ExerciseType) => void;
  onTakeTest: () => void;
}

export const ExerciseHub: React.FC<ExerciseHubProps> = ({ onSelectExercise, onTakeTest }) => {
  const [gymRecords] = useState<GymRecords>(() => getGymRecords());
  const getIcon = (id: ExerciseType) => {
    switch (id) {
      case 'spatial_memory':
        return <Grid3X3 className="h-6 w-6 text-slate-900" />;
      case 'sequence_recall':
        return <Binary className="h-6 w-6 text-slate-900" />;
      case 'mental_rotation':
        return <Rotate3D className="h-6 w-6 text-slate-900" />;
      case 'pattern_blitz':
        return <Zap className="h-6 w-6 text-slate-900" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-16 sm:py-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-['Satoshi',sans-serif]">
            Cognitive Training Gym
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Targeted daily exercises designed to strengthen working memory capacity, 3D mental rotation, visual pattern recognition, and processing speed.
          </p>
        </div>

        <button
          onClick={onTakeTest}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition shrink-0"
        >
          <Award className="h-4 w-4" />
          <span>Take Standardized Test</span>
        </button>
      </div>

      {/* 4 Workout Cards across 4 Columns */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {EXERCISES.map(ex => (
          <div
            key={ex.id}
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-2xs hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 group-hover:bg-slate-200 transition">
                  {getIcon(ex.id)}
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {ex.duration}
                </span>
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {ex.category}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
                {ex.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {ex.tagline}
              </p>

              <p className="text-sm text-slate-600 mt-4 leading-relaxed font-normal">
                {ex.description}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Metric:</span>
                <span className="font-semibold text-slate-800">{ex.metricLabel}</span>
              </div>

              {/* Personal Best Pill from localStorage */}
              <div className="h-6 mb-4 flex items-center">
                {gymRecords[ex.id] ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                    <Trophy className="h-3 w-3 text-amber-600" />
                    <span>Personal Best: <strong>{gymRecords[ex.id]?.bestMetricValue}</strong></span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">No session logged yet</span>
                )}
              </div>

              <button
                onClick={() => onSelectExercise(ex.id)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-2xs group-hover:bg-blue-600 transition"
              >
                <span>Launch Workout</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scientific Background Banner */}
      <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">Working Memory Capacity</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Working memory is the psychological workbench of problem-solving. Corsi grid and digit span tasks train both active holding and executive manipulation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Rotate3D className="h-6 w-6 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">Shepard-Metzler Rotation</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Parietal lobe spatial manipulation directly correlates with non-verbal fluid intelligence ($G_f$) and STEM analytical proficiency.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">Client-Side & Open Access</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                All diagnostic exercises compute locally in your browser with zero data harvesting, certified scoring models, and unlimited retests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
