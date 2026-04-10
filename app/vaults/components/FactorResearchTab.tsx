"use client";

import { useEffect, useState, useMemo, type CSSProperties } from "react";
import { API_BASE_URL } from "./types";

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
// Strength label for cross-horizon view
// ---------------------------------------------------------------------------

function strengthLabel(r: CrossHorizonRow): { label: string; color: string } {
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
  const isPos = posCount > ics.length / 2;
  const arrow = isPos ? " \u2191" : " \u2193";

  if (absIc >= 0.05 && maxT >= 2.0 && r.sign_consistent) {
    return { label: `Strong${arrow}`, color: isPos ? "#10B981" : "#EF4444" };
  }
  if (absIc >= 0.035 && maxT >= 1.5) {
    return { label: `Mod.${arrow}`, color: isPos ? "#34D399" : "#F87171" };
  }
  if (absIc >= 0.02 && maxT >= 1.0) {
    return { label: `Weak${arrow}`, color: "#F59E0B" };
  }
  return { label: "Noise", color: "var(--text-muted)" };
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

export default function FactorResearchTab() {
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
        const res = await fetch(`${API_BASE_URL}/vault/factor-research`);
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
  }, []);

  const filteredCrossHorizon = useMemo(() => {
    const q = search.toLowerCase();
    return crossHorizon
      .filter(
        (r) =>
          !q ||
          r.metric.toLowerCase().includes(q) ||
          humanizeMetric(r.metric).toLowerCase().includes(q),
      )
      .sort((a, b) => (b.mean_abs_ic ?? 0) - (a.mean_abs_ic ?? 0));
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
                  const sig = strengthLabel(r);
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
                          className="text-xs font-semibold"
                          style={{ color: sig.color }}
                        >
                          {sig.label}
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

      {/* Legend */}
      <div className="glass rounded-xl p-4 text-xs text-text-muted space-y-1">
        <p>
          <strong className="text-text-secondary">Cell color</strong> ={" "}
          <span style={{ color: "#6ee7b7" }}>Green</span> = direct correlation
          (higher metric predicts higher return),{" "}
          <span style={{ color: "#fca5a5" }}>Red</span> = inverse. Brighter =
          stronger. Gray = noise. Hover metric name for raw field name.
        </p>
        <p>
          <strong className="text-text-secondary">Signal</strong> ={" "}
          <span style={{ color: "#10B981" }}>Strong &uarr;&darr;</span>{" "}
          requires |IC| &ge; 0.05 &amp; |t| &ge; 2.0 with consistent sign;{" "}
          <span style={{ color: "#34D399" }}>Mod.</span> requires |IC| &ge;
          0.035 &amp; |t| &ge; 1.5;{" "}
          <span style={{ color: "#F59E0B" }}>Weak</span> is marginal;{" "}
          <span style={{ color: "var(--text-muted)" }}>Noise</span> is below
          threshold.
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
    </div>
  );
}
