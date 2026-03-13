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
  confluenceMultiplier: string | null;
  confluenceStressed: number | null;
  confluenceTotal: number | null;
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

function RegimeGauge({
  label,
  weight,
  description,
}: {
  label: string;
  weight: number;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-24 shrink-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-text-muted">{weight}% weight</p>
      </div>
      <div className="flex-1">
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <p className="text-xs text-text-muted w-32 shrink-0 text-right">
        {description}
      </p>
    </div>
  );
}

const REGIME_SIGNALS = {
  "Tier 1 — Primary": [
    { id: "VAL_SPREAD", label: "Valuation Spread", weight: 25, description: "Quartile yield divergence" },
    { id: "BAMLH0A0HYM2", label: "HY Spreads", weight: 15, description: "Credit risk premium" },
    { id: "REAL_RATE", label: "Real Rate", weight: 15, description: "DGS10 minus breakeven" },
  ],
  "Tier 2 — TradFi Directional": [
    { id: "NFCI", label: "NFCI", weight: 12, description: "Financial conditions" },
    { id: "T10Y2Y", label: "Yield Curve", weight: 10, description: "10Y-2Y spread" },
  ],
  "Tier 3 — Crypto-Native": [
    { id: "STABLE_MCAP", label: "Stablecoin Mcap", weight: 8, description: "Capital flow indicator" },
    { id: "DEFI_TVL", label: "DeFi TVL", weight: 8, description: "Ecosystem health" },
    { id: "BTC_DEFI_CORR", label: "BTC-DeFi Corr", weight: 7, description: "Beta risk measure" },
  ],
};

function confluenceLabel(stressed: number, total: number): string {
  if (total === 0) return "No data";
  const ratio = stressed / total;
  if (ratio >= 0.6) return "High agreement";
  if (ratio >= 0.3) return "Mixed signals";
  return "Low agreement";
}

function confluenceLabelColor(stressed: number, total: number): string {
  if (total === 0) return "var(--text-muted)";
  const ratio = stressed / total;
  if (ratio >= 0.6) return "#EF4444";
  if (ratio >= 0.3) return "#F59E0B";
  return "#10B981";
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
  const cm = confluenceMultiplier ? parseFloat(confluenceMultiplier) : null;

  return (
    <div className="space-y-10">
      {/* Strategy Thesis Hero */}
      <div className="gradient-border rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-2">
          Long/Short Fundamental DeFi Strategy
        </h3>
        <p className="text-text-muted text-sm mb-6">
          Systematic long/short allocation driven by on-chain fundamentals and
          macro regime scoring
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
                  <strong>Long the best fundamentals</strong> — top composite
                  scores by emissions-adjusted distribution yield, revenue
                  yield, and growth trend
                </span>
              </li>
              <li className="flex gap-2">
                <Shield className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Short the worst via perps</strong> — negative composite
                  scores shorted through perpetual futures for portfolio
                  insurance
                </span>
              </li>
              <li className="flex gap-2">
                <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Macro regime scoring</strong> — dynamically sizes the
                  short sleeve based on aggregate macro and crypto-native stress
                  signals (credit spreads, stablecoin flows, DeFi TVL, BTC correlation)
                </span>
              </li>
              <li className="flex gap-2">
                <Database className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Emissions-adjusted yields</strong> — net metrics strip
                  out inflationary token emissions to reveal real economic yield
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
                  desc: "CoinGecko, DeFiLlama, FRED, Helius, SEC",
                },
                {
                  step: 2,
                  label: "Fundamental Scoring",
                  desc: "50% dist yield + 30% rev yield + 20% growth",
                },
                {
                  step: 3,
                  label: "Regime Analysis",
                  desc: "8-signal hybrid scoring with confluence adjustment",
                },
                {
                  step: 4,
                  label: "Long/Short Allocation",
                  desc: "Position sizing with caps and regime-driven shorts",
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

      {/* Composite Score Formula */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-accent-cyan" />
          <h3 className="text-xl font-semibold">Composite Score Formula</h3>
        </div>
        <div className="space-y-4 mb-5">
          <ScoreBar
            label="Net Distributions Yield"
            weight={50}
            color="#10B981"
            tooltip="Expected 1-year distributions yield after subtracting estimated token emissions dilution. Captures actual cash/token flows to holders."
          />
          <ScoreBar
            label="Net Revenue Yield"
            weight={30}
            color="#3B82F6"
            tooltip="Expected 1-year protocol revenue yield after emissions adjustment. Measures the protocol's ability to generate revenue relative to market cap."
          />
          <ScoreBar
            label="Growth Trend"
            weight={20}
            color="#8B5CF6"
            tooltip="Period-over-period revenue/volume growth momentum. Captures whether the protocol is accelerating or decelerating."
          />
        </div>
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
          <p className="text-xs font-mono text-text-secondary mb-2">
            composite = 0.50 * net_dist_yield + 0.30 * net_rev_yield + 0.20 *
            growth_trend
          </p>
          <p className="text-xs text-text-muted">
            <span className="text-green-400 font-medium">
              Positive scores
            </span>{" "}
            are long candidates ranked by magnitude.{" "}
            <span className="text-red-400 font-medium">Negative scores</span>{" "}
            are short candidates — assets with poor fundamentals that the
            strategy bets against.
          </p>
        </div>
      </div>

      {/* Macro Regime Scoring */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-semibold">
            Dynamic Short Allocation via Macro Regime
          </h3>
        </div>

        <div className="space-y-5 mb-6">
          {Object.entries(REGIME_SIGNALS).map(([tier, signals]) => (
            <div key={tier}>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
                {tier}
              </p>
              <div className="space-y-2">
                {signals.map((s) => (
                  <RegimeGauge
                    key={s.id}
                    label={s.label}
                    weight={s.weight}
                    description={s.description}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Confluence indicator */}
        {confluenceStressed !== null && confluenceTotal !== null && confluenceTotal > 0 && (
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Signal Confluence</span>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: confluenceLabelColor(confluenceStressed, confluenceTotal) }}
                >
                  {confluenceStressed}/{confluenceTotal} stressed
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${confluenceLabelColor(confluenceStressed, confluenceTotal)}20`,
                    color: confluenceLabelColor(confluenceStressed, confluenceTotal),
                  }}
                >
                  {confluenceLabel(confluenceStressed, confluenceTotal)}
                </span>
              </div>
            </div>
            {cm !== null && (
              <p className="text-xs text-text-muted">
                Confluence multiplier:{" "}
                <span className="font-mono font-medium text-text-secondary">
                  {cm.toFixed(2)}x
                </span>
                {" "}&mdash; {cm < 1 ? "dampens isolated signals" : cm > 1 ? "boosts aligned signals" : "neutral"}
              </p>
            )}
          </div>
        )}

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
              Regime Score
            </p>
            <p className="text-sm text-text-secondary">0.00 - 1.00</p>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-text-muted" />
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 text-center">
            <Layers className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
              Short Allocation
            </p>
            <p className="text-sm text-text-secondary">10% - 50%</p>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-4">
          Hybrid scoring: weighted average of 8 signals across 3 tiers, adjusted
          by confluence multiplier (0.70x&ndash;1.30x). Linear interpolation:
          regime score 0 &rarr; 10% shorts, regime score 1 &rarr; 50% shorts.
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
              value: "50%",
              accent: "#F87171",
            },
            {
              label: "Min Short Alloc",
              value: "10%",
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
              title: "Downside Hedging",
              desc: "Perp shorts on worst-scoring assets provide portfolio insurance during macro stress periods",
            },
            {
              title: "Concentration Limits",
              desc: "25% max per long, 25% max per short — bounds concentration risk on both sides",
            },
            {
              title: "Emissions Sensitivity",
              desc: "Net yields strip token inflation so the strategy avoids chasing unsustainable inflationary yield",
            },
            {
              title: "Rebalance Cadence",
              desc: "24-hour cycle with dry-run gate — manual promotion to live execution for safety",
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

      {/* Infrastructure Stack */}
      <div className="glass rounded-2xl p-5">
        <p className="text-xs uppercase tracking-wider text-text-muted mb-3 text-center">
          Infrastructure Stack
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            "Voltr",
            "Jupiter",
            "Drift",
            "Solana",
            "CoinGecko",
            "DeFiLlama",
            "FRED",
          ].map((name, i, arr) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/5">
                {name}
              </span>
              {i < arr.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
