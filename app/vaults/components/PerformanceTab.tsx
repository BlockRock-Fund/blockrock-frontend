"use client";

import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL, type BacktestData, type BacktestDaily } from "./types";

const TOOLTIP_STYLE = {
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "var(--text-primary)",
};

function fmtPct(v: number): string {
  return `${v >= 0 ? "+" : ""}${v}%`;
}

type Timeframe = "30D" | "90D" | "6M" | "1Y" | "2Y" | "4Y";
const TIMEFRAME_DAYS: Record<Timeframe, number> = {
  "30D": 30,
  "90D": 90,
  "6M": 182,
  "1Y": 365,
  "2Y": 730,
  "4Y": 1461,
};
const TIMEFRAMES: Timeframe[] = ["30D", "90D", "6M", "1Y", "2Y", "4Y"];

function MetricCard({
  label,
  value,
  suffix,
  positive,
}: {
  label: string;
  value: string;
  suffix?: string;
  positive?: boolean;
}) {
  return (
    <div className="glass rounded-2xl p-5 text-center">
      <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
        {label}
      </p>
      <p
        className="text-2xl font-bold font-mono"
        style={{
          color:
            positive === undefined
              ? "var(--text-primary)"
              : positive
              ? "#10B981"
              : "#EF4444",
        }}
      >
        {value}
        {suffix && (
          <span className="text-sm font-normal text-text-muted">{suffix}</span>
        )}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 text-center animate-pulse">
      <div className="h-3 bg-white/10 rounded w-16 mx-auto mb-3" />
      <div className="h-7 bg-white/10 rounded w-20 mx-auto" />
    </div>
  );
}

function SkeletonChart({ height = 350 }: { height?: number }) {
  return (
    <div
      className="glass rounded-2xl p-6 animate-pulse"
      style={{ height: height + 80 }}
    >
      <div className="h-5 bg-white/10 rounded w-48 mb-2" />
      <div className="h-3 bg-white/10 rounded w-72 mb-4" />
      <div
        className="bg-white/5 rounded-xl"
        style={{ height }}
      />
    </div>
  );
}

function formatDateLabel(dateStr: unknown, multiYear?: boolean): string {
  const d = new Date(String(dateStr) + "T00:00:00");
  if (multiYear) {
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const year = d.getFullYear().toString().slice(2);
    return `${month} '${year}`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NavTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ dataKey: string; name: string; value: number; color: string; payload?: any }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload as BacktestDaily | undefined;
  const holdings = row?.holdings;
  const longs = holdings?.filter((h) => h.side === "long") ?? [];
  const shorts = holdings?.filter((h) => h.side === "short") ?? [];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "12px 14px",
        minWidth: 220,
        maxWidth: 320,
      }}
    >
      <p style={{ color: "var(--text-secondary)", fontSize: 11, marginBottom: 8 }}>
        {formatDateLabel(label)}
      </p>

      {/* NAV values */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: holdings ? 10 : 0 }}>
        {payload.map((entry) => (
          <div key={entry.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
            <span style={{ color: entry.color, fontSize: 12 }}>{entry.name}</span>
            <span style={{ color: "var(--text-primary)", fontSize: 12, fontFamily: "var(--font-geist-mono), monospace" }}>
              {entry.value?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Holdings breakdown */}
      {holdings && holdings.length > 0 && (
        <>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }} />

          {longs.length > 0 && (
            <div style={{ marginBottom: shorts.length > 0 ? 6 : 0 }}>
              <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>
                Longs ({longs.length})
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 6px" }}>
                {longs.map((h) => (
                  <span key={h.symbol} style={{ fontSize: 11, color: "#10B981", fontFamily: "var(--font-geist-mono), monospace" }}>
                    {h.symbol} {(h.weight * 100).toFixed(1)}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {shorts.length > 0 && (
            <div>
              <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>
                Shorts ({shorts.length})
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 6px" }}>
                {shorts.map((h) => (
                  <span key={h.symbol} style={{ fontSize: 11, color: "#EF4444", fontFamily: "var(--font-geist-mono), monospace" }}>
                    {h.symbol} {(h.weight * 100).toFixed(1)}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PerformanceTab() {
  const [data, setData] = useState<BacktestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("4Y");

  useEffect(() => {
    async function fetchBacktest() {
      try {
        const res = await fetch(`${API_BASE_URL}/vault/backtest`);
        if (res.status === 503) {
          setError("Backtest data not yet available. Please try again later.");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load backtest");
      } finally {
        setLoading(false);
      }
    }
    fetchBacktest();
  }, []);

  const filteredDaily = useMemo(() => {
    if (!data) return [];
    const days = TIMEFRAME_DAYS[timeframe];
    const len = data.daily.length;
    const sliceStart = Math.max(0, len - days);
    return data.daily.slice(sliceStart);
  }, [data, timeframe]);

  const isMultiYear = timeframe === "2Y" || timeframe === "4Y";
  const tickFormatter = useMemo(
    () => (dateStr: unknown) => formatDateLabel(dateStr, isMultiYear),
    [isMultiYear],
  );
  const minTickGap = isMultiYear ? 60 : 40;

  const hasBtc = useMemo(() => {
    if (!data) return false;
    return data.daily.some((d) => d.btc_nav !== null);
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonChart height={350} />
        <SkeletonChart height={250} />
      </div>
    );
  }

  if (error || !data || !data.summary) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-text-muted text-lg mb-2">Unable to load backtest data</p>
        <p className="text-text-muted text-sm">{error || "No data returned"}</p>
      </div>
    );
  }

  const m = data.summary;

  return (
    <div className="space-y-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Total Return"
          value={m.total_return != null ? fmtPct(m.total_return) : "\u2014"}
          positive={m.total_return != null ? m.total_return >= 0 : undefined}
        />
        <MetricCard label="Sharpe" value={m.sharpe?.toFixed(2) ?? "\u2014"} positive={m.sharpe != null ? m.sharpe > 0 : undefined} />
        <MetricCard
          label="Max Drawdown"
          value={m.max_drawdown != null ? `${m.max_drawdown}%` : "\u2014"}
          positive={m.max_drawdown != null ? false : undefined}
        />
        <MetricCard
          label="Win Rate"
          value={m.win_rate != null ? `${m.win_rate}%` : "\u2014"}
          positive={m.win_rate != null ? m.win_rate >= 50 : undefined}
        />
        <MetricCard
          label="Alpha"
          value={m.alpha != null ? fmtPct(m.alpha) : "\u2014"}
          positive={m.alpha != null ? m.alpha >= 0 : undefined}
        />
        <MetricCard
          label="Sortino"
          value={m.sortino?.toFixed(2) ?? "\u2014"}
          positive={m.sortino != null ? m.sortino > 0 : undefined}
        />
      </div>

      {/* Warnings Banner */}
      {m.warnings && m.warnings.length > 0 && (
        <div
          className="rounded-xl px-5 py-3 text-sm"
          style={{
            background: "rgba(221, 177, 16, 0.08)",
            border: "1px solid rgba(221, 177, 16, 0.25)",
            color: "rgba(221, 177, 16, 0.9)",
          }}
        >
          <p className="font-medium mb-1">Backtest Notes</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs opacity-90">
            {m.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* NAV Chart */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold">Simulated NAV</h3>
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: timeframe === tf ? "rgba(221, 177, 16, 0.2)" : "rgba(255,255,255,0.05)",
                  color: timeframe === tf ? "#DDB110" : "var(--text-secondary)",
                  border: timeframe === tf ? "1px solid rgba(221, 177, 16, 0.3)" : "1px solid transparent",
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-text-muted mb-4">
          Vault (gold) vs Equal-Weight (white) vs SOL (blue){hasBtc ? " vs BTC (orange)" : ""} — base 100
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={filteredDaily}>
            <defs>
              <linearGradient id="navGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DDB110" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#DDB110" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
              minTickGap={minTickGap}
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              domain={["auto", "auto"]}
              width={50}
            />
            <RechartsTooltip content={<NavTooltip />} />
            <Area
              type="monotone"
              dataKey="vault_nav"
              name="Vault"
              stroke="#DDB110"
              strokeWidth={2}
              fill="url(#navGold)"
            />
            <Area
              type="monotone"
              dataKey="eq_weight_nav"
              name="EW Benchmark"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="sol_nav"
              name="SOL"
              stroke="#60A5FA"
              strokeWidth={1}
              strokeDasharray="2 2"
              fill="transparent"
            />
            {hasBtc && (
              <Area
                type="monotone"
                dataKey="btc_nav"
                name="BTC"
                stroke="#F7931A"
                strokeWidth={1}
                strokeDasharray="2 2"
                fill="transparent"
                connectNulls
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Drawdown Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-1">Drawdown from Peak</h3>
        <p className="text-xs text-text-muted mb-4">
          Vault max drawdown {m.max_drawdown ?? "\u2014"}% vs EW {m.eq_weight_max_drawdown ?? "\u2014"}% vs SOL {m.sol_max_drawdown ?? "\u2014"}%
          {m.btc_max_drawdown != null ? ` vs BTC ${m.btc_max_drawdown}%` : ""}
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={filteredDaily}>
            <defs>
              <linearGradient id="ddRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="transparent" stopOpacity={0} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="ddGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="transparent" stopOpacity={0} />
                <stop offset="100%" stopColor="#DDB110" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
              minTickGap={minTickGap}
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
              domain={["auto", "auto"]}
              width={50}
            />
            <RechartsTooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(label) => formatDateLabel(label)}
              formatter={(value) => [`${Number(value).toFixed(1)}%`]}
            />
            <Area
              type="monotone"
              dataKey="eq_weight_dd"
              name="EW Benchmark"
              stroke="#EF4444"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="url(#ddRed)"
            />
            <Area
              type="monotone"
              dataKey="vault_dd"
              name="Vault"
              stroke="#DDB110"
              strokeWidth={2}
              fill="url(#ddGold)"
            />
            <Area
              type="monotone"
              dataKey="sol_dd"
              name="SOL"
              stroke="#60A5FA"
              strokeWidth={1}
              strokeDasharray="2 2"
              fill="transparent"
            />
            {hasBtc && (
              <Area
                type="monotone"
                dataKey="btc_dd"
                name="BTC"
                stroke="#F7931A"
                strokeWidth={1}
                strokeDasharray="2 2"
                fill="transparent"
                connectNulls
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Returns Table */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Returns</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary">
                <th className="text-left py-3 px-3 font-medium">Month</th>
                <th className="text-right py-3 px-3 font-medium">Vault</th>
                <th className="text-right py-3 px-3 font-medium">EW Bench</th>
                <th className="text-right py-3 px-3 font-medium">SOL</th>
                {hasBtc && <th className="text-right py-3 px-3 font-medium">BTC</th>}
                <th className="text-right py-3 px-3 font-medium">Alpha</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly_returns.map((row) => {
                const v = row.vault ?? 0;
                const ew = row.eqWeight ?? 0;
                const sol = row.sol ?? 0;
                const btc = row.btc ?? 0;
                const alpha = v - ew;
                return (
                  <tr
                    key={row.month}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2.5 px-3 text-text-secondary text-xs">
                      {row.month}
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-mono text-sm"
                      style={{
                        color: v >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {v >= 0 ? "+" : ""}
                      {v.toFixed(1)}%
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-mono text-sm"
                      style={{
                        color: ew >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {ew >= 0 ? "+" : ""}
                      {ew.toFixed(1)}%
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-mono text-sm"
                      style={{
                        color: sol >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {sol >= 0 ? "+" : ""}
                      {sol.toFixed(1)}%
                    </td>
                    {hasBtc && (
                      <td
                        className="py-2.5 px-3 text-right font-mono text-sm"
                        style={{
                          color: btc >= 0 ? "#10B981" : "#EF4444",
                        }}
                      >
                        {btc >= 0 ? "+" : ""}
                        {btc.toFixed(1)}%
                      </td>
                    )}
                    <td
                      className="py-2.5 px-3 text-right font-mono text-sm font-bold"
                      style={{
                        color: alpha >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {alpha >= 0 ? "+" : ""}
                      {alpha.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Risk Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted mb-3">
              Return Metrics
            </p>
            <div className="space-y-3">
              {([
                ["Total Return", m.total_return != null ? fmtPct(m.total_return) : "\u2014"],
                ["EW Benchmark", m.eq_weight_return != null ? fmtPct(m.eq_weight_return) : "\u2014"],
                ["SOL Return", m.sol_return != null ? fmtPct(m.sol_return) : "\u2014"],
                ["BTC Return", m.btc_return != null ? fmtPct(m.btc_return) : "N/A"],
                ["Alpha", m.alpha != null ? fmtPct(m.alpha) : "\u2014"],
                ["Win Rate", m.win_rate != null ? `${m.win_rate}%` : "\u2014"],
              ] as const).map(([label, val]) => (
                <div
                  key={label}
                  className="flex justify-between py-1.5 border-b border-white/5"
                >
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="text-sm font-mono font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted mb-3">
              Risk Metrics
            </p>
            <div className="space-y-3">
              {([
                ["Volatility", m.volatility != null ? `${m.volatility}%` : "\u2014"],
                ["Beta", m.beta?.toFixed(2) ?? "\u2014"],
                ["Sharpe Ratio", m.sharpe?.toFixed(2) ?? "\u2014"],
                ["Sortino Ratio", m.sortino?.toFixed(2) ?? "\u2014"],
                ["Calmar Ratio", m.calmar?.toFixed(2) ?? "\u2014"],
                ["Information Ratio", m.information_ratio?.toFixed(2) ?? "\u2014"],
                ["Max Drawdown", m.max_drawdown != null ? `${m.max_drawdown}%` : "\u2014"],
              ] as const).map(([label, val]) => (
                <div
                  key={label}
                  className="flex justify-between py-1.5 border-b border-white/5"
                >
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="text-sm font-mono font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center py-4">
        <p className="text-xs text-text-muted italic">
          Simulated results using historical on-chain data ({m.backtest_start} to {m.backtest_end}, {m.num_assets} assets).
          {m.measurement_start && (
            <> Measurement period begins {m.measurement_start} (prior data used for warm-up).</>
          )}
          {" "}Past performance does not guarantee future results. Not financial advice.
        </p>
      </div>
    </div>
  );
}
