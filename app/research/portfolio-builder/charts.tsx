"use client";

import { useState, useCallback, useMemo, memo } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import {
  ASSET_CLASSES,
  ASSET_SHORT_LABELS,
  CORRELATION_MATRIX,
  PROFILES,
  TOOLTIPS,
  type ComputedStats,
} from "./data";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

// ---------- Risk / Return Scatter ----------

interface RiskReturnScatterProps {
  customReturns: Record<string, number>;
  customVols: Record<string, number>;
  portfolioStats: ComputedStats;
}

export const RiskReturnScatter = memo(function RiskReturnScatter({
  customReturns,
  customVols,
  portfolioStats,
}: RiskReturnScatterProps) {
  const assetData = useMemo(
    () =>
      ASSET_CLASSES.map((ac) => ({
        name: ac.name,
        x: customVols[ac.name] ?? ac.volatility,
        y: customReturns[ac.name] ?? ac.expectedReturn,
        color: ac.color,
      })),
    [customReturns, customVols]
  );

  const portfolioDot = useMemo(
    () => [
      {
        name: "Your Portfolio",
        x: portfolioStats.volatility,
        y: portfolioStats.expectedReturn,
      },
    ],
    [portfolioStats.volatility, portfolioStats.expectedReturn]
  );

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Risk / Return Tradeoff
      </h3>
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid stroke="rgba(221,177,16,0.1)" />
            <XAxis
              type="number"
              dataKey="x"
              name="Volatility"
              unit="%"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              label={{
                value: "Volatility (%)",
                position: "insideBottom",
                offset: -10,
                fill: "#94a3b8",
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Return"
              unit="%"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              label={{
                value: "Exp. Return (%)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#94a3b8",
                fontSize: 12,
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="glass rounded-lg px-3 py-2 text-sm">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-text-secondary">
                      Return: {d.y.toFixed(1)}% | Vol: {d.x.toFixed(1)}%
                    </p>
                  </div>
                );
              }}
            />
            <Scatter name="Asset Classes" data={assetData} isAnimationActive={false}>
              {assetData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} r={6} />
              ))}
            </Scatter>
            <Scatter
              name="Your Portfolio"
              data={portfolioDot}
              isAnimationActive={false}
              shape={((props: any) => {
                const { cx, cy } = props;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={10} fill="rgba(221,177,16,0.2)" stroke="#DDB110" strokeWidth={2} />
                    <circle cx={cx} cy={cy} r={3} fill="#DDB110" />
                  </g>
                );
              }) as never}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// ---------- Allocation Comparison Bars ----------

interface AllocationComparisonBarsProps {
  allocations: Record<string, number>;
  isCustom: boolean;
}

export const AllocationComparisonBars = memo(function AllocationComparisonBars({
  allocations,
  isCustom,
}: AllocationComparisonBarsProps) {
  const barData = useMemo(
    () =>
      ASSET_CLASSES.map((ac) => ({
        name: ac.name,
        Conservative: PROFILES.conservative.allocation[ac.name] ?? 0,
        Moderate: PROFILES.moderate.allocation[ac.name] ?? 0,
        Aggressive: PROFILES.aggressive.allocation[ac.name] ?? 0,
        ...(isCustom ? { Current: allocations[ac.name] ?? 0 } : {}),
      })),
    [allocations, isCustom]
  );

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Profile Comparison
      </h3>
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 5, right: 20, bottom: 5, left: 90 }}
          >
            <CartesianGrid
              stroke="rgba(221,177,16,0.1)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              width={85}
            />
            <Tooltip
              cursor={{ fill: "rgba(221,177,16,0.05)" }}
              contentStyle={{
                background: "rgba(9, 22, 62, 0.9)",
                border: "1px solid rgba(221,177,16,0.2)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
            />
            <Bar dataKey="Conservative" fill="#10b981" radius={[0, 3, 3, 0]} />
            <Bar dataKey="Moderate" fill="#3b82f6" radius={[0, 3, 3, 0]} />
            <Bar dataKey="Aggressive" fill="#f59e0b" radius={[0, 3, 3, 0]} />
            {isCustom && (
              <Bar dataKey="Current" fill="#DDB110" radius={[0, 3, 3, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// ---------- Correlation Heatmap ----------

function correlationColor(v: number): string {
  // Diverging: red (-1) → dark neutral (0) → gold (+1)
  if (v > 0) {
    // 0 → dark neutral (30,41,59), 1 → gold (221,177,16)
    const t = v;
    const r = Math.round(30 + (221 - 30) * t);
    const g = Math.round(41 + (177 - 41) * t);
    const b = Math.round(59 + (16 - 59) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = -v;
    const r = Math.round(30 + (239 - 30) * t);
    const g = Math.round(41 + (68 - 41) * t);
    const b = Math.round(59 + (68 - 59) * t);
    return `rgb(${r},${g},${b})`;
  }
}

function qualitativeLabel(v: number): string {
  const a = Math.abs(v);
  const sign = v >= 0 ? "positive" : "negative";
  if (a >= 0.7) return `Strong ${sign}`;
  if (a >= 0.4) return `Moderate ${sign}`;
  if (a >= 0.15) return `Weak ${sign}`;
  return "Near zero";
}

interface HoverCell {
  row: number;
  col: number;
  x: number;
  y: number;
}

export const CorrelationHeatmap = memo(function CorrelationHeatmap() {
  const n = ASSET_CLASSES.length;
  const [hover, setHover] = useState<HoverCell | null>(null);

  // Layout constants
  const labelPadLeft = 70;
  const labelPadTop = 70;
  const cellSize = 44;
  const gap = 2;
  const gridSize = n * (cellSize + gap) - gap;
  const svgW = labelPadLeft + gridSize + 10;
  const svgH = labelPadTop + gridSize + 10;

  const handleMouseEnter = useCallback(
    (row: number, col: number, e: React.MouseEvent<SVGRectElement>) => {
      const rect = e.currentTarget.closest("svg")!.getBoundingClientRect();
      setHover({
        row,
        col,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => setHover(null), []);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Correlation Matrix</h3>
        <InfoTooltip content={TOOLTIPS.correlation} />
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-[600px] mx-auto"
          style={{ minWidth: 360 }}
        >
          {/* Top axis labels (rotated) */}
          {ASSET_CLASSES.map((ac, i) => (
            <text
              key={`top-${i}`}
              x={labelPadLeft + i * (cellSize + gap) + cellSize / 2}
              y={labelPadTop - 8}
              textAnchor="start"
              fill="#94a3b8"
              fontSize={10}
              transform={`rotate(-45, ${labelPadLeft + i * (cellSize + gap) + cellSize / 2}, ${labelPadTop - 8})`}
              opacity={hover ? (hover.col === i ? 1 : 0.4) : 1}
            >
              {ASSET_SHORT_LABELS[ac.name] ?? ac.name}
            </text>
          ))}

          {/* Left axis labels */}
          {ASSET_CLASSES.map((ac, i) => (
            <text
              key={`left-${i}`}
              x={labelPadLeft - 8}
              y={labelPadTop + i * (cellSize + gap) + cellSize / 2 + 4}
              textAnchor="end"
              fill="#94a3b8"
              fontSize={10}
              opacity={hover ? (hover.row === i ? 1 : 0.4) : 1}
            >
              {ASSET_SHORT_LABELS[ac.name] ?? ac.name}
            </text>
          ))}

          {/* Grid cells */}
          {CORRELATION_MATRIX.map((row, ri) =>
            row.map((val, ci) => {
              const isDiag = ri === ci;
              const isHighlighted =
                hover && (hover.row === ri || hover.col === ci);
              const isHovered =
                hover && hover.row === ri && hover.col === ci;
              const dimmed = hover && !isHighlighted;

              return (
                <g key={`${ri}-${ci}`}>
                  <rect
                    x={labelPadLeft + ci * (cellSize + gap)}
                    y={labelPadTop + ri * (cellSize + gap)}
                    width={cellSize}
                    height={cellSize}
                    rx={4}
                    fill={correlationColor(val)}
                    opacity={dimmed ? 0.3 : 1}
                    stroke={isHovered ? "#fff" : "transparent"}
                    strokeWidth={isHovered ? 1.5 : 0}
                    onMouseEnter={(e) => handleMouseEnter(ri, ci, e)}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: "crosshair" }}
                  />
                  {isHovered && (
                    <text
                      x={
                        labelPadLeft +
                        ci * (cellSize + gap) +
                        cellSize / 2
                      }
                      y={
                        labelPadTop +
                        ri * (cellSize + gap) +
                        cellSize / 2 +
                        4
                      }
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={11}
                      fontWeight={600}
                      pointerEvents="none"
                    >
                      {val.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })
          )}
        </svg>

        {/* Hover tooltip */}
        {hover && (
          <div
            className="absolute pointer-events-none glass rounded-lg px-3 py-2 text-sm z-10"
            style={{
              left: Math.min(hover.x + 14, svgW - 180),
              top: hover.y + 14,
            }}
          >
            <p className="font-semibold text-text-primary">
              {ASSET_CLASSES[hover.row].name} &times;{" "}
              {ASSET_CLASSES[hover.col].name}
            </p>
            <p className="text-text-secondary">
              {CORRELATION_MATRIX[hover.row][hover.col].toFixed(2)} &mdash;{" "}
              {qualitativeLabel(CORRELATION_MATRIX[hover.row][hover.col])}
            </p>
          </div>
        )}
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <span className="text-xs text-text-secondary">-1</span>
        <div
          className="h-3 rounded-full flex-shrink-0"
          style={{
            width: 200,
            background:
              "linear-gradient(to right, #ef4444, #1e293b, #DDB110)",
          }}
        />
        <span className="text-xs text-text-secondary">+1</span>
      </div>
    </div>
  );
});
