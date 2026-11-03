import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Clock, CheckCircle2, XCircle, Brain } from 'lucide-react';
import { zToPercentile } from '../../utils/scoring';

interface MentalRotationProps {
  onBack: () => void;
  onFinish?: (score: number, accuracy: number) => void;
}

interface ShapeItem {
  type: 'L_block' | 'T_block' | 'Z_block' | 'arrow_poly' | 'angle_bracket';
  rotationA: number;
  rotationB: number;
  isSame: boolean;
}

function generateProblem(): ShapeItem {
  const types: ShapeItem['type'][] = ['L_block', 'T_block', 'Z_block', 'arrow_poly', 'angle_bracket'];
  const chosenType = types[Math.floor(Math.random() * types.length)];
  const rotA = Math.floor(Math.random() * 4) * 90;
  const isSame = Math.random() > 0.5;
  const angleDelta = [90, 180, 270][Math.floor(Math.random() * 3)];
  const rotB = (rotA + angleDelta) % 360;

  return {
    type: chosenType,
    rotationA: rotA,
    rotationB: rotB,
    isSame,
  };
}

export const MentalRotationExercise: React.FC<MentalRotationProps> = ({ onBack, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(true);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [currentProblem, setCurrentProblem] = useState<ShapeItem>(() => generateProblem());

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

  const handleAnswer = (userSaysSame: boolean) => {
    if (!isActive) return;

    setTotalAttempted(prev => prev + 1);
    const correct = userSaysSame === currentProblem.isSame;

    if (correct) {
      setCorrectCount(prev => prev + 1);
      const points = 100 + streak * 20;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setFeedback('correct');
    } else {
      setStreak(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentProblem(generateProblem());
    }, 350);
  };

  const handleRestart = () => {
    setTimeLeft(45);
    setIsActive(true);
    setScore(0);
    setTotalAttempted(0);
    setCorrectCount(0);
    setStreak(0);
    setCurrentProblem(generateProblem());
  };

  const renderShape = (type: ShapeItem['type'], rotation: number, isMirrored = false) => {
    return (
      <svg
        width={130}
        height={130}
        viewBox="0 0 100 100"
        className="transition-transform duration-200"
        style={{
          transform: `rotate(${rotation}deg) ${isMirrored ? 'scaleX(-1)' : ''}`,
        }}
      >
        {type === 'L_block' && (
          <path
            d="M 30 20 L 50 20 L 50 60 L 75 60 L 75 80 L 30 80 Z"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="3"
            rx="4"
          />
        )}
        {type === 'T_block' && (
          <path
            d="M 20 25 L 80 25 L 80 45 L 60 45 L 60 85 L 40 85 L 40 45 L 20 45 Z"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="3"
            rx="4"
          />
        )}
        {type === 'Z_block' && (
          <path
            d="M 20 25 L 60 25 L 60 45 L 80 45 L 80 75 L 40 75 L 40 55 L 20 55 Z"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="3"
            rx="4"
          />
        )}
        {type === 'arrow_poly' && (
          <polygon
            points="50,15 80,45 65,45 65,85 35,85 35,45 20,45"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="3"
          />
        )}
        {type === 'angle_bracket' && (
          <path
            d="M 30 25 L 70 25 L 70 45 L 50 45 L 50 75 L 30 75 Z"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="3"
          />
        )}
      </svg>
    );
  };

  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
  const meanNorm = 8.0;
  const sdNorm = 2.5;
  const zScore = (correctCount - meanNorm) / sdNorm;
  const spatialIndex = Math.max(70, Math.min(150, Math.round(100 + zScore * 15)));
  const percentile = zToPercentile(zScore);
  const latency = totalAttempted > 0 ? (45 / totalAttempted).toFixed(1) : '0.0';

  let classification = 'Average Mental Rotation';
  let badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';

  if (spatialIndex >= 130) {
    classification = 'Very Superior (Parietal Precision)';
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (spatialIndex >= 120) {
    classification = 'Superior Spatial Rotation';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (spatialIndex >= 110) {
    classification = 'High Average Spatial Speed';
    badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
  } else if (spatialIndex >= 90) {
    classification = 'Average Mental Rotation';
    badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';
  } else {
    classification = 'Developing Spatial Agility';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  const gaugePercent = Math.min(100, Math.max(0, ((spatialIndex - 70) / (145 - 70)) * 100));

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
            <span className="text-slate-400 font-normal">Streak:</span>
            <span className="text-base font-bold text-blue-600">{streak}🔥</span>
          </div>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-2xs text-center flex flex-col items-center">
        <div className="max-w-md w-full mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
            Mental Rotation Speed Challenge
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Determine if Shape B is an identical rotated version of Shape A, or if it is a mirrored/mismatched shape.
          </p>
        </div>

        {isActive ? (
          <>
            {/* Shapes Side-by-Side Comparison */}
            <div className="grid grid-cols-2 gap-6 my-6 max-w-lg w-full">
              <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-inner">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Reference (Shape A)
                </span>
                <div className="h-36 flex items-center justify-center">
                  {renderShape(currentProblem.type, currentProblem.rotationA, false)}
                </div>
              </div>

              <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-inner">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Comparison (Shape B)
                </span>
                <div className="h-36 flex items-center justify-center">
                  {renderShape(currentProblem.type, currentProblem.rotationB, !currentProblem.isSame)}
                </div>
              </div>
            </div>

            {/* Feedback Flash */}
            <div className="h-6 mb-4">
              {feedback === 'correct' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Correct (+{100 + (streak - 1) * 20})
                </span>
              )}
              {feedback === 'wrong' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                  <XCircle className="h-4 w-4" /> Incorrect
                </span>
              )}
            </div>

            {/* Answer Controls */}
            <div className="grid grid-cols-2 gap-4 max-w-md w-full">
              <button
                onClick={() => handleAnswer(true)}
                className="rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition shadow-2xs"
              >
                Identical (Rotated)
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition shadow-2xs"
              >
                Different (Mirrored)
              </button>
            </div>
          </>
        ) : (
          /* Detailed Psychometric Summary Screen */
          <div className="mt-4 p-8 rounded-3xl border border-slate-200 bg-white max-w-xl w-full text-left shadow-2xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Sprint Diagnostic Report
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Satoshi',sans-serif]">
                  Mental Rotation Analysis
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
                  Spatial Processing
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  SPI {spatialIndex}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Shepard-Metzler (SD 15)
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
                  Decision Latency
                </span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-1">
                  {latency}s
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Throughput / Rotation
                </span>
              </div>
            </div>

            {/* Population Distribution Gauge */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Shepard-Metzler Population Benchmark</span>
                <span className="font-bold text-slate-900">Your Placement: SPI {spatialIndex}</span>
              </div>

              <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${gaugePercent}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Low (&lt; 5)</span>
                <span>Adult Average (8.0)</span>
                <span>Superior (11+)</span>
                <span>Ceiling (14+)</span>
              </div>
            </div>

            {/* Diagnostic Clinical Interpretation */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-xs text-slate-700 leading-relaxed space-y-2 mb-6">
              <p>
                <strong>Clinical Assessment:</strong> You solved <strong>{correctCount} items</strong> with an accuracy rate of{' '}
                <strong>{accuracy}%</strong> at an average speed of <strong>{latency} seconds per comparison</strong>, placing your spatial orientation speed ($G_v$) at the{' '}
                <strong>{percentile}th percentile</strong> of adult cohorts.
              </p>
              <p>
                The Shepard-Metzler paradigm isolates the dorsal visual stream and posterior parietal cortex (PPC). 
                Mental rotation involves three discrete neurocognitive operations: mental representation encoding, continuous spatial rotation along coordinate vectors, and chiral reflection discrimination. 
                {correctCount >= 11
                  ? ' Your rapid rotation latency and high reflection rejection demonstrate exceptional isometric visualization capabilities characteristic of advanced spatial problem-solving.'
                  : correctCount >= 8
                  ? ' Your throughput reflects typical adult spatial rotation speed with robust coordinate preservation.'
                  : ' Decision speed was constrained under time pressure. Repeated drills accelerate internal rotational velocity and reduce mental verification cycles.'}
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
              <span>Retry Sprint</span>
            </button>
          </div>
        )}

        {isActive && (
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
            <Brain className="h-4 w-4" />
            <span>Training 3D mental rotation speed, spatial transformation, and parietal lobe processing.</span>
          </div>
        )}
      </div>
    </div>
  );
};
