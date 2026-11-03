import React, { useState } from 'react';
import type { TestResult } from '../types';
import { X, Printer, Award } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestResult;
}

const CANDIDATE_NAME_KEY = 'certificate_candidate_name_v1';

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem(CANDIDATE_NAME_KEY) || 'Assessment Candidate';
    } catch {
      return 'Assessment Candidate';
    }
  });

  const handleNameChange = (name: string) => {
    setUserName(name);
    try {
      localStorage.setItem(CANDIDATE_NAME_KEY, name);
    } catch {
      // Ignore
    }
  };

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl text-slate-900">
        {/* Modal Controls (Hidden in print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-slate-900">
            <Award className="h-5 w-5 text-slate-700" />
            <span className="text-sm font-bold tracking-tight">
              Assessment Certificate
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Name Customizer (Hidden in print) */}
        <div className="no-print mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 font-medium">Candidate Name for Certificate:</span>
          <input
            type="text"
            value={userName}
            onChange={e => handleNameChange(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
            placeholder="Candidate Name"
          />
        </div>

        {/* Certificate Document (Print Target) */}
        <div className="certificate-sheet relative overflow-hidden rounded-xl border-4 border-double border-slate-300 bg-[#fafafa] p-8 sm:p-12 text-center shadow-inner">
          {/* Certificate Header */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-1">
              Standardized Cognitive Evaluation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-900 font-['Satoshi',sans-serif]">
              Certificate of Performance
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">
              Wechsler Scale Norming (Mean 100, SD 15)
            </p>
          </div>

          <div className="my-6 h-px w-24 mx-auto bg-slate-300" />

          {/* Candidate Name */}
          <div className="my-4">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              This document certifies that
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {userName || 'Candidate'}
            </h2>
            <p className="text-xs text-slate-600 mt-3 max-w-lg mx-auto leading-relaxed">
              has completed the progressive matrix evaluation measuring fluid intelligence, visual-spatial reasoning, and relational deduction.
            </p>
          </div>

          {/* Score Showcase */}
          <div className="my-8 grid grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Standard IQ
              </span>
              <span className="text-3xl font-extrabold text-slate-900 block mt-0.5">
                {result.iqScore}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                95% CI: [{result.confidenceInterval[0]} - {result.confidenceInterval[1]}]
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Percentile
              </span>
              <span className="text-3xl font-extrabold text-slate-900 block mt-0.5">
                {result.percentile}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Population Rank
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Classification
              </span>
              <span className="text-sm font-bold text-slate-900 block mt-2">
                {result.classification}
              </span>
            </div>
          </div>

          {/* Domain Breakdown Row */}
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto my-4 text-[11px]">
            {result.domainScores.map(d => (
              <span
                key={d.domain}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 shadow-2xs"
              >
                <strong>{d.name}:</strong> IQ {d.score} ({d.percentile}th)
              </span>
            ))}
          </div>

          {/* Footer & Digital Seal */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-left text-xs text-slate-500">
            <div>
              <div className="font-semibold text-slate-800 text-[11px]">
                ID: {result.assessmentId}
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Date: {result.timestamp} • Hash: {result.verifiedHash}
              </p>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white shadow-2xs">
                <Award className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 block">
                  Official Record
                </span>
                <span className="text-[9px] text-slate-500 block">Wechsler Scale Normed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
