import React, { useState } from 'react';
import type { Question, UserResponse } from '../types';
import { MatrixCellSvg } from './MatrixSvg';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ExplanationsReviewProps {
  questions: Question[];
  responses: Record<number, UserResponse>;
}

export const ExplanationsReview: React.FC<ExplanationsReviewProps> = ({ questions, responses }) => {
  const [expandedId, setExpandedId] = useState<number | null>(questions[0]?.id ?? null);
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredQuestions = questions.filter(q => {
    const isCorrect = responses[q.id]?.selectedOption === q.correctAnswer;
    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Item Review & Logic Explanations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step rule derivations for each assessment item.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-3 py-1 font-semibold transition ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`rounded-md px-3 py-1 font-semibold transition ${
              filter === 'correct'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Correct
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`rounded-md px-3 py-1 font-semibold transition ${
              filter === 'incorrect'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Incorrect
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-6 space-y-3">
        {filteredQuestions.map((q, idx) => {
          const resp = responses[q.id];
          const isCorrect = resp?.selectedOption === q.correctAnswer;
          const isExpanded = expandedId === q.id;
          const userOption = resp?.selectedOption !== null && resp?.selectedOption !== undefined
            ? q.options[resp.selectedOption]
            : null;
          const correctOption = q.options[q.correctAnswer];

          return (
            <div
              key={q.id}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isExpanded
                  ? 'border-slate-300 bg-white shadow-2xs'
                  : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
              }`}
            >
              {/* Header Toggle */}
              <button
                onClick={() => toggleExpand(q.id)}
                className="flex w-full items-center justify-between p-4 text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Q{idx + 1}.
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {q.title}
                      </span>
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 bg-white">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Question visual / structural preview */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/60 p-4 lg:col-span-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        {q.matrixType === 'number_series'
                          ? 'Number Progression'
                          : q.matrixType === 'verbal_analogy'
                          ? 'Verbal Analogy'
                          : q.matrixType === 'delayed_recall'
                          ? 'Delayed Memory Check'
                          : 'Puzzle Matrix'}
                      </span>

                      {/* Number series preview */}
                      {q.matrixType === 'number_series' && q.numberSeries && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 p-3">
                          {q.numberSeries.sequence.map((item, idx) => (
                            <span
                              key={idx}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-mono font-bold ${
                                item === '?'
                                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                                  : 'border-slate-200 bg-white text-slate-800'
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Verbal analogy preview */}
                      {q.matrixType === 'verbal_analogy' && q.analogy && (
                        <div className="text-center p-2 text-xs font-medium text-slate-700 space-y-1">
                          <p>
                            <span className="font-bold text-slate-900">{q.analogy.pairA[0]}</span> : {q.analogy.pairA[1]}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">::</p>
                          <p>
                            <span className="font-bold text-slate-900">{q.analogy.pairB[0]}</span> : <span className="font-mono text-blue-600 font-bold">[ ? ]</span>
                          </p>
                        </div>
                      )}

                      {/* Delayed recall preview */}
                      {q.matrixType === 'delayed_recall' && (
                        <div className="text-center p-3 text-xs text-amber-800 bg-amber-50 rounded-xl border border-amber-200">
                          <span className="font-bold block">Cognitive Memory Code Recall</span>
                          <span className="text-[11px] text-amber-700 mt-1 block">Retrieval test under interference</span>
                        </div>
                      )}

                      {/* Matrix SVG preview */}
                      {q.matrixType === '3x3' && q.cells && (
                        <div className="grid grid-cols-3 gap-2">
                          {q.cells.map((cell, cIdx) => (
                            <MatrixCellSvg key={cIdx} cell={cell} size={62} />
                          ))}
                        </div>
                      )}
                      {q.matrixType === '2x2' && q.cells && (
                        <div className="grid grid-cols-2 gap-2">
                          {q.cells.map((cell, cIdx) => (
                            <MatrixCellSvg key={cIdx} cell={cell} size={76} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Answer Comparison & Explanation */}
                    <div className="flex flex-col justify-between lg:col-span-7">
                      {/* Comparison tiles */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3 text-center">
                          <span className="text-[10px] font-semibold uppercase text-slate-500 block mb-1">
                            Your Selection
                          </span>
                          <div className="flex justify-center items-center min-h-[52px]">
                            {userOption ? (
                              userOption.elements ? (
                                <MatrixCellSvg cell={{ elements: userOption.elements }} size={52} />
                              ) : (
                                <span className="text-sm font-mono font-bold text-slate-900 px-3 py-1 bg-white rounded-lg border border-slate-200">
                                  {userOption.text}
                                </span>
                              )
                            ) : (
                              <span className="text-xs text-slate-400 py-3">Unanswered</span>
                            )}
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-3 text-center">
                          <span className="text-[10px] font-semibold uppercase text-emerald-800 block mb-1">
                            Correct: Option {String.fromCharCode(65 + q.correctAnswer)}
                          </span>
                          <div className="flex justify-center items-center min-h-[52px]">
                            {correctOption.elements ? (
                              <MatrixCellSvg cell={{ elements: correctOption.elements }} size={52} />
                            ) : (
                              <span className="text-sm font-mono font-bold text-emerald-900 px-3 py-1 bg-white rounded-lg border border-emerald-200">
                                {correctOption.text}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rule Breakdown */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                        <h4 className="text-xs font-bold text-slate-900 mb-1">
                          {q.explanation.title}
                        </h4>
                        <p className="text-xs text-slate-700 font-medium mb-2">
                          {q.explanation.rule}
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                          {q.explanation.breakdown.map((point, bIdx) => (
                            <li key={bIdx}>{point}</li>
                          ))}
                        </ul>
                        <p className="mt-2.5 text-xs text-slate-800 font-medium">
                          {q.explanation.whyCorrect}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
