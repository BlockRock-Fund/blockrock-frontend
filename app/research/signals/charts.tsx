"use client";

import { SIGNAL_TOOLTIPS } from "./data";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

// ---------- Signal Gauges ----------

interface GaugeProps {
  label: string;
  value: number | null | undefined;
  signal: string;
  min: number;
  max: number;
  unit?: string;
  zones: { end: number; color: string }[];
  tooltip?: string;
}

function Gauge({ label, value, signal, min, max, unit = "", zones, tooltip }: GaugeProps) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = 55;
  const startAngle = Math.PI;

  const signalColors: Record<string, string> = {
    cheap: "#10b981",
    fair: "#f59e0b",
    elevated: "#f97316",
    expensive: "#ef4444",
    inverted: "#ef4444",
    flat: "#f59e0b",
    steep: "#10b981",
    attractive: "#10b981",
    neutral: "#f59e0b",
    tight: "#ef4444",
    unavailable: "#475569",
  };

  // Draw zone arcs
  const zoneArcs = zones.map((zone, i) => {
    const prevEnd = i === 0 ? min : zones[i - 1].end;
    const a1 = startAngle - ((prevEnd - min) / (max - min)) * Math.PI;
    const a2 = startAngle - ((zone.end - min) / (max - min)) * Math.PI;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy - r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy - r * Math.sin(a2);
    const largeArc = Math.abs(a1 - a2) > Math.PI ? 1 : 0;
    return (
      <path
        key={i}
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={zone.color}
        strokeWidth={8}
        strokeLinecap="round"
        opacity={0.3}
      />
    );
  });

  // Needle position
  let needleAngle = startAngle;
  if (value != null) {
    const clamped = Math.max(min, Math.min(max, value));
    needleAngle = startAngle - ((clamped - min) / (max - min)) * Math.PI;
  }
  const needleLen = r - 12;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy - needleLen * Math.sin(needleAngle);

  return (
    <div className="glass rounded-2xl p-4 flex flex-col items-center">
      <div className="flex items-center gap-1 mb-1">
        <p className="text-xs text-text-secondary uppercase tracking-wider">
          {label}
        </p>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {zoneArcs}
        {value != null && (
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#e8edf5"
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}
        <circle cx={cx} cy={cy} r={4} fill="#e8edf5" />
      </svg>
      <p className="text-xl font-bold -mt-2">
        {value != null ? `${value.toFixed(1)}${unit}` : "—"}
      </p>
      <span
        className="text-xs font-semibold mt-1 px-2.5 py-0.5 rounded-full"
        style={{
          color: signalColors[signal] ?? "#94a3b8",
          backgroundColor: `${signalColors[signal] ?? "#94a3b8"}20`,
        }}
      >
        {signal}
      </span>
    </div>
  );
}

export interface SignalGaugesProps {
  valuation: {
    cape: number | null;
    cape_signal: string;
    yield_curve: number | null;
    yield_curve_signal: string;
    hy_spread: number | null;
    hy_spread_signal: string;
  } | null;
  loading?: boolean;
}

export function SignalGauges({ valuation, loading }: SignalGaugesProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="glass rounded-2xl p-4 h-48 animate-pulse flex items-center justify-center"
          >
            <span className="text-text-secondary text-sm">Loading...</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Gauge
        label="CAPE Ratio"
        value={valuation?.cape ?? null}
        signal={valuation?.cape_signal ?? "unavailable"}
        min={5}
        max={50}
        unit="x"
        zones={[
          { end: 15, color: "#10b981" },
          { end: 25, color: "#f59e0b" },
          { end: 50, color: "#ef4444" },
        ]}
        tooltip={SIGNAL_TOOLTIPS.cape}
      />
      <Gauge
        label="Yield Curve"
        value={valuation?.yield_curve ?? null}
        signal={valuation?.yield_curve_signal ?? "unavailable"}
        min={-2}
        max={3}
        unit="%"
        zones={[
          { end: 0, color: "#ef4444" },
          { end: 0.5, color: "#f59e0b" },
          { end: 3, color: "#10b981" },
        ]}
        tooltip={SIGNAL_TOOLTIPS.yieldCurve}
      />
      <Gauge
        label="HY Spread"
        value={valuation?.hy_spread ?? null}
        signal={valuation?.hy_spread_signal ?? "unavailable"}
        min={2}
        max={10}
        unit="%"
        zones={[
          { end: 3.5, color: "#ef4444" },
          { end: 6, color: "#f59e0b" },
          { end: 10, color: "#10b981" },
        ]}
        tooltip={SIGNAL_TOOLTIPS.hySpread}
      />
    </div>
  );
}
