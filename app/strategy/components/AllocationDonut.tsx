"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from "recharts";
import {
  TargetWeight,
  colorForRank,
  LONG_DEEP,
  LONG_BRIGHT,
  SHORT_DEEP,
  SHORT_BRIGHT,
} from "./types";

interface AllocationDonutProps {
  longs: TargetWeight[];
  shorts: TargetWeight[];
  longPct: number;
}

const RADIAN = Math.PI / 180;
const INNER_R = 70;
const OUTER_R = 102;
const CHIP_GAP = 28;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServer(): boolean {
  return false;
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServer
  );
}

function useCountUp(target: number, durationMs = 800): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    if (reduced) {
      const raf = requestAnimationFrame(() => {
        setValue(target);
        fromRef.current = target;
      });
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      setValue(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, reduced]);

  return value;
}

type ActiveShapeProps = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
};

function renderActiveShape(props: ActiveShapeProps) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.35}
      />
    </g>
  );
}

export default function AllocationDonut({
  longs,
  shorts,
  longPct,
}: AllocationDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const animatedPct = useCountUp(longPct, 900);
  const reducedMotion = useReducedMotion();

  const pieData = useMemo(() => {
    const longSorted = [...longs].sort(
      (a, b) => parseFloat(b.target_weight) - parseFloat(a.target_weight)
    );
    const shortSorted = [...shorts].sort(
      (a, b) => parseFloat(b.target_weight) - parseFloat(a.target_weight)
    );
    const longRows = longSorted.map((w, rank) => ({
      name: w.symbol,
      value: parseFloat(w.target_weight) * 100,
      side: "long" as const,
      color: colorForRank(rank, longSorted.length, "long"),
    }));
    const shortRows = shortSorted.map((w, rank) => ({
      name: w.symbol,
      value: parseFloat(w.target_weight) * 100,
      side: "short" as const,
      color: colorForRank(rank, shortSorted.length, "short"),
    }));
    return [...longRows, ...shortRows];
  }, [longs, shorts]);

  const shortPct = Math.max(0, 100 - longPct);
  const total = longs.length + shorts.length;

  type ChipLabelProps = {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    index: number;
    name: string;
    value: number;
  };

  const renderChip = (props: ChipLabelProps) => {
    const { cx, cy, midAngle, outerRadius, index, name, value } = props;
    const entry = pieData[index];
    if (!entry) return null;
    const color = entry.color;
    const isActive = index === activeIndex;

    const r1 = outerRadius + 4;
    const r2 = outerRadius + CHIP_GAP;
    const cos = Math.cos(-midAngle * RADIAN);
    const sin = Math.sin(-midAngle * RADIAN);
    const x1 = cx + r1 * cos;
    const y1 = cy + r1 * sin;
    const x2 = cx + r2 * cos;
    const y2 = cy + r2 * sin;
    const right = x2 >= cx;

    const tickerText = name;
    const valueText = `${value.toFixed(1)}%`;
    // Approximate widths at 11px Rubik
    const tickerW = tickerText.length * 6.6;
    const valueW = valueText.length * 6.0;
    const dotW = 12;
    const innerGap = 6;
    const padX = 8;
    const chipW = padX * 2 + dotW + innerGap + tickerW + 4 + valueW;
    const chipH = 22;

    const anchorX = x2 + (right ? 4 : -4);
    const chipLeft = right ? anchorX : anchorX - chipW;
    const chipTop = y2 - chipH / 2;
    const lineEndX = right ? chipLeft : chipLeft + chipW;

    const dotCx = chipLeft + padX + dotW / 2;
    const textStartX = chipLeft + padX + dotW + innerGap;

    return (
      <g style={{ pointerEvents: "none" }}>
        <line
          x1={x1}
          y1={y1}
          x2={lineEndX}
          y2={y2}
          stroke={isActive ? color : "rgba(255,255,255,0.16)"}
          strokeWidth={1}
        />
        <rect
          x={chipLeft}
          y={chipTop}
          width={chipW}
          height={chipH}
          rx={11}
          ry={11}
          fill={isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)"}
          stroke={isActive ? color : "rgba(255,255,255,0.10)"}
          strokeWidth={1}
        />
        <circle
          cx={dotCx}
          cy={chipTop + chipH / 2}
          r={isActive ? 4 : 3}
          fill={color}
        />
        <text
          x={textStartX}
          y={chipTop + chipH / 2 + 0.5}
          dominantBaseline="central"
          fontSize={11}
          fontWeight={600}
          fill={isActive ? "#ffffff" : "var(--text-secondary)"}
        >
          {tickerText}
          <tspan dx={4} fill="var(--text-muted)" fontWeight={500}>
            {valueText}
          </tspan>
        </text>
      </g>
    );
  };

  return (
    <div className="glass rounded-2xl p-6 lg:col-span-2 overflow-hidden">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-xl font-semibold">Allocation</h3>
        <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-mono">
          {total} positions
        </div>
      </div>
      <p className="text-xs text-text-muted mb-4">
        Slice color intensity scales with target weight within each side.
      </p>

      <div className="relative">
        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
            <defs>
              <radialGradient id="alloc-center-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(221, 177, 16, 0.16)" />
                <stop offset="60%" stopColor="rgba(221, 177, 16, 0.04)" />
                <stop offset="100%" stopColor="rgba(221, 177, 16, 0)" />
              </radialGradient>
            </defs>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={INNER_R}
              outerRadius={OUTER_R}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={!reducedMotion}
              animationDuration={700}
              animationEasing="ease-out"
              activeIndex={activeIndex === -1 ? undefined : activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(-1)}
              label={renderChip}
              labelLine={false}
              stroke="rgba(5, 12, 34, 0.6)"
              strokeWidth={1}
            >
              {pieData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>

            {/* Center halo */}
            <circle
              cx="50%"
              cy="50%"
              r={INNER_R - 2}
              fill="url(#alloc-center-glow)"
              pointerEvents="none"
            />

            {/* Center text */}
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ffffff"
              style={{
                fontSize: "30px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {animatedPct.toFixed(0)}%
            </text>
            <text
              x="50%"
              y="57%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-muted)"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              net long
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Long / short legend ribbon */}
      <div className="mt-2 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 min-w-[78px]">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: LONG_BRIGHT,
                boxShadow: `0 0 8px ${LONG_BRIGHT}80`,
              }}
            />
            <span className="text-[11px] font-semibold text-emerald-300 font-mono tabular-nums">
              {longPct.toFixed(0)}% long
            </span>
          </div>
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden flex">
            <div
              className="h-full transition-[width] duration-700 ease-out"
              style={{
                width: `${longPct}%`,
                background: `linear-gradient(90deg, ${LONG_DEEP} 0%, ${LONG_BRIGHT} 100%)`,
              }}
            />
            <div
              className="h-full transition-[width] duration-700 ease-out"
              style={{
                width: `${shortPct}%`,
                background: `linear-gradient(90deg, ${SHORT_DEEP} 0%, ${SHORT_BRIGHT} 100%)`,
              }}
            />
          </div>
          <div className="flex items-center gap-1.5 min-w-[78px] justify-end">
            <span className="text-[11px] font-semibold text-rose-300 font-mono tabular-nums">
              {shortPct.toFixed(0)}% short
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: SHORT_BRIGHT,
                boxShadow: `0 0 8px ${SHORT_BRIGHT}80`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
