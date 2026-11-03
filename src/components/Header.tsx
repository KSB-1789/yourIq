import React from 'react';
import { Brain, Info, History, ArrowLeft, Dumbbell, Award } from 'lucide-react';

interface HeaderProps {
  currentTab?: 'assessment' | 'exercises';
  onSelectTab?: (tab: 'assessment' | 'exercises') => void;
  onGoHome?: () => void;
  onReset?: () => void;
  onOpenAbout?: () => void;
  onOpenHistory?: () => void;
  historyCount?: number;
  isTesting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'assessment',
  onSelectTab,
  onGoHome,
  onReset,
  onOpenAbout,
  onOpenHistory,
  historyCount = 0,
  isTesting = false,
}) => {
  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
    } else if (onReset) {
      onReset();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16 py-3.5">
        {/* Brand Clickable Home Button */}
        <button
          onClick={handleHomeClick}
          className="group flex items-center gap-3 text-left transition hover:opacity-85 cursor-pointer focus:outline-none"
          title="Return to Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs group-hover:scale-105 transition-transform">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 font-['Satoshi',sans-serif]">
                Cognitive Assessment
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Wechsler Psychometric Norming & Training Suite
            </p>
          </div>
        </button>

        {/* Center Mode Switcher Tabs */}
        {!isTesting && onSelectTab && (
          <div className="hidden md:flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => onSelectTab('assessment')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-semibold transition ${
                currentTab === 'assessment'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>Assessment</span>
            </button>
            <button
              onClick={() => onSelectTab('exercises')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-semibold transition ${
                currentTab === 'exercises'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Dumbbell className="h-3.5 w-3.5" />
              <span>Training Gym</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
            >
              <History className="h-4 w-4 text-slate-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-800">
                  {historyCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
          >
            <Info className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Methodology</span>
          </button>

          {isTesting && (
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
              title="Exit current assessment and return home"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Exit to Home</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
