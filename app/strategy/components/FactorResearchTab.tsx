"use client";

import { useEffect, useState, useMemo, type CSSProperties } from "react";
import { API_BASE_URL, type Universe } from "./types";

type FactorRow = {
  metric: string;
  period: number;
  mean_ic: number | null;
  t_stat: number | null;
  hit_rate: number | null;
  n_dates: number | null;
  long_mean_ret: number | null;
  short_mean_ret: number | null;
  ls_spread: number | null;
  long_hit_rate: number | null;
  short_hit_rate: number | null;
};

type CrossHorizonRow = {
  metric: string;
  ic_7d: number | null;
  t_7d: number | null;
  ic_30d: number | null;
  t_30d: number | null;
  ic_90d: number | null;
  t_90d: number | null;
  sign_consistent: boolean | null;
  consistency: number | null;
  mean_abs_ic: number | null;
};

type ViewMode = "cross_horizon" | "single_7d" | "single_30d" | "single_90d";

// ---------------------------------------------------------------------------
// Metric name humanizer
// ---------------------------------------------------------------------------

const METRIC_EXACT: Record<string, string> = {
  mc: "Market Cap",
  price: "Price",
  fdv: "FDV",
  circ_supply: "Circulating Supply",
  max_supply: "Max Supply",
  total_supply: "Total Supply",
  mr_mc_fees: "Mean Reversion: MC/Fees",
  treasury_value: "Treasury Value",
  treasury_assets: "Treasury Assets",
  treasury_debt: "Treasury Debt",
};

const TECHNICAL_EXACT: Record<string, string> = {
  price_vs_sma20: "Price vs SMA-20",
  price_vs_sma50: "Price vs SMA-50",
  price_vs_sma200: "Price vs SMA-200",
  sma50_vs_sma200: "SMA-50 vs SMA-200",
  price_vs_high_20d: "Price vs 20d High",
  price_vs_high_50d: "Price vs 50d High",
  price_vs_low_20d: "Price vs 20d Low",
  price_vs_low_50d: "Price vs 50d Low",
  volume_ratio_20d: "Volume Ratio (20d)",
  obv_trend_20d: "OBV Trend (20d)",
  rsi_14: "RSI-14",
  macd_hist_pct: "MACD Histogram %",
  roc_14d: "Rate of Change (14d)",
  roc_30d: "Rate of Change (30d)",
  vol_price_divergence: "Vol/Price Divergence",
};

function titleCase(word: string): string {
  if (word.length === 0) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function humanizeBase(base: string): string {
  return base
    .split("_")
    .map(titleCase)
    .join(" ");
}

function humanizeMetric(raw: string): string {
  // Strip V: prefix
  let s = raw;
  if (s.startsWith("V:")) s = s.slice(2);

  // Strip TI: prefix and use technical lookup
  if (s.startsWith("TI:")) {
    const key = s.slice(3);
    return TECHNICAL_EXACT[key] ?? humanizeBase(key);
  }

  // Exact match
  if (METRIC_EXACT[s]) return METRIC_EXACT[s];

  // Extract net_ prefix
  let prefix = "";
  if (s.startsWith("net_")) {
    prefix = "Net ";
    s = s.slice(4);
  }

  // Exact match after net_ strip
  if (METRIC_EXACT[s]) return prefix + METRIC_EXACT[s];

  // Pattern: *_yield_chg_Xd or *_yield_chg_365d
  let m = s.match(/^(.+?)_yield_chg_(\d+d|\d+)$/);
  if (m) return `${prefix}${humanizeBase(m[1])} Yield \u0394 (${m[2]})`;

  // Pattern: *_yield_expected_1y
  m = s.match(/^(.+?)_yield_expected_1y$/);
  if (m) return `${prefix}${humanizeBase(m[1])} Yield (Exp. 1y)`;

  // Pattern: *_Xd_o_Xd or *_1y_o_1y (momentum)
  m = s.match(/^(.+?)_(\d+d|1y)_o_\2$/);
  if (m) return `${prefix}${humanizeBase(m[1])} Momentum (${m[2]})`;

  // Pattern: *_rate_expected_1y
  m = s.match(/^(.+?)_rate_expected_1y$/);
  if (m) return `${prefix}${humanizeBase(m[1])} Rate (Exp. 1y)`;

  // Pattern: *_expected_1y
  m = s.match(/^(.+?)_expected_1y$/);
  if (m) return `${prefix}${humanizeBase(m[1])} (Exp. 1y)`;

  // Pattern: *_Xd_ann (annualized)
  m = s.match(/^(.+?)_(\d+d)_ann$/);
  if (m) return `${prefix}${humanizeBase(m[1])} (${m[2]}, Ann.)`;

  // Pattern: *_pct (percentage ratio)
  m = s.match(/^(.+?)_(.+?)_pct$/);
  if (m) return `${prefix}${humanizeBase(m[1])}/${humanizeBase(m[2])} %`;

  // Pattern: *_Xd or *_1y (raw level)
  m = s.match(/^(.+?)_(\d+d|1y)$/);
  if (m) return `${prefix}${humanizeBase(m[1])} (${m[2]})`;

  // Fallback: just title-case with underscores → spaces
  return prefix + humanizeBase(s);
}

// ---------------------------------------------------------------------------
// Heatmap cell style
// ---------------------------------------------------------------------------

function icCellStyle(ic: number | null): CSSProperties {
  if (ic === null) return { color: "var(--text-muted)" };
  const abs = Math.abs(ic);

  if (abs < 0.02) {
    return { color: "var(--text-muted)", backgroundColor: "transparent" };
  }

  const intensity = Math.min(1, (abs - 0.02) / 0.06);
  const alpha = 0.12 + intensity * 0.32;

  const bg = ic > 0
    ? `rgba(16, 185, 129, ${alpha.toFixed(2)})`
    : `rgba(239, 68, 68, ${alpha.toFixed(2)})`;

  const textColor = abs >= 0.04
    ? (ic > 0 ? "#6ee7b7" : "#fca5a5")
    : (ic > 0 ? "#a7f3d0" : "#fecaca");

  return { backgroundColor: bg, color: textColor, borderRadius: "4px" };
}

// ---------------------------------------------------------------------------
// Signal strength score for cross-horizon view
// ---------------------------------------------------------------------------

function signalScore(r: CrossHorizonRow): {
  score: number;
  display: string;
  color: string;
  bg: string;
} {
  const absIc = r.mean_abs_ic ?? 0;
  const maxT = Math.max(
    Math.abs(r.t_7d ?? 0),
    Math.abs(r.t_30d ?? 0),
    Math.abs(r.t_90d ?? 0),
  );

  const ics = [r.ic_7d, r.ic_30d, r.ic_90d].filter(
    (v): v is number => v !== null,
  );
  const posCount = ics.filter((v) => v > 0).length;
  const isPos = ics.length > 0 ? posCount > ics.length / 2 : true;
  const consistencyMult = r.sign_consistent ? 1.0 : 0.75;

  // Aggregate magnitude: |IC| \u00d7 |t| \u00d7 consistency, scaled \u00d7100.
  // Reference: |IC|=0.05 & |t|=2.0 (consistent) \u2192 10.0 (formerly "Strong").
  // |IC|=0.035 & |t|=1.5 \u2192 ~5.3 (formerly "Mod."). |IC|=0.02 & |t|=1.0 \u2192 ~2.0 (formerly "Weak").
  const raw = absIc * maxT * consistencyMult * 100;
  const score = Number.isFinite(raw) ? raw : 0;

  const arrow = ics.length === 0 ? "" : isPos ? " \u2191" : " \u2193";
  const display = score < 0.1 ? "0.0" : `${score.toFixed(1)}${arrow}`;

  // Color/intensity by score tier and direction.
  let color = "var(--text-muted)";
  let bg = "transparent";
  if (score >= 10) {
    color = isPos ? "#10B981" : "#EF4444";
    const a = Math.min(0.55, 0.25 + (score - 10) / 60);
    bg = isPos
      ? `rgba(16, 185, 129, ${a.toFixed(2)})`
      : `rgba(239, 68, 68, ${a.toFixed(2)})`;
  } else if (score >= 5) {
    color = isPos ? "#34D399" : "#F87171";
    bg = isPos ? "rgba(16, 185, 129, 0.18)" : "rgba(239, 68, 68, 0.18)";
  } else if (score >= 2) {
    color = "#F59E0B";
    bg = "rgba(245, 158, 11, 0.14)";
  }

  return { score, display, color, bg };
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function tStatBadge(t: number | null): string {
  if (t === null) return "";
  const abs = Math.abs(t);
  if (abs >= 2.0) return "font-bold";
  if (abs >= 1.5) return "font-medium";
  return "opacity-60";
}

function fmtIc(v: number | null): string {
  if (v === null) return "\u2014";
  return (v >= 0 ? "+" : "") + v.toFixed(4);
}

function fmtT(v: number | null): string {
  if (v === null) return "\u2014";
  return (v >= 0 ? "+" : "") + v.toFixed(2);
}

function fmtPct(v: number | null): string {
  if (v === null) return "\u2014";
  return `${(v * 100).toFixed(0)}%`;
}

function fmtRet(v: number | null): string {
  if (v === null) return "\u2014";
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

function retColor(v: number | null): string {
  if (v === null) return "var(--text-muted)";
  return v >= 0 ? "#10B981" : "#EF4444";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FactorResearchTab({ universe = "all" }: { universe?: Universe }) {
  const [singleFactors, setSingleFactors] = useState<FactorRow[]>([]);
  const [crossHorizon, setCrossHorizon] = useState<CrossHorizonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("cross_horizon");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setSingleFactors([]);
        setCrossHorizon([]);
        setError(null);
        const params = universe !== "all" ? `?universe=${universe}` : "";
        const res = await fetch(`${API_BASE_URL}/vault/factor-research${params}`);
        if (!res.ok) throw new Error("Failed to load factor research data");
        const data = await res.json();
        setSingleFactors(data.single_factors || []);
        setCrossHorizon(data.cross_horizon || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [universe]);

  const filteredCrossHorizon = useMemo(() => {
    const q = search.toLowerCase();
    return crossHorizon
      .filter(
        (r) =>
          !q ||
          r.metric.toLowerCase().includes(q) ||
          humanizeMetric(r.metric).toLowerCase().includes(q),
      )
      .sort((a, b) => signalScore(b).score - signalScore(a).score);
  }, [crossHorizon, search]);

  const filteredSingle = useMemo(() => {
    const period =
      view === "single_7d" ? 7 : view === "single_30d" ? 30 : 90;
    const q = search.toLowerCase();
    return singleFactors
      .filter((r) => r.period === period)
      .filter(
        (r) =>
          !q ||
          r.metric.toLowerCase().includes(q) ||
          humanizeMetric(r.metric).toLowerCase().includes(q),
      )
      .sort((a, b) => Math.abs(b.mean_ic ?? 0) - Math.abs(a.mean_ic ?? 0));
  }, [singleFactors, view, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-text-muted">
        Loading factor research data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold mb-1">Factor Research</h2>
        <p className="text-text-secondary text-sm">
          How strongly each metric correlates with forward-looking price
          returns. Green = direct correlation (higher metric → higher return),
          red = inverse. Brighter = stronger signal.
        </p>
      </div>

      {/* View toggle + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(
            [
              ["cross_horizon", "Cross-Horizon"],
              ["single_7d", "7-Day"],
              ["single_30d", "30-Day"],
              ["single_90d", "90-Day"],
            ] as [ViewMode, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === id
                  ? "bg-accent-cyan/20 text-accent-cyan"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Filter metrics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-md bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 sm:ml-auto sm:w-64"
        />
      </div>

      {/* Legend (positioned above the table so readers see it before scrolling) */}
      <div className="glass rounded-xl p-4 text-xs text-text-muted space-y-1">
        <p>
          <strong className="text-text-secondary">Cell color</strong> ={" "}
          <span style={{ color: "#6ee7b7" }}>Green</span> = direct correlation
          (higher metric predicts higher return),{" "}
          <span style={{ color: "#fca5a5" }}>Red</span> = inverse. Brighter =
          stronger. Gray = noise. Hover metric name for raw field name.
        </p>
        <p>
          <strong className="text-text-secondary">Signal</strong> = aggregated
          magnitude: mean |IC| &times; max |t| &times; sign-consistency, scaled
          &times;100. Higher = stronger predictive signal across horizons. Arrow
          shows direction (&uarr; direct, &darr; inverse). Tiers:{" "}
          <span style={{ color: "#10B981" }}>&ge; 10 strong</span>,{" "}
          <span style={{ color: "#34D399" }}>&ge; 5 moderate</span>,{" "}
          <span style={{ color: "#F59E0B" }}>&ge; 2 weak</span>,{" "}
          <span style={{ color: "var(--text-muted)" }}>&lt; 2 noise</span>.
          Sign-inconsistent signals are penalized 25%.
        </p>
        <p>
          <strong className="text-text-secondary">IC</strong> = Information
          Coefficient (Spearman rank correlation). &uarr; means higher metric
          &rarr; higher return.
        </p>
        <p>
          <strong className="text-text-secondary">t-stat</strong> = Statistical
          significance. |t| &ge; 2.0 is strong, |t| &ge; 1.5 is moderate.
        </p>
        <p>
          <strong className="text-text-secondary">L/S Spread</strong> = Mean
          return of top tercile minus bottom tercile.
        </p>
      </div>

      {/* Cross-Horizon Table */}
      {view === "cross_horizon" && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    Metric
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    7d IC
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    7d t
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    30d IC
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    30d t
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    90d IC
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    90d t
                  </th>
                  <th className="text-center px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium whitespace-nowrap">
                    Signal
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCrossHorizon.map((r, i) => {
                  const sig = signalScore(r);
                  return (
                    <tr
                      key={r.metric}
                      className={`border-b border-white/5 ${
                        i % 2 === 0 ? "bg-white/[0.02]" : ""
                      } hover:bg-white/[0.04] transition-colors`}
                    >
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className="text-sm font-medium text-text-primary cursor-default"
                          title={r.metric}
                        >
                          {humanizeMetric(r.metric)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span
                          className="inline-block px-1.5 py-0.5 font-mono text-xs"
                          style={icCellStyle(r.ic_7d)}
                        >
                          {fmtIc(r.ic_7d)}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_7d)}`}
                      >
                        {fmtT(r.t_7d)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span
                          className="inline-block px-1.5 py-0.5 font-mono text-xs"
                          style={icCellStyle(r.ic_30d)}
                        >
                          {fmtIc(r.ic_30d)}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_30d)}`}
                      >
                        {fmtT(r.t_30d)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span
                          className="inline-block px-1.5 py-0.5 font-mono text-xs"
                          style={icCellStyle(r.ic_90d)}
                        >
                          {fmtIc(r.ic_90d)}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_90d)}`}
                      >
                        {fmtT(r.t_90d)}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span
                          className="inline-block px-2 py-0.5 rounded font-mono text-xs font-semibold tabular-nums"
                          style={{ color: sig.color, backgroundColor: sig.bg }}
                          title={`|IC|×|t|×consistency × 100 = ${sig.score.toFixed(2)}`}
                        >
                          {sig.display}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredCrossHorizon.length === 0 && (
            <div className="py-8 text-center text-text-muted text-sm">
              No matching metrics
            </div>
          )}
        </div>
      )}

      {/* Single-Period Table */}
      {view.startsWith("single_") && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-text-muted font-medium w-8">
                    #
                  </th>
                  <th className="text-left px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    Metric
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    Mean IC
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    t-stat
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    Hit Rate
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    Long Ret
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    Short Ret
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    L/S Spread
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    N
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSingle.map((r, i) => (
                  <tr
                    key={r.metric}
                    className={`border-b border-white/5 ${
                      i % 2 === 0 ? "bg-white/[0.02]" : ""
                    } hover:bg-white/[0.04] transition-colors`}
                  >
                    <td className="px-4 py-2.5 text-text-muted text-xs">
                      {i + 1}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span
                        className="text-sm font-medium text-text-primary cursor-default"
                        title={r.metric}
                      >
                        {humanizeMetric(r.metric)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span
                        className="inline-block px-1.5 py-0.5 font-mono text-xs font-bold"
                        style={icCellStyle(r.mean_ic)}
                      >
                        {fmtIc(r.mean_ic)}
                      </span>
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_stat)}`}
                    >
                      {fmtT(r.t_stat)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">
                      {fmtPct(r.hit_rate)}
                    </td>
                    <td
                      className="px-3 py-2.5 text-right font-mono text-xs"
                      style={{ color: retColor(r.long_mean_ret) }}
                    >
                      {fmtRet(r.long_mean_ret)}
                    </td>
                    <td
                      className="px-3 py-2.5 text-right font-mono text-xs"
                      style={{ color: retColor(r.short_mean_ret) }}
                    >
                      {fmtRet(r.short_mean_ret)}
                    </td>
                    <td
                      className="px-3 py-2.5 text-right font-mono text-xs font-bold"
                      style={{
                        color:
                          r.ls_spread !== null
                            ? r.ls_spread > 0
                              ? "#10B981"
                              : "#EF4444"
                            : "var(--text-muted)",
                      }}
                    >
                      {fmtRet(r.ls_spread)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-text-muted">
                      {r.n_dates ?? "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSingle.length === 0 && (
            <div className="py-8 text-center text-text-muted text-sm">
              No matching metrics
            </div>
          )}
        </div>
      )}

    </div>
  );
}
