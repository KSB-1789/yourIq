import React from 'react';
import { X, CheckCircle2, Award } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl text-slate-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-slate-900">
          <Award className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
            Psychometric Methodology & Norming
          </h2>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
          <p>
            This assessment is designed around modern psychometric principles, modeling tasks on the <strong>Cattell-Horn-Carroll (CHC)</strong> taxonomy of human cognitive abilities and <strong>Raven&apos;s Progressive Matrices</strong>.
          </p>

          <h3 className="text-base font-bold text-slate-900 pt-2">The Wechsler Standard Scale</h3>
          <p>
            Scores are normalized to the classic Wechsler adult distribution:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                <CheckCircle2 className="h-4 w-4 text-slate-700" />
                Mean (μ = 100) & SD (σ = 15)
              </div>
              <p className="text-xs text-slate-500">
                Approximately 68.2% of the population scores between 85 and 115. A score of 130 or higher places a candidate in the top 2.2% (standard qualification for high-IQ societies).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                <CheckCircle2 className="h-4 w-4 text-slate-700" />
                Error & Confidence Intervals
              </div>
              <p className="text-xs text-slate-500">
                Given an estimated test-retest reliability coefficient of r ≈ 0.91, the standard error of measurement produces an approximate 95% confidence interval of ±6 points.
              </p>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 pt-2">Construct Independence</h3>
          <p>
            Non-verbal matrix reasoning tests are constructed to assess <em>fluid intelligence ($G_f$)</em>—the capacity to think logically and solve problems in novel situations, independent of acquired cultural knowledge, formal schooling, or linguistic proficiency.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
