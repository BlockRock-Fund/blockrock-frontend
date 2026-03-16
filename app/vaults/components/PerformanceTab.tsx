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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

const TOOLTIP_STYLE = {
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "var(--text-primary)",
};

function fmtPct(v: number): string {
  return `${v >= 0 ? "+" : ""}${v}%`;
}

type Timeframe = "7D" | "30D" | "90D" | "180D" | "1Y";
const TIMEFRAME_DAYS: Record<Timeframe, number> = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "180D": 180,
  "1Y": 365,
};
const TIMEFRAMES: Timeframe[] = ["7D", "30D", "90D", "180D", "1Y"];

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

function formatDateLabel(dateStr: unknown): string {
  const d = new Date(String(dateStr) + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface BacktestData {
  nav_history: { date: string; vault: number; eqWeight: number; sol: number; btc: number | null }[];
  drawdown: { date: string; vault: number; eqWeight: number; sol: number; btc: number | null }[];
  monthly_returns: { month: string; vault: number; eqWeight: number; benchmark: number }[];
  risk_metrics: {
    totalReturn: number;
    benchmarkReturn: number;
    solReturn: number;
    btcReturn: number | null;
    alpha: number;
    sharpe: number;
    sortino: number;
    calmar: number;
    maxDrawdown: number;
    eqWeightMaxDrawdown: number;
    solMaxDrawdown: number;
    btcMaxDrawdown: number | null;
    beta: number;
    informationRatio: number;
    winRate: number;
    volatility: number;
  };
  benchmark_symbol: string;
  backtest_start: string;
  backtest_end: string;
  measurement_start: string | null;
  num_assets: number;
  warnings: string[];
}

export default function PerformanceTab() {
  const [data, setData] = useState<BacktestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1Y");

  useEffect(() => {
    async function fetchBacktest() {
      try {
        const res = await fetch(`${API_BASE_URL}/vault/backtest`);
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

  const filteredData = useMemo(() => {
    if (!data) return { nav: [], dd: [] };
    const days = TIMEFRAME_DAYS[timeframe];
    const navLen = data.nav_history.length;
    const sliceStart = Math.max(0, navLen - days);
    return {
      nav: data.nav_history.slice(sliceStart),
      dd: data.drawdown.slice(sliceStart),
    };
  }, [data, timeframe]);

  const hasBtc = useMemo(() => {
    if (!data) return false;
    return data.nav_history.some((d) => d.btc !== null);
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

  if (error || !data || !data.risk_metrics) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-text-muted text-lg mb-2">Unable to load backtest data</p>
        <p className="text-text-muted text-sm">{error || "No data returned"}</p>
      </div>
    );
  }

  const m = data.risk_metrics;

  return (
    <div className="space-y-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Total Return"
          value={fmtPct(m.totalReturn)}
          positive={m.totalReturn >= 0}
        />
        <MetricCard label="Sharpe" value={m.sharpe.toFixed(2)} positive={m.sharpe > 0} />
        <MetricCard
          label="Max Drawdown"
          value={`${m.maxDrawdown}%`}
          positive={false}
        />
        <MetricCard
          label="Win Rate"
          value={`${m.winRate}%`}
          positive={m.winRate >= 50}
        />
        <MetricCard
          label="Alpha"
          value={fmtPct(m.alpha)}
          positive={m.alpha >= 0}
        />
        <MetricCard
          label="Sortino"
          value={m.sortino.toFixed(2)}
          positive={m.sortino > 0}
        />
      </div>

      {/* Warnings Banner */}
      {data.warnings && data.warnings.length > 0 && (
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
            {data.warnings.map((w, i) => (
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
          <AreaChart data={filteredData.nav}>
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
              tickFormatter={formatDateLabel}
              minTickGap={40}
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              domain={["auto", "auto"]}
              width={50}
            />
            <RechartsTooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={formatDateLabel}
            />
            <Area
              type="monotone"
              dataKey="vault"
              name="Vault"
              stroke="#DDB110"
              strokeWidth={2}
              fill="url(#navGold)"
            />
            <Area
              type="monotone"
              dataKey="eqWeight"
              name="EW Benchmark"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="sol"
              name="SOL"
              stroke="#60A5FA"
              strokeWidth={1}
              strokeDasharray="2 2"
              fill="transparent"
            />
            {hasBtc && (
              <Area
                type="monotone"
                dataKey="btc"
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
          Vault max drawdown {m.maxDrawdown}% vs EW {m.eqWeightMaxDrawdown}% vs SOL {m.solMaxDrawdown}%
          {m.btcMaxDrawdown != null ? ` vs BTC ${m.btcMaxDrawdown}%` : ""}
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={filteredData.dd}>
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
              tickFormatter={formatDateLabel}
              minTickGap={40}
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
              labelFormatter={formatDateLabel}
              formatter={(value) => [`${Number(value).toFixed(1)}%`]}
            />
            <Area
              type="monotone"
              dataKey="eqWeight"
              name="EW Benchmark"
              stroke="#EF4444"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="url(#ddRed)"
            />
            <Area
              type="monotone"
              dataKey="vault"
              name="Vault"
              stroke="#DDB110"
              strokeWidth={2}
              fill="url(#ddGold)"
            />
            <Area
              type="monotone"
              dataKey="sol"
              name="SOL"
              stroke="#60A5FA"
              strokeWidth={1}
              strokeDasharray="2 2"
              fill="transparent"
            />
            {hasBtc && (
              <Area
                type="monotone"
                dataKey="btc"
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
                <th className="text-right py-3 px-3 font-medium">Alpha</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly_returns.map((row) => {
                const alpha = row.vault - row.eqWeight;
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
                        color: row.vault >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {row.vault >= 0 ? "+" : ""}
                      {row.vault.toFixed(1)}%
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-mono text-sm"
                      style={{
                        color: row.eqWeight >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {row.eqWeight >= 0 ? "+" : ""}
                      {row.eqWeight.toFixed(1)}%
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-mono text-sm"
                      style={{
                        color: row.benchmark >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {row.benchmark >= 0 ? "+" : ""}
                      {row.benchmark.toFixed(1)}%
                    </td>
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
                ["Total Return", fmtPct(m.totalReturn)],
                ["EW Benchmark", fmtPct(m.benchmarkReturn)],
                ["SOL Return", fmtPct(m.solReturn)],
                ["BTC Return", m.btcReturn != null ? fmtPct(m.btcReturn) : "N/A"],
                ["Alpha", fmtPct(m.alpha)],
                ["Win Rate", `${m.winRate}%`],
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
                ["Volatility", `${m.volatility}%`],
                ["Beta", m.beta.toFixed(2)],
                ["Sharpe Ratio", m.sharpe.toFixed(2)],
                ["Sortino Ratio", m.sortino.toFixed(2)],
                ["Calmar Ratio", m.calmar.toFixed(2)],
                ["Information Ratio", m.informationRatio.toFixed(2)],
                ["Max Drawdown", `${m.maxDrawdown}%`],
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
          Simulated results using historical on-chain data ({data.backtest_start} to {data.backtest_end}, {data.num_assets} assets).
          {data.measurement_start && (
            <> Measurement period begins {data.measurement_start} (prior data used for warm-up).</>
          )}
          {" "}Past performance does not guarantee future results. Not financial advice.
        </p>
      </div>
    </div>
  );
}
