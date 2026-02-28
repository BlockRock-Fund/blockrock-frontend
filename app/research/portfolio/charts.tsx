"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  ASSET_CLASSES,
  PROFILES,
  type ProfileKey,
  type Profile,
} from "./data";

// ---------- Allocation Donut Chart ----------

interface AllocationDonutProps {
  profile: Profile;
}

export function AllocationDonutChart({ profile }: AllocationDonutProps) {
  const data = ASSET_CLASSES.filter(
    (ac) => (profile.allocation[ac.name] ?? 0) > 0
  ).map((ac) => ({
    name: ac.name,
    value: profile.allocation[ac.name],
    color: ac.color,
  }));

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-2 self-start">
        Allocation
      </h3>
      <div className="w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="glass rounded-lg px-3 py-2 text-sm">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-accent-cyan">{d.value}%</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Center label */}
      <div
        className="absolute flex flex-col items-center justify-center pointer-events-none"
        style={{ marginTop: -20 }}
      >
        <span className="text-xs text-text-muted">Profile</span>
        <span className="text-sm font-bold">{profile.name}</span>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-text-secondary">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Signal Gauges ----------

interface GaugeProps {
  label: string;
  value: number | null | undefined;
  signal: string;
  min: number;
  max: number;
  unit?: string;
  zones: { end: number; color: string }[];
}

function Gauge({ label, value, signal, min, max, unit = "", zones }: GaugeProps) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = 55;
  const startAngle = Math.PI;
  const endAngle = 0;

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
      <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">
        {label}
      </p>
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

interface SignalGaugesProps {
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
            <span className="text-text-muted text-sm">Loading...</span>
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
      />
    </div>
  );
}

// ---------- Risk / Return Scatter ----------

export function RiskReturnScatter() {
  const data = ASSET_CLASSES.map((ac) => ({
    name: ac.name,
    x: ac.volatility,
    y: ac.expectedReturn,
    color: ac.color,
  }));

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
                      Return: {d.y}% | Vol: {d.x}%
                    </p>
                  </div>
                );
              }}
            />
            <Scatter data={data} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  r={6}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------- Allocation Comparison Bars ----------

export function AllocationComparisonBars() {
  const barData = ASSET_CLASSES.map((ac) => ({
    name: ac.name,
    Conservative: PROFILES.conservative.allocation[ac.name] ?? 0,
    Moderate: PROFILES.moderate.allocation[ac.name] ?? 0,
    Aggressive: PROFILES.aggressive.allocation[ac.name] ?? 0,
  }));

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
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
