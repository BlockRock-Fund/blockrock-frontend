"use client";

import {
  Shield,
  Zap,
  Database,
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
  subtitle: string;
  edge: { icon: "zap" | "shield" | "activity" | "database"; text: string }[];
  longTerms: ScoreTermDef[];
  longFormula: string;
  penaltyNote?: string;
  shortTerms?: ScoreTermDef[];
  shortFormula?: string;
  shortNote?: string;
  regimeBear: string;
  regimeBull: string;
  constraints: { label: string; value: string; accent: string }[];
};

const STRATEGY_CONFIGS: Record<Universe, StrategyConfig> = {
  token: {
    title: "Pure Fundamental Token Strategy",
    subtitle:
      "Four-factor scoring optimized for Sortino (2.08). Factor research shows distribution yields and earnings quality dominate token returns at every horizon — no technical overlay needed.",
    edge: [
      {
        icon: "zap",
        text: "**Distribution yield** (35%) — the single strongest return predictor for tokens. Protocols distributing cash/tokens to holders consistently outperform.",
      },
      {
        icon: "database",
        text: "**Earnings yield** (30%) — net protocol earnings after emissions. Captures real profitability vs. vanity revenue metrics.",
      },
      {
        icon: "activity",
        text: "**Distribution momentum** (15%) — 30-day period-over-period growth in distributions. Rising payouts signal improving fundamentals.",
      },
      {
        icon: "shield",
        text: "**Earnings quality** (20%) — share of earnings actually distributed. High payout ratios signal capital-efficient protocols.",
      },
    ],
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
    subtitle:
      "Five-factor yield-heavy scoring optimized for Sortino (1.37). Factor research shows yield metrics dominate equity returns at every horizon. Minimal short allocation (10%/5%) — the small equity universe makes aggressive shorting destructive.",
    edge: [
      {
        icon: "zap",
        text: "**Distribution yield** (35%) — the dominant equity factor at 90d (IC 0.25). Dividend-paying stocks with high yields consistently outperform.",
      },
      {
        icon: "database",
        text: "**Multi-yield blend** — earnings yield (25%), revenue yield (15%). Factor research confirms all three yield metrics are cross-horizon consistent for equities.",
      },
      {
        icon: "shield",
        text: "**Near-zero short allocation** — with only 3-8 stocks, shorting destroys performance. 10% bear / 5% bull keeps the structure while minimizing damage.",
      },
      {
        icon: "activity",
        text: "**Emissions rate** (10%) — stock dilution via share issuance. Statistically significant short signal even in the small universe.",
      },
    ],
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
    subtitle:
      "Seven-factor long formula with independent five-factor short scoring, optimized for Sortino (1.09 over 4yr). Blends fundamental yields with technical momentum and mean-reversion valuation across the full token + equity universe.",
    edge: [
      {
        icon: "zap",
        text: "**Long the best fundamentals** — 7-factor blend of distribution yield, earnings yield, technical momentum, mean reversion, and earnings quality.",
      },
      {
        icon: "shield",
        text: "**Independent short scoring** — shorts are NOT just inverted longs. A separate 5-factor formula targets high-emission tokens showing technical reversal signals.",
      },
      {
        icon: "activity",
        text: "**Smoothed regime filter** — BTC's distance from its 140-day SMA continuously interpolates the short allocation between 20% (bull) and 80% (bear).",
      },
      {
        icon: "database",
        text: "**Mean reversion** — time-series z-score on market cap / fees ratio detects cheap assets relative to their own history.",
      },
    ],
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
    penaltyNote:
      "-0.10 * distribution decline (180d) — assets with falling distributions are penalized.",
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
    shortNote:
      "Combines fundamental dilution (emissions) with technical reversal signals (OBV, RSI, momentum).",
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
  confluenceMultiplier,
  confluenceStressed,
  confluenceTotal,
}: StrategyTabProps) {
  const rs = regimeScore ? parseFloat(regimeScore) : null;
  const saPct = shortAllocationPct ? parseFloat(shortAllocationPct) * 100 : null;

  const config = STRATEGY_CONFIGS[universe];
  const iconMap = {
    zap: <Zap className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />,
    shield: <Shield className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />,
    activity: <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
    database: <Database className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />,
  };

  return (
    <div className="space-y-10">
      {/* Strategy Thesis Hero */}
      <div className="gradient-border rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-2">{config.title}</h3>
        <p className="text-text-muted text-sm mb-6">{config.subtitle}</p>
        <div>
          <h4 className="text-sm uppercase tracking-wider text-accent-cyan font-semibold mb-3">
            The Edge
          </h4>
          <ul className="space-y-3 text-sm text-text-secondary">
            {config.edge.map((e, i) => (
              <li key={i} className="flex gap-2">
                {iconMap[e.icon]}
                <span
                  dangerouslySetInnerHTML={{
                    __html: e.text
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>"
                      ),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
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
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-5">
          <p className="text-xs font-mono text-text-secondary mb-2">
            {config.longFormula}
          </p>
          {config.penaltyNote && (
            <p className="text-xs text-text-muted">
              Penalty term:{" "}
              <span className="text-red-400 font-medium">
                {config.penaltyNote}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Short Score Formula (only for universes with independent short scoring) */}
      {config.shortTerms && (
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="text-xl font-semibold">Short Score Formula</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">
              Independent
            </span>
          </div>
          <p className="text-sm text-text-muted mb-5">
            Shorts are scored by a completely separate formula optimized for
            identifying assets likely to underperform.
          </p>
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
            <p className="text-xs font-mono text-text-secondary mb-2">
              {config.shortFormula}
            </p>
            {config.shortNote && (
              <p className="text-xs text-text-muted">{config.shortNote}</p>
            )}
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

        <p className="text-sm text-text-muted mb-6">
          The short allocation is continuously adjusted based on BTC&apos;s position
          relative to its 140-day simple moving average. Instead of a binary
          bull/bear flip, the signal is linearly interpolated across a &plusmn;10%
          band — eliminating whipsaw turnover spikes near the crossover.
        </p>

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
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-5">
            <div className="flex items-center justify-between mb-2">
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
              <p className="text-xs text-text-muted">
                Current short allocation:{" "}
                <span className="text-red-400 font-medium">
                  {saPct.toFixed(1)}%
                </span>{" "}
                of portfolio
              </p>
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

      {/* Risk Management */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-green-400" />
          <h3 className="text-xl font-semibold">Risk Management</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ...(config.shortTerms
              ? [
                  {
                    title: "Independent Short Scoring",
                    desc: "Shorts selected by their own technical + emissions formula, not just inverted long scores",
                  },
                ]
              : []),
            {
              title: "Concentration Limits",
              desc: "25% max per long, 25% max per short — bounds concentration risk on both sides",
            },
            {
              title: "Smoothed Regime Transitions",
              desc: `Linear interpolation from ${config.regimeBull} (bull) to ${config.regimeBear} (bear) short allocation — no binary flips`,
            },
            {
              title: "Rebalance Cadence",
              desc: "Weekly cycle with turnover threshold gate — only executes when drift exceeds 5%",
            },
          ].map((r) => (
            <div
              key={r.title}
              className="bg-white/[0.03] rounded-xl p-4 border border-white/5"
            >
              <p className="text-sm font-medium mb-1">{r.title}</p>
              <p className="text-xs text-text-muted">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
