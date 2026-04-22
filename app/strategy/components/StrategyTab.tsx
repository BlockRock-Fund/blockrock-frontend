"use client";

import {
  Shield,
  BarChart3,
  ArrowRight,
  Activity,
  Target,
  Layers,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { regimeColor, regimeLabel, type Universe } from "./types";

interface StrategyTabProps {
  universe: Universe;
  regimeScore: string | null;
  shortAllocationPct: string | null;
  confluenceMultiplier?: string | null;
  confluenceStressed?: number | null;
  confluenceTotal?: number | null;
}

type ScoreTermDef = {
  label: string;
  weight: number;
  color: string;
  tooltip: string;
};

type StrategyConfig = {
  title: string;
  longTerms: ScoreTermDef[];
  longFormula: string;
  shortTerms?: ScoreTermDef[];
  shortFormula?: string;
  regimeBear: string;
  regimeBull: string;
  constraints: { label: string; value: string; accent: string }[];
};

const STRATEGY_CONFIGS: Record<Universe, StrategyConfig> = {
  token: {
    title: "Pure Fundamental Token Strategy",
    longTerms: [
      {
        label: "Distributions Yield",
        weight: 35,
        color: "#10B981",
        tooltip:
          "Expected 1-year distributions yield. The strongest single return predictor in factor research (IC 0.14 at 30d, 0.17 at 90d).",
      },
      {
        label: "Net Earnings Yield",
        weight: 30,
        color: "#3B82F6",
        tooltip:
          "Expected 1-year net earnings yield after emissions. Second strongest factor for tokens.",
      },
      {
        label: "Earnings Quality",
        weight: 20,
        color: "#8B5CF6",
        tooltip:
          "Earnings-to-distributions ratio. Rewards protocols that distribute a larger share of earnings to holders.",
      },
      {
        label: "Distribution Momentum",
        weight: 15,
        color: "#F59E0B",
        tooltip:
          "30-day period-over-period change in distributions. Rising distributions signal improving fundamentals.",
      },
    ],
    longFormula:
      "score = 0.35 * dist_yield + 0.30 * net_earnings_yield + 0.20 * earnings_quality + 0.15 * dist_momentum_30d",
    regimeBear: "70%",
    regimeBull: "30%",
    constraints: [
      { label: "Max Long Holdings", value: "10", accent: "#DDB110" },
      { label: "Max Long Weight", value: "25%", accent: "#DDB110" },
      { label: "Max Short Positions", value: "5", accent: "#F87171" },
      { label: "Max Short Weight", value: "25%", accent: "#F87171" },
      { label: "Bear Short Alloc", value: "70%", accent: "#F87171" },
      { label: "Bull Short Alloc", value: "30%", accent: "#10B981" },
    ],
  },
  equity: {
    title: "Yield-Weighted Equity Strategy",
    longTerms: [
      {
        label: "Distributions Yield",
        weight: 35,
        color: "#10B981",
        tooltip:
          "Expected 1-year distributions yield. Dominates equity returns (IC 0.15 at 30d, 0.25 at 90d).",
      },
      {
        label: "Net Earnings Yield",
        weight: 25,
        color: "#3B82F6",
        tooltip:
          "Expected 1-year net earnings yield. Second strongest equity factor (IC 0.10).",
      },
      {
        label: "Revenue Yield",
        weight: 15,
        color: "#06B6D4",
        tooltip:
          "Revenue relative to market cap. Cross-horizon consistent for equities (IC 0.08-0.12).",
      },
      {
        label: "Earnings Quality",
        weight: 15,
        color: "#8B5CF6",
        tooltip:
          "Earnings-to-distributions ratio. High payout ratios signal shareholder-friendly management.",
      },
      {
        label: "Emissions Rate",
        weight: 10,
        color: "#EF4444",
        tooltip:
          "Share dilution rate. Lower dilution is rewarded — companies buying back shares score higher.",
      },
    ],
    longFormula:
      "score = 0.35 * dist_yield + 0.25 * net_earnings_yield + 0.15 * revenue_yield + 0.15 * earnings_quality + 0.10 * emissions_rate",
    regimeBear: "10%",
    regimeBull: "5%",
    constraints: [
      { label: "Max Long Holdings", value: "10", accent: "#DDB110" },
      { label: "Max Long Weight", value: "25%", accent: "#DDB110" },
      { label: "Max Short Positions", value: "5", accent: "#F87171" },
      { label: "Max Short Weight", value: "25%", accent: "#F87171" },
      { label: "Bear Short Alloc", value: "10%", accent: "#F87171" },
      { label: "Bull Short Alloc", value: "5%", accent: "#10B981" },
    ],
  },
  all: {
    title: "Dual-Scored Long/Short Strategy",
    longTerms: [
      {
        label: "Distributions Yield",
        weight: 25,
        color: "#10B981",
        tooltip:
          "Expected 1-year distributions yield. The strongest single return predictor in factor research.",
      },
      {
        label: "Net Earnings Yield",
        weight: 20,
        color: "#3B82F6",
        tooltip:
          "Expected 1-year net earnings yield after emissions. Captures real profitability.",
      },
      {
        label: "Price vs 50d High",
        weight: 15,
        color: "#F59E0B",
        tooltip:
          "Current price relative to 50-day high. Rewards assets trading near recent highs — momentum confirmation.",
      },
      {
        label: "MACD Histogram",
        weight: 12,
        color: "#F59E0B",
        tooltip:
          "MACD histogram as percentage of price. Positive MACD indicates bullish momentum.",
      },
      {
        label: "Earnings Quality",
        weight: 10,
        color: "#8B5CF6",
        tooltip:
          "Earnings-to-distributions ratio. Higher values signal capital efficiency.",
      },
      {
        label: "Mean Reversion",
        weight: 10,
        color: "#06B6D4",
        tooltip:
          "Time-series z-score of market cap / fees. Detects assets cheap relative to own history.",
      },
      {
        label: "30d Momentum",
        weight: 8,
        color: "#F59E0B",
        tooltip:
          "30-day rate of change in price. Captures short-term trend continuation.",
      },
    ],
    longFormula:
      "long_score = 0.25 * dist_yield + 0.20 * net_earnings_yield + 0.15 * price_vs_high_50d + 0.12 * macd_hist + 0.10 * earnings_quality + 0.10 * mean_reversion + 0.08 * roc_30d",
    shortTerms: [
      {
        label: "Emissions Rate",
        weight: 30,
        color: "#EF4444",
        tooltip:
          "Expected 1-year token emissions. High emissions dilute holders and create sell pressure — the strongest short signal.",
      },
      {
        label: "OBV Trend (20d)",
        weight: 25,
        color: "#F97316",
        tooltip:
          "On-Balance Volume trend. Rising OBV without price follow-through signals distribution.",
      },
      {
        label: "30d Rate of Change",
        weight: 20,
        color: "#F97316",
        tooltip:
          "30-day price momentum. Overextended assets are ripe for pullbacks.",
      },
      {
        label: "RSI (14-day)",
        weight: 15,
        color: "#F97316",
        tooltip:
          "Relative Strength Index. High RSI indicates overbought conditions.",
      },
      {
        label: "Price vs 50d High",
        weight: 10,
        color: "#F97316",
        tooltip:
          "Assets near recent highs with deteriorating internals are good short candidates.",
      },
    ],
    shortFormula:
      "short_score = 0.30 * emissions_rate + 0.25 * obv_trend_20d + 0.20 * roc_30d + 0.15 * rsi_14 + 0.10 * price_vs_high_50d",
    regimeBear: "80%",
    regimeBull: "20%",
    constraints: [
      { label: "Max Long Holdings", value: "10", accent: "#DDB110" },
      { label: "Max Long Weight", value: "25%", accent: "#DDB110" },
      { label: "Max Short Positions", value: "5", accent: "#F87171" },
      { label: "Max Short Weight", value: "25%", accent: "#F87171" },
      { label: "Bear Short Alloc", value: "80%", accent: "#F87171" },
      { label: "Bull Short Alloc", value: "20%", accent: "#10B981" },
    ],
  },
};

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
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{label}</span>
          <InfoTooltip content={tooltip} />
        </div>
        <span className="text-sm font-bold" style={{ color }}>
          {weight}%
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${weight}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}



export default function StrategyTab({
  universe,
  regimeScore,
  shortAllocationPct,
}: StrategyTabProps) {
  const rs = regimeScore ? parseFloat(regimeScore) : null;
  const saPct = shortAllocationPct ? parseFloat(shortAllocationPct) * 100 : null;

  const config = STRATEGY_CONFIGS[universe];

  return (
    <div className="space-y-10">
      {/* Strategy Title */}
      <div>
        <h3 className="text-2xl font-bold">{config.title}</h3>
      </div>

      {/* Long Score Formula */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-accent-cyan" />
          <h3 className="text-xl font-semibold">
            {config.shortTerms ? "Long Score Formula" : "Score Formula"}
          </h3>
        </div>
        <div className="space-y-4 mb-5">
          {config.longTerms.map((t) => (
            <ScoreBar
              key={t.label}
              label={t.label}
              weight={t.weight}
              color={t.color}
              tooltip={t.tooltip}
            />
          ))}
        </div>
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
          <p className="text-xs font-mono text-text-secondary">
            {config.longFormula}
          </p>
        </div>
      </div>

      {/* Short Score Formula (only for universes with independent short scoring) */}
      {config.shortTerms && (
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="text-xl font-semibold">Short Score Formula</h3>
          </div>
          <div className="space-y-4 mb-5">
            {config.shortTerms.map((t) => (
              <ScoreBar
                key={t.label}
                label={t.label}
                weight={t.weight}
                color={t.color}
                tooltip={t.tooltip}
              />
            ))}
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <p className="text-xs font-mono text-text-secondary">
              {config.shortFormula}
            </p>
          </div>
        </div>
      )}

      {/* Smoothed Regime Filter */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-semibold">
            Smoothed BTC Regime Filter
          </h3>
        </div>

        {/* Regime visualization */}
        <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5 mb-6">
          <div className="flex items-center justify-between text-xs text-text-muted mb-3">
            <span>BTC/SMA Ratio</span>
            <span>Short Allocation</span>
          </div>
          <div className="space-y-2.5">
            {[
              { ratio: "0.90 or below", label: "Bearish", short: config.regimeBear, color: "#EF4444", width: 100 },
              { ratio: "1.00 (at SMA)", label: "Neutral", short: "", color: "#F59E0B", width: 50 },
              { ratio: "1.10 or above", label: "Bullish", short: config.regimeBull, color: "#10B981", width: 0 },
            ].map((row) => (
              <div key={row.ratio} className="flex items-center gap-3">
                <span className="text-xs font-mono w-28 shrink-0 text-text-secondary">{row.ratio}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 w-[52px] text-center"
                  style={{ backgroundColor: `${row.color}20`, color: row.color }}
                >
                  {row.label}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${20 + row.width * 0.6}%`, backgroundColor: row.color }}
                  />
                </div>
                <span className="text-xs font-bold font-mono w-10 text-right" style={{ color: row.color }}>
                  {row.short}
                </span>
              </div>
            ))}
          </div>
        </div>

        {rs !== null && (
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Regime Score</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: regimeColor(rs) }}
                />
                <span className="text-lg font-bold font-mono">
                  {rs.toFixed(2)}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${regimeColor(rs)}20`,
                    color: regimeColor(rs),
                  }}
                >
                  {regimeLabel(rs)}
                </span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 text-center">
            <BarChart3 className="w-5 h-5 text-accent-cyan mx-auto mb-2" />
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
              BTC/SMA Ratio
            </p>
            <p className="text-sm text-text-secondary">140-day window</p>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-text-muted" />
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 text-center">
            <Layers className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
              Short Allocation
            </p>
            <p className="text-sm text-text-secondary">{config.regimeBull} &ndash; {config.regimeBear}</p>
          </div>
        </div>
      </div>

      {/* Position Sizing & Constraints */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Position Sizing & Constraints
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {config.constraints.map((c) => (
            <div
              key={c.label}
              className="glass rounded-2xl p-5 text-center"
            >
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
                {c.label}
              </p>
              <p
                className="text-2xl font-bold font-mono"
                style={{ color: c.accent }}
              >
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
