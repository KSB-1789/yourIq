import React from 'react';
import { getBellCurvePoints } from '../utils/scoring';

interface BellCurveChartProps {
  userIq: number;
  userPercentile: number;
}

export const BellCurveChart: React.FC<BellCurveChartProps> = ({ userIq, userPercentile }) => {
  const points = getBellCurvePoints(1);
  const width = 640;
  const height = 230;
  const paddingX = 40;
  const paddingBottom = 45;
  const paddingTop = 35;

  const minIq = 55;
  const maxIq = 145;

  const getX = (iq: number) => {
    return paddingX + ((iq - minIq) / (maxIq - minIq)) * (width - 2 * paddingX);
  };

  const maxY = Math.max(...points.map(p => p.y));
  const getY = (yVal: number) => {
    return height - paddingBottom - (yVal / maxY) * (height - paddingBottom - paddingTop);
  };

  // Build SVG path string for bell curve outline
  const pathD = points.reduce((acc, curr, idx) => {
    const x = getX(curr.x);
    const y = getY(curr.y);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Build filled path up to user's IQ
  const userPoints = points.filter(p => p.x <= userIq);
  let userFillPath = '';
  if (userPoints.length > 0) {
    const firstX = getX(userPoints[0].x);
    const baseY = height - paddingBottom;
    userFillPath = `M ${firstX} ${baseY}`;
    userPoints.forEach(p => {
      userFillPath += ` L ${getX(p.x)} ${getY(p.y)}`;
    });
    const lastX = getX(userIq);
    userFillPath += ` L ${lastX} ${baseY} Z`;
  }

  const userX = getX(userIq);

  const sdMarks = [
    { iq: 70, label: '-2σ (70)' },
    { iq: 85, label: '-1σ (85)' },
    { iq: 100, label: 'Mean (100)' },
    { iq: 115, label: '+1σ (115)' },
    { iq: 130, label: '+2σ (130)' },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            Population Distribution
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard normal distribution (Wechsler Scale: μ = 100, σ = 15).
          </p>
        </div>
        <div className="rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-700 font-semibold">
          Percentile: {userPercentile}th
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] overflow-visible"
        >
          <defs>
            <linearGradient id="userCurveGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Average Population Zone Shading (85 to 115) */}
          <rect
            x={getX(85)}
            y={paddingTop}
            width={getX(115) - getX(85)}
            height={height - paddingBottom - paddingTop}
            fill="#f1f5f9"
            rx={2}
          />

          {/* Base Axis Line */}
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Standard Deviation Vertical Reference Lines */}
          {sdMarks.map(mark => {
            const mx = getX(mark.iq);
            return (
              <g key={mark.iq}>
                <line
                  x1={mx}
                  y1={paddingTop + 10}
                  x2={mx}
                  y2={height - paddingBottom}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={mx}
                  y={height - paddingBottom + 16}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                >
                  {mark.label}
                </text>
              </g>
            );
          })}

          {/* User Area Fill */}
          {userFillPath && <path d={userFillPath} fill="url(#userCurveGradLight)" />}

          {/* Bell Curve Outline */}
          <path
            d={pathD}
            fill="none"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* User Score Pin */}
          <g transform={`translate(${userX}, 0)`}>
            <line
              x1={0}
              y1={14}
              x2={0}
              y2={height - paddingBottom}
              stroke="#2563eb"
              strokeWidth="2"
            />
            <circle cx={0} cy={14} r={4.5} fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <rect
              x={-30}
              y={-14}
              width={60}
              height={20}
              rx={5}
              fill="#0f172a"
            />
            <text
              x={0}
              y={-1}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
            >
              IQ {userIq}
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-4 rounded bg-slate-100 border border-slate-200" />
          <span>Average Range (85 – 115)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span>Your Performance: Higher than {userPercentile}% of population</span>
        </div>
      </div>
    </div>
  );
};
