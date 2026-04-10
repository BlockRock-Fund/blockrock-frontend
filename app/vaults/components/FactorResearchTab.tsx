"use client";

import { useEffect, useState, useMemo } from "react";
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

function icColor(ic: number | null): string {
  if (ic === null) return "var(--text-muted)";
  const abs = Math.abs(ic);
  if (abs >= 0.05) return ic > 0 ? "#10B981" : "#EF4444";
  if (abs >= 0.03) return ic > 0 ? "#34D399" : "#F87171";
  return "var(--text-secondary)";
}

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
      .filter((r) => !q || r.metric.toLowerCase().includes(q))
      .sort((a, b) => (b.consistency ?? 0) - (a.consistency ?? 0));
  }, [crossHorizon, search]);

  const filteredSingle = useMemo(() => {
    const period =
      view === "single_7d" ? 7 : view === "single_30d" ? 30 : 90;
    const q = search.toLowerCase();
    return singleFactors
      .filter((r) => r.period === period)
      .filter((r) => !q || r.metric.toLowerCase().includes(q))
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
          Spearman rank correlation (IC) of each metric with forward-looking
          price returns. Higher |IC| and |t-stat| indicate stronger, more
          reliable predictive signal.
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
                  <th className="text-center px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    Consistent
                  </th>
                  <th className="text-right px-3 py-3 text-xs uppercase tracking-wider text-text-muted font-medium">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCrossHorizon.map((r, i) => (
                  <tr
                    key={r.metric}
                    className={`border-b border-white/5 ${
                      i % 2 === 0 ? "bg-white/[0.02]" : ""
                    } hover:bg-white/[0.04] transition-colors`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs whitespace-nowrap">
                      {r.metric}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_7d)}`}
                      style={{ color: icColor(r.ic_7d) }}
                    >
                      {fmtIc(r.ic_7d)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_7d)}`}
                    >
                      {fmtT(r.t_7d)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_30d)}`}
                      style={{ color: icColor(r.ic_30d) }}
                    >
                      {fmtIc(r.ic_30d)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_30d)}`}
                    >
                      {fmtT(r.t_30d)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_90d)}`}
                      style={{ color: icColor(r.ic_90d) }}
                    >
                      {fmtIc(r.ic_90d)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono text-xs ${tStatBadge(r.t_90d)}`}
                    >
                      {fmtT(r.t_90d)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {r.sign_consistent === null ? (
                        "\u2014"
                      ) : r.sign_consistent ? (
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                      ) : (
                        <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs font-bold">
                      {r.consistency?.toFixed(1) ?? "\u2014"}
                    </td>
                  </tr>
                ))}
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
                    <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap">
                      {r.metric}
                    </td>
                    <td
                      className="px-3 py-2.5 text-right font-mono text-xs font-bold"
                      style={{ color: icColor(r.mean_ic) }}
                    >
                      {fmtIc(r.mean_ic)}
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
                      style={{
                        color:
                          r.long_mean_ret !== null
                            ? r.long_mean_ret >= 0
                              ? "#10B981"
                              : "#EF4444"
                            : "var(--text-muted)",
                      }}
                    >
                      {fmtRet(r.long_mean_ret)}
                    </td>
                    <td
                      className="px-3 py-2.5 text-right font-mono text-xs"
                      style={{
                        color:
                          r.short_mean_ret !== null
                            ? r.short_mean_ret >= 0
                              ? "#10B981"
                              : "#EF4444"
                            : "var(--text-muted)",
                      }}
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
          <strong className="text-text-secondary">IC</strong> = Information
          Coefficient (Spearman rank correlation between metric and forward
          return). Positive IC means higher metric values predict higher returns.
        </p>
        <p>
          <strong className="text-text-secondary">t-stat</strong> = Statistical
          significance. |t| &ge; 2.0 is strong,{" "}
          |t| &ge; 1.5 is moderate.
        </p>
        <p>
          <strong className="text-text-secondary">Hit Rate</strong> = % of
          cross-sections where IC had the same sign as the mean.
        </p>
        <p>
          <strong className="text-text-secondary">L/S Spread</strong> = Mean
          return of top tercile minus bottom tercile (long/short signal
          profitability).
        </p>
        <p>
          <strong className="text-text-secondary">Consistency Score</strong> =
          Mean |IC| / Std across horizons. Higher = more robust across
          timeframes.
        </p>
      </div>
    </div>
  );
}
