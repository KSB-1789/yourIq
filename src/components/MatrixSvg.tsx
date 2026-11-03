import React from 'react';
import type { CellData, ShapeElement } from '../types';

interface MatrixSvgProps {
  cell: CellData;
  size?: number; // Size in px
  className?: string;
  isHoverable?: boolean;
  isSelected?: boolean;
}

// Ensure color contrast is sharp on clean light backgrounds
const normalizeColor = (color?: string, isFill = false): string => {
  if (!color || color === 'none') return isFill ? 'none' : '#1e293b';
  // If color was light blue (#38bdf8), map to crisp slate-blue (#2563eb or #0284c7)
  if (color === '#38bdf8' || color === '#60a5fa') return '#2563eb';
  if (color === '#a855f7' || color === '#c084fc') return '#7c3aed';
  if (color === '#10b981') return '#059669';
  if (color === '#f59e0b') return '#d97706';
  if (color === '#94a3b8' || color === '#e2e8f0' || color === '#f8fafc') return '#334155';
  return color;
};

export const ShapeRenderer: React.FC<{ element: ShapeElement; parentSize: number }> = ({ element, parentSize }) => {
  const center = parentSize / 2;
  const rotation = element.rotation || 0;
  const scale = element.scale || 1.0;
  const fill = normalizeColor(element.fill, true);
  const stroke = normalizeColor(element.stroke, false);
  const strokeWidth = element.strokeWidth || 2;
  const r = (parentSize * 0.35) * scale;

  return (
    <g transform={`rotate(${rotation} ${center} ${center})`}>
      {element.type === 'circle' && (
        <circle cx={center} cy={center} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      )}

      {element.type === 'square' && (
        <rect
          x={center - r}
          y={center - r}
          width={r * 2}
          height={r * 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          rx={3}
        />
      )}

      {element.type === 'diamond' && (
        <polygon
          points={`${center},${center - r * 1.1} ${center + r * 1.1},${center} ${center},${center + r * 1.1} ${center - r * 1.1},${center}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}

      {element.type === 'triangle' && (
        <polygon
          points={`${center},${center - r * 1.1} ${center + r * 1.1},${center + r * 0.9} ${center - r * 1.1},${center + r * 0.9}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}

      {element.type === 'cross' && (
        <g stroke={stroke} strokeWidth={strokeWidth + 1} strokeLinecap="round">
          <line x1={center - r} y1={center} x2={center + r} y2={center} />
          <line x1={center} y1={center - r} x2={center} y2={center + r} />
        </g>
      )}

      {element.type === 'star' && (
        <polygon
          points={`${center},${center - r} ${center + r * 0.3},${center - r * 0.3} ${center + r},${center - r * 0.3} ${center + r * 0.45},${center + r * 0.2} ${center + r * 0.7},${center + r} ${center},${center + r * 0.5} ${center - r * 0.7},${center + r} ${center - r * 0.45},${center + r * 0.2} ${center - r},${center - r * 0.3} ${center - r * 0.3},${center - r * 0.3}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}

      {/* 3x3 Dots matrix grid */}
      {element.type === 'dots' && element.gridDots && (
        <g>
          {element.gridDots.map((isActive, idx) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            const dotX = center + (col - 1) * (parentSize * 0.25);
            const dotY = center + (row - 1) * (parentSize * 0.25);
            const dotR = parentSize * 0.06;
            return (
              <circle
                key={idx}
                cx={dotX}
                cy={dotY}
                r={dotR}
                fill={isActive ? (element.fill && element.fill !== 'none' ? normalizeColor(element.fill, true) : '#2563eb') : '#f8fafc'}
                stroke={isActive ? (normalizeColor(element.stroke, false) || '#1d4ed8') : '#cbd5e1'}
                strokeWidth={1.5}
              />
            );
          })}
        </g>
      )}

      {/* Arbitrary lines */}
      {element.lines && element.lines.map((ln, idx) => (
        <line
          key={idx}
          x1={center + ln.x1 * (parentSize / 2)}
          y1={center + ln.y1 * (parentSize / 2)}
          x2={center + ln.x2 * (parentSize / 2)}
          y2={center + ln.y2 * (parentSize / 2)}
          stroke={normalizeColor(ln.color, false) || stroke}
          strokeWidth={ln.width || strokeWidth}
          strokeDasharray={ln.dashed ? '4,4' : undefined}
          strokeLinecap="round"
        />
      ))}

      {/* Text label or number */}
      {element.text && (
        <text
          x={center}
          y={center + 6}
          textAnchor="middle"
          fill={fill !== 'none' ? fill : '#0f172a'}
          fontSize={parentSize * 0.28}
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {element.text}
        </text>
      )}

      {/* Nested shapes */}
      {element.nested && element.nested.map((nestedEl, idx) => (
        <ShapeRenderer key={idx} element={nestedEl} parentSize={parentSize} />
      ))}
    </g>
  );
};

export const MatrixCellSvg: React.FC<MatrixSvgProps> = ({
  cell,
  size = 110,
  className = '',
  isSelected = false,
}) => {
  if (cell.isTarget) {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all ${className}`}
      >
        <span className="text-2xl font-bold text-slate-400">
          ?
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative flex items-center justify-center rounded-xl border bg-white transition-all overflow-hidden ${
        isSelected
          ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-xs'
          : 'border-slate-200 hover:border-slate-300 shadow-2xs'
      } ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {cell.elements.map((el, idx) => (
          <ShapeRenderer key={idx} element={el} parentSize={size} />
        ))}
      </svg>
    </div>
  );
};
