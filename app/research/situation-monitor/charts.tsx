"use client";

import { useState } from "react";
import { BarChart3, ExternalLink, Globe } from "lucide-react";
import { SIGNAL_TOOLTIPS, formatVolume } from "./data";
import type { PolymarketEventData } from "./data";
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

// ---------- Probability Bar ----------

function ProbabilityBar({ probability }: { probability: number }) {
  const pct = Math.max(0, Math.min(100, probability * 100));
  return (
    <div className="h-1.5 w-full rounded-full bg-bg-tertiary">
      <div
        className="h-full rounded-full bg-accent-cyan transition-all"
        style={{ width: `${pct}%`, opacity: 0.5 + probability * 0.5 }}
      />
    </div>
  );
}

// ---------- Market Card ----------

const MAX_VISIBLE_OUTCOMES = 4;

export function MarketCard({ event }: { event: PolymarketEventData }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="glass rounded-2xl p-4 hover:border-accent-cyan/20 transition-all flex flex-col gap-3 h-80 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3">
        {event.image_url && !imgError ? (
          <img
            src={event.image_url}
            alt=""
            className="w-10 h-10 rounded-lg object-cover shrink-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-bg-tertiary/50 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-text-secondary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">
            {event.title}
          </h3>
          {event.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {event.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-medium text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 rounded-full px-2 py-0.5 capitalize"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Outcomes */}
      <div className="flex flex-col gap-2 flex-1">
        {event.is_binary ? (
          // Binary layout
          <div className="flex flex-col gap-1.5">
            {event.outcomes.map((o) => (
              <div key={o.label} className="flex items-center gap-2">
                <span className="text-sm text-text-secondary w-10 shrink-0">
                  {o.label}
                </span>
                <div className="flex-1">
                  <ProbabilityBar probability={o.probability} />
                </div>
                <span className="text-sm font-bold text-text-primary w-12 text-right">
                  {(o.probability * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Multi-outcome layout
          <div className="flex flex-col gap-1.5">
            {event.outcomes.slice(0, MAX_VISIBLE_OUTCOMES).map((o, i) => (
              <div key={i} className={`flex flex-col gap-0.5${o.resolved ? " opacity-40" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary truncate pr-2">
                    {o.label}
                    {o.resolved && (
                      <span className="ml-1 text-[10px] text-text-muted font-medium uppercase">
                        Resolved
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-bold text-text-primary shrink-0">
                    {(o.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <ProbabilityBar probability={o.probability} />
              </div>
            ))}
            {event.num_outcomes > MAX_VISIBLE_OUTCOMES && (
              <span className="text-xs text-text-muted">
                +{event.num_outcomes - MAX_VISIBLE_OUTCOMES} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 pt-2 border-t border-glass-border">
        <div className="flex items-center gap-1">
          <BarChart3 className="w-4 h-4 text-text-muted" />
          <span className="text-sm text-text-secondary">
            24h Vol: {formatVolume(event.volume_24hr)}
          </span>
        </div>
        <span className="text-sm text-text-secondary">
          Liq: {formatVolume(event.liquidity)}
        </span>
        {event.polymarket_url && (
          <a
            href={event.polymarket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs text-text-muted hover:text-accent-cyan transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

// ---------- Market Card Skeleton ----------

export function MarketCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-4 animate-pulse flex flex-col gap-3 h-80">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-bg-tertiary/50" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-bg-tertiary/50 rounded w-3/4" />
          <div className="h-3 bg-bg-tertiary/50 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 bg-bg-tertiary/50 rounded-full w-full" />
        <div className="h-1.5 bg-bg-tertiary/50 rounded-full w-3/4" />
      </div>
      <div className="h-3 bg-bg-tertiary/50 rounded w-1/3 mt-auto" />
    </div>
  );
}
