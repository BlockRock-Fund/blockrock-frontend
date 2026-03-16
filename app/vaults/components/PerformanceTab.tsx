"use client";

import { useEffect, useState } from "react";
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

interface BacktestData {
  nav_history: { month: string; vault: number; eqWeight: number; benchmark: number }[];
  drawdown: { month: string; vault: number; eqWeight: number; benchmark: number }[];
  monthly_returns: { month: string; vault: number; eqWeight: number; benchmark: number }[];
  risk_metrics: {
    totalReturn: number;
    benchmarkReturn: number;
    solReturn: number;
    alpha: number;
    sharpe: number;
    sortino: number;
    calmar: number;
    maxDrawdown: number;
    eqWeightMaxDrawdown: number;
    solMaxDrawdown: number;
    beta: number;
    informationRatio: number;
    winRate: number;
    volatility: number;
  };
  benchmark_symbol: string;
  backtest_start: string;
  backtest_end: string;
  num_assets: number;
  warnings: string[];
}

export default function PerformanceTab() {
  const [data, setData] = useState<BacktestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const bmSymbol = data.benchmark_symbol || "SOL";

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

      {/* NAV Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-1">Simulated NAV</h3>
        <p className="text-xs text-text-muted mb-4">
          Vault (gold) vs Equal-Weight Benchmark (white dashed) vs {bmSymbol} (blue dotted) — base 100
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data.nav_history}>
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
              dataKey="month"
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              domain={["auto", "auto"]}
              width={50}
            />
            <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
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
              dataKey="benchmark"
              name={bmSymbol}
              stroke="#60A5FA"
              strokeWidth={1}
              strokeDasharray="2 2"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Drawdown Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-1">Drawdown from Peak</h3>
        <p className="text-xs text-text-muted mb-4">
          Vault max drawdown {m.maxDrawdown}% vs EW benchmark {m.eqWeightMaxDrawdown}% vs {bmSymbol} {m.solMaxDrawdown}%
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data.drawdown}>
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
              dataKey="month"
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
              dataKey="benchmark"
              name={bmSymbol}
              stroke="#60A5FA"
              strokeWidth={1}
              strokeDasharray="2 2"
              fill="transparent"
            />
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
                <th className="text-right py-3 px-3 font-medium">{bmSymbol}</th>
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
              {[
                ["Total Return", fmtPct(m.totalReturn)],
                ["EW Benchmark", fmtPct(m.benchmarkReturn)],
                [`${bmSymbol} Return`, fmtPct(m.solReturn)],
                ["Alpha", fmtPct(m.alpha)],
                ["Win Rate", `${m.winRate}%`],
              ].map(([label, val]) => (
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
              {[
                ["Volatility", `${m.volatility}%`],
                ["Beta", m.beta.toFixed(2)],
                ["Sharpe Ratio", m.sharpe.toFixed(2)],
                ["Sortino Ratio", m.sortino.toFixed(2)],
                ["Calmar Ratio", m.calmar.toFixed(2)],
                ["Information Ratio", m.informationRatio.toFixed(2)],
                ["Max Drawdown", `${m.maxDrawdown}%`],
              ].map(([label, val]) => (
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
          Past performance does not guarantee future results. Not financial advice.
        </p>
      </div>
    </div>
  );
}
