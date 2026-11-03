import React from 'react';
import type { TestResult } from '../types';
import { X, Calendar, Clock, Trash2, ArrowUpRight, Award, Trash } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TestResult[];
  onSelectResult: (result: TestResult) => void;
  onDeleteResult: (assessmentId: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onDeleteResult,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl text-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Assessment History
              </h2>
              <p className="text-xs text-slate-500">
                Performance records stored privately in your browser.
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
            >
              <Trash className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <Clock className="h-10 w-10 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-slate-600">No Assessment Records</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Complete an evaluation to track your standardized scores and cognitive progress over time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div
                key={item.assessmentId || idx}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  {/* Score Pill */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-white border border-slate-200 p-2.5 min-w-[70px] shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      IQ
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">
                      {item.iqScore}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {item.classification}
                      </span>
                      <span className="rounded-md bg-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {item.percentile}th percentile
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {item.timestamp}
                      </span>
                      <span>•</span>
                      <span>
                        {item.correctCount}/{item.totalQuestions} correct ({item.rawScorePercentage}%)
                      </span>
                      <span>•</span>
                      <span>{formatTime(item.totalTimeSeconds)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectResult(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800"
                  >
                    <span>View Report</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteResult(item.assessmentId)}
                    title="Delete record"
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
