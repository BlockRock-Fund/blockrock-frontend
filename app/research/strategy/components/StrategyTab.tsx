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
import { regimeColor, regimeLabel } from "./types";

interface StrategyTabProps {
  regimeScore: string | null;
  shortAllocationPct: string | null;
  confluenceMultiplier?: string | null;
  confluenceStressed?: number | null;
  confluenceTotal?: number | null;
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
  regimeScore,
  shortAllocationPct,
  confluenceMultiplier,
  confluenceStressed,
  confluenceTotal,
}: StrategyTabProps) {
  const rs = regimeScore ? parseFloat(regimeScore) : null;
  const saPct = shortAllocationPct ? parseFloat(shortAllocationPct) * 100 : null;

  return (
    <div className="space-y-10">
      {/* Strategy Thesis Hero */}
      <div className="gradient-border rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-2">
          Dual-Scored Long/Short DeFi Strategy
        </h3>
        <p className="text-text-muted text-sm mb-6">
          Independent scoring formulas for longs and shorts, with smoothed
          regime-driven allocation via BTC trend
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm uppercase tracking-wider text-accent-cyan font-semibold mb-3">
              The Edge
            </h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex gap-2">
                <Zap className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <span>
                  <strong>Long the best fundamentals</strong> — 7-factor blend
                  of distribution yield, earnings yield, technical momentum,
                  mean reversion, and earnings quality
                </span>
              </li>
              <li className="flex gap-2">
                <Shield className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Independent short scoring</strong> — shorts are NOT
                  just inverted longs. A separate 5-factor formula targets
                  high-emission tokens showing technical reversal signals
                </span>
              </li>
              <li className="flex gap-2">
                <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Smoothed regime filter</strong> — BTC&apos;s distance from
                  its 140-day SMA continuously interpolates the short allocation
                  between 20% (bull) and 80% (bear), eliminating binary whipsaw
                </span>
              </li>
              <li className="flex gap-2">
                <Database className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Mean reversion</strong> — time-series z-score on
                  market cap / fees ratio detects cheap assets relative to their
                  own history
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-accent-cyan font-semibold mb-3">
              How It Works
            </h4>
            <div className="space-y-3">
              {[
                {
                  step: 1,
                  label: "Data Ingestion",
                  desc: "CoinGecko, DeFiLlama, FRED, on-chain price/volume",
                },
                {
                  step: 2,
                  label: "Dual Scoring",
                  desc: "Long formula (yields + momentum) + Short formula (technicals + emissions)",
                },
                {
                  step: 3,
                  label: "Regime Filter",
                  desc: "Smoothed BTC/SMA ratio with 80/20 bear/bull allocation",
                },
                {
                  step: 4,
                  label: "Portfolio Construction",
                  desc: "Independent long/short selection with position caps",
                },
              ].map((s, i) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-text-muted">{s.desc}</p>
                  </div>
                  {i < 3 && (
                    <ArrowRight className="w-3 h-3 text-text-muted shrink-0 mt-1.5 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Long Score Formula */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-accent-cyan" />
          <h3 className="text-xl font-semibold">Long Score Formula</h3>
        </div>
        <div className="space-y-4 mb-5">
          <ScoreBar
            label="Distributions Yield"
            weight={25}
            color="#10B981"
            tooltip="Expected 1-year distributions yield. Measures projected cash/token flows to holders relative to market cap — the strongest single return predictor in factor research."
          />
          <ScoreBar
            label="Net Earnings Yield"
            weight={20}
            color="#3B82F6"
            tooltip="Expected 1-year net earnings yield after emissions. Protocol earnings minus dilution cost relative to market cap — captures real profitability."
          />
          <ScoreBar
            label="Price vs 50d High"
            weight={15}
            color="#F59E0B"
            tooltip="Current price relative to 50-day high. Rewards assets trading near recent highs — momentum confirmation signal."
          />
          <ScoreBar
            label="MACD Histogram"
            weight={12}
            color="#F59E0B"
            tooltip="MACD histogram as percentage of price. Positive MACD indicates bullish momentum with accelerating trend strength."
          />
          <ScoreBar
            label="Earnings Quality"
            weight={10}
            color="#8B5CF6"
            tooltip="Earnings-to-distributions ratio. Higher values indicate protocols that distribute a larger share of earnings — signals capital efficiency."
          />
          <ScoreBar
            label="Mean Reversion"
            weight={10}
            color="#06B6D4"
            tooltip="Time-series z-score of market cap / annualized fees. Detects assets that are cheap relative to their own historical valuation."
          />
          <ScoreBar
            label="30d Momentum"
            weight={8}
            color="#F59E0B"
            tooltip="30-day rate of change in price. Captures short-term momentum — trending assets tend to continue trending."
          />
        </div>
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-5">
          <p className="text-xs font-mono text-text-secondary mb-2">
            long_score = 0.25 * dist_yield + 0.20 * net_earnings_yield + 0.15
            * price_vs_high_50d + 0.12 * macd_hist + 0.10 * earnings_quality
            + 0.10 * mean_reversion + 0.08 * roc_30d
          </p>
          <p className="text-xs text-text-muted">
            Penalty term:{" "}
            <span className="text-red-400 font-medium">
              -0.10 * distribution decline (180d)
            </span>
            {" "}— assets with falling distributions are penalized.
          </p>
        </div>
      </div>

      {/* Short Score Formula */}
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
          identifying assets likely to underperform. High short scores mean
          strong short candidates.
        </p>
        <div className="space-y-4 mb-5">
          <ScoreBar
            label="Emissions Rate"
            weight={30}
            color="#EF4444"
            tooltip="Expected 1-year token emissions as percentage of supply. High emissions dilute existing holders and create persistent sell pressure — the strongest short signal."
          />
          <ScoreBar
            label="OBV Trend (20d)"
            weight={25}
            color="#F97316"
            tooltip="On-Balance Volume 20-day trend. Rising OBV without price follow-through signals distribution — smart money selling into retail buying."
          />
          <ScoreBar
            label="30d Rate of Change"
            weight={20}
            color="#F97316"
            tooltip="30-day price momentum. High recent momentum often precedes mean reversion — overextended assets are ripe for pullbacks."
          />
          <ScoreBar
            label="RSI (14-day)"
            weight={15}
            color="#F97316"
            tooltip="Relative Strength Index. High RSI indicates overbought conditions — statistically more likely to revert downward."
          />
          <ScoreBar
            label="Price vs 50d High"
            weight={10}
            color="#F97316"
            tooltip="Current price relative to 50-day high. Assets near recent highs with deteriorating internals are good short candidates."
          />
        </div>
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
          <p className="text-xs font-mono text-text-secondary mb-2">
            short_score = 0.30 * emissions_rate + 0.25 * obv_trend_20d + 0.20
            * roc_30d + 0.15 * rsi_14 + 0.10 * price_vs_high_50d
          </p>
          <p className="text-xs text-text-muted">
            Combines{" "}
            <span className="text-red-400 font-medium">
              fundamental dilution
            </span>{" "}
            (emissions) with{" "}
            <span className="text-orange-400 font-medium">
              technical reversal
            </span>{" "}
            signals (OBV, RSI, momentum) — targeting overvalued tokens with
            high supply inflation.
          </p>
        </div>
      </div>

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
              { ratio: "0.90 or below", label: "Bearish", short: "80%", color: "#EF4444", width: 100 },
              { ratio: "0.95", label: "", short: "60%", color: "#F97316", width: 75 },
              { ratio: "1.00 (at SMA)", label: "Neutral", short: "50%", color: "#F59E0B", width: 50 },
              { ratio: "1.05", label: "", short: "40%", color: "#84CC16", width: 25 },
              { ratio: "1.10 or above", label: "Bullish", short: "20%", color: "#10B981", width: 0 },
            ].map((row) => (
              <div key={row.ratio} className="flex items-center gap-3">
                <span className="text-xs font-mono w-28 shrink-0 text-text-secondary">{row.ratio}</span>
                {row.label && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                    style={{ backgroundColor: `${row.color}20`, color: row.color }}
                  >
                    {row.label}
                  </span>
                )}
                {!row.label && <span className="w-[52px] shrink-0" />}
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
            <p className="text-sm text-text-secondary">20% &ndash; 80%</p>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-4">
          Linear interpolation: BTC at 90% of SMA &rarr; 80% shorts (full
          bear), at SMA &rarr; 50% shorts (neutral), at 110% of SMA &rarr; 20%
          shorts (full bull). Smooth transitions reduce turnover vs. binary
          regime flips.
        </p>
      </div>

      {/* Position Sizing & Constraints */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Position Sizing & Constraints
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Max Long Holdings",
              value: "10",
              accent: "#DDB110",
            },
            {
              label: "Max Long Weight",
              value: "25%",
              accent: "#DDB110",
            },
            {
              label: "Max Short Positions",
              value: "5",
              accent: "#F87171",
            },
            {
              label: "Max Short Weight",
              value: "25%",
              accent: "#F87171",
            },
            {
              label: "Max Short Allocation",
              value: "80%",
              accent: "#F87171",
            },
            {
              label: "Min Short Alloc",
              value: "20%",
              accent: "#F87171",
            },
          ].map((c) => (
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
            {
              title: "Independent Short Scoring",
              desc: "Shorts selected by their own technical + emissions formula, not just inverted long scores — better hedge targeting",
            },
            {
              title: "Concentration Limits",
              desc: "25% max per long, 25% max per short — bounds concentration risk on both sides",
            },
            {
              title: "Smoothed Regime Transitions",
              desc: "Linear interpolation eliminates binary whipsaw — allocation shifts gradually as BTC trend evolves",
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
