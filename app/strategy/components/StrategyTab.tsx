"use client";

import {
  Shield,
  Gauge,
  Target,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import {
  regimeColor,
  regimeLabel,
  type Universe,
  type ScoreTerm,
  type StrategyConfigResponse,
} from "./types";
import { getFieldMetadata } from "./fieldMetadata";

interface StrategyTabProps {
  universe: Universe;
  regimeScore: string | null;
  regime: string | null;
  shortAllocationPct: string | null;
  strategyConfig: StrategyConfigResponse | null;
}

function ScoreBar({
  label,
  weight,
  color,
  tooltip,
}: {
  label: string;
  weight: number;
  color: string;
  tooltip: string;
}) {
  const magnitude = Math.abs(weight);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{label}</span>
          <InfoTooltip content={tooltip} />
        </div>
        <span className="text-sm font-bold" style={{ color }}>
          {weight < 0 ? "−" : ""}
          {magnitude.toFixed(2)}
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(magnitude * 100, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

type RegimeBandRow = {
  range: string;
  label: string;
  short: number | null;
  color: string;
  width: number;
};

function RegimeSourceBands({
  title,
  axisLabel,
  footnote,
  rows,
}: {
  title: string;
  axisLabel: string;
  footnote?: string;
  rows: RegimeBandRow[];
}) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="text-text-secondary font-medium">{title}</span>
        <span className="text-text-muted">Short Allocation</span>
      </div>
      <div className="flex items-center justify-between text-[10px] text-text-muted mb-2">
        <span>{axisLabel}</span>
      </div>
      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.range} className="flex items-center gap-3">
            <span className="text-xs font-mono w-28 shrink-0 text-text-secondary">
              {row.range}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 w-[52px] text-center"
              style={{ backgroundColor: `${row.color}20`, color: row.color }}
            >
              {row.label}
            </span>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${20 + row.width * 0.6}%`,
                  backgroundColor: row.color,
                }}
              />
            </div>
            <span
              className="text-xs font-bold font-mono w-10 text-right"
              style={{ color: row.color }}
            >
              {row.short !== null ? formatPercent(row.short, 0) : ""}
            </span>
          </div>
        ))}
      </div>
      {footnote && (
        <p className="text-[11px] text-text-muted mt-3">{footnote}</p>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="space-y-1.5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-white/10 rounded w-40" />
        <div className="h-3 bg-white/10 rounded w-10" />
      </div>
      <div className="h-2.5 bg-white/5 rounded-full" />
    </div>
  );
}

function StrategyTabSkeleton() {
  return (
    <div className="space-y-10">
      <div className="glass-strong rounded-2xl p-6">
        <div className="h-5 bg-white/10 rounded w-48 mb-5 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function formatPercent(val: number | null, digits = 0): string {
  if (val === null || val === undefined) return "—";
  return `${(val * 100).toFixed(digits)}%`;
}

function formatFormula(prefix: string, terms: ScoreTerm[]): string {
  return (
    prefix +
    " = " +
    terms
      .map((t) => {
        const sign = t.weight < 0 ? "- " : "";
        const mag = Math.abs(t.weight).toFixed(2);
        return `${sign}${mag} * ${t.field}`;
      })
      .join(" + ")
      .replace(/\+ - /g, "- ")
  );
}

export default function StrategyTab({
  regimeScore,
  regime,
  shortAllocationPct,
  strategyConfig,
}: StrategyTabProps) {
  if (!strategyConfig) {
    return <StrategyTabSkeleton />;
  }

  const rs = regimeScore ? parseFloat(regimeScore) : null;
  const saPct = shortAllocationPct ? parseFloat(shortAllocationPct) * 100 : null;
  // Prefer the backend's authoritative label when available; only fall back to
  // the score-derived bucket if the API didn't return one (older backend).
  const regimeText =
    regime && regime !== "unknown"
      ? regime.charAt(0).toUpperCase() + regime.slice(1)
      : rs !== null
      ? regimeLabel(rs)
      : null;
  const isUnknown = regime === "unknown";

  const regimeCfg = strategyConfig.regime_config;
  const regimeBear = regimeCfg?.short_pct_bearish ?? null;
  const regimeBull = regimeCfg?.short_pct_bullish ?? null;
  const smaWindow = regimeCfg?.sma_window_days ?? null;
  const sourceNames = regimeCfg?.sources?.map((s) => s.name) ?? [];
  const hasBtcSma = sourceNames.includes("btc_sma");
  const hasFearGreed = sourceNames.includes("fear_greed");

  const longTerms = strategyConfig.score_terms;
  const shortTerms = strategyConfig.short_score_terms;

  return (
    <div className="space-y-10">
      {/* Long Score Formula */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-accent-cyan" />
          <h3 className="text-xl font-semibold">
            {shortTerms ? "Long Score Formula" : "Score Formula"}
          </h3>
        </div>
        <div className="space-y-4 mb-5">
          {longTerms.map((t) => {
            const meta = getFieldMetadata(t.field);
            return (
              <ScoreBar
                key={t.field}
                label={meta.label}
                weight={t.weight}
                color={t.weight < 0 ? "#EF4444" : meta.color}
                tooltip={meta.tooltip}
              />
            );
          })}
        </div>
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
          <p className="text-xs font-mono text-text-secondary break-all">
            {formatFormula("score", longTerms)}
          </p>
        </div>
      </div>

      {/* Short Score Formula */}
      {shortTerms && shortTerms.length > 0 && (
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="text-xl font-semibold">Short Score Formula</h3>
          </div>
          <div className="space-y-4 mb-5">
            {shortTerms.map((t) => {
              const meta = getFieldMetadata(t.field);
              return (
                <ScoreBar
                  key={t.field}
                  label={meta.label}
                  weight={t.weight}
                  color={meta.color}
                  tooltip={meta.tooltip}
                />
              );
            })}
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <p className="text-xs font-mono text-text-secondary break-all">
              {formatFormula("short_score", shortTerms)}
            </p>
          </div>
        </div>
      )}

      {/* Smoothed Regime Filter */}
      {regimeCfg && (
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Gauge className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-semibold">Long/Short Regime</h3>
          </div>

          {regimeCfg.sources && regimeCfg.sources.length > 0 && (
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-5">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Sources
              </p>
              <div className="flex flex-wrap gap-3">
                {regimeCfg.sources.map((s) => (
                  <span
                    key={s.name}
                    className="text-xs font-mono px-2 py-1 rounded-md bg-white/[0.04] border border-white/5"
                  >
                    <span className="text-text-secondary">{s.name}</span>{" "}
                    <span className="text-accent-cyan">
                      {formatPercent(s.weight, 0)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allocation anchors */}
          {(regimeBear !== null || regimeBull !== null) && (
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                  Bearish Anchor
                </p>
                <p className="text-[11px] text-text-muted mb-2">
                  Short / Long when regime score = 0
                </p>
                <div className="flex items-baseline gap-3 font-mono">
                  <span className="text-lg font-bold text-red-400">
                    {regimeBear !== null ? formatPercent(regimeBear, 0) : "—"}
                  </span>
                  <span className="text-text-muted">/</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {regimeBear !== null ? formatPercent(1 - regimeBear, 0) : "—"}
                  </span>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
                  Bullish Anchor
                </p>
                <p className="text-[11px] text-text-muted mb-2">
                  Short / Long when regime score = 1
                </p>
                <div className="flex items-baseline gap-3 font-mono">
                  <span className="text-lg font-bold text-red-400">
                    {regimeBull !== null ? formatPercent(regimeBull, 0) : "—"}
                  </span>
                  <span className="text-text-muted">/</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {regimeBull !== null ? formatPercent(1 - regimeBull, 0) : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Per-source visualizations */}
          <div className="space-y-4 mb-6">
            {hasBtcSma && (
              <RegimeSourceBands
                title="BTC / SMA Ratio"
                axisLabel={
                  smaWindow !== null
                    ? `${smaWindow}-day simple moving average`
                    : "Simple moving average"
                }
                rows={[
                  {
                    range: "0.90 or below",
                    label: "Bearish",
                    short: regimeBear,
                    color: "#EF4444",
                    width: 100,
                  },
                  {
                    range: "1.00 (at SMA)",
                    label: "Neutral",
                    short: null,
                    color: "#F59E0B",
                    width: 50,
                  },
                  {
                    range: "1.10 or above",
                    label: "Bullish",
                    short: regimeBull,
                    color: "#10B981",
                    width: 0,
                  },
                ]}
              />
            )}
            {hasFearGreed && (
              <RegimeSourceBands
                title="Crypto Fear & Greed Index"
                axisLabel="0 = Extreme Fear  •  100 = Extreme Greed (contrarian)"
                rows={[
                  {
                    range: "75 or above",
                    label: "Bearish",
                    short: regimeBear,
                    color: "#EF4444",
                    width: 100,
                  },
                  {
                    range: "50 (neutral)",
                    label: "Neutral",
                    short: null,
                    color: "#F59E0B",
                    width: 50,
                  },
                  {
                    range: "25 or below",
                    label: "Bullish",
                    short: regimeBull,
                    color: "#10B981",
                    width: 0,
                  },
                ]}
              />
            )}
          </div>

          {rs !== null && !isUnknown && (
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Regime Score</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: regimeColor(rs) }}
                  />
                  <span className="text-lg font-bold font-mono">{rs.toFixed(2)}</span>
                  {regimeText && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${regimeColor(rs)}20`,
                        color: regimeColor(rs),
                      }}
                    >
                      {regimeText}
                    </span>
                  )}
                </div>
              </div>
              {saPct !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Short Allocation</span>
                  <span className="text-lg font-bold font-mono text-red-400">
                    {saPct.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}
          {isUnknown && (
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-5 flex items-center justify-between text-sm">
              <span className="font-medium">Current Regime Score</span>
              <span className="text-text-muted">
                Insufficient data &mdash; using 50/50 default split
              </span>
            </div>
          )}

        </div>
      )}

      {/* Exclude Symbols */}
      {strategyConfig.exclude_symbols && strategyConfig.exclude_symbols.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
            Excluded Symbols
          </p>
          <div className="flex flex-wrap gap-2">
            {strategyConfig.exclude_symbols.map((s) => (
              <span
                key={s}
                className="text-xs font-mono px-2 py-1 rounded-md bg-white/[0.04] border border-white/5 text-text-secondary"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
