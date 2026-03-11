"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

type TargetWeight = {
  asset_id: number;
  symbol: string;
  mint_address: string;
  composite_score: string;
  target_weight: string;
  net_distributions_yield_expected_1y: string | null;
  net_revenue_yield_expected_1y: string | null;
  growth_trend: string | null;
};

type VaultHolding = {
  mint_address: string;
  asset_id: number | null;
  symbol: string | null;
  token_balance: string | null;
  value_usd: string | null;
  weight: string | null;
};

type VaultStatus = {
  vault_address: string | null;
  total_value_usd: string | null;
  num_holdings: number;
  holdings: VaultHolding[];
  last_rebalance_at: string | null;
};

type AllocationRecord = {
  id: number;
  computed_at: string;
  total_vault_value_usd: string | null;
  allocations: Array<{
    symbol: string;
    target_weight: string;
    composite_score: string;
  }>;
  status: string;
};

const CHART_COLORS = [
  "#DDB110",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
];

function pct(val: string | null | undefined): string {
  if (!val) return "—";
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `${(n * 100).toFixed(2)}%`;
}

function usd(val: string | null | undefined): string {
  if (!val) return "—";
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function VaultPage() {
  const [weights, setWeights] = useState<TargetWeight[]>([]);
  const [status, setStatus] = useState<VaultStatus | null>(null);
  const [allocations, setAllocations] = useState<AllocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [weightsRes, statusRes, allocsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/vault/target-weights`),
        fetch(`${API_BASE_URL}/vault/status`),
        fetch(`${API_BASE_URL}/vault/allocations?limit=10`),
      ]);

      if (!weightsRes.ok) throw new Error("Failed to load target weights");
      const weightsData = await weightsRes.json();
      setWeights(weightsData.weights || []);

      if (statusRes.ok) {
        setStatus(await statusRes.json());
      }

      if (allocsRes.ok) {
        const allocData = await allocsRes.json();
        setAllocations(allocData.allocations || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load vault data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pieData = useMemo(
    () =>
      weights.map((w) => ({
        name: w.symbol,
        value: parseFloat(w.target_weight) * 100,
      })),
    [weights]
  );

  const barData = useMemo(() => {
    return weights.map((w) => {
      const holding = status?.holdings.find(
        (h) => h.mint_address === w.mint_address
      );
      return {
        symbol: w.symbol,
        target: parseFloat(w.target_weight) * 100,
        current: holding?.weight ? parseFloat(holding.weight) * 100 : 0,
      };
    });
  }, [weights, status]);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>
          <div className="flex-1" />
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-white/10 hover:border-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-2">Build-a-Bear Vault</h1>
        <p className="text-text-secondary mb-8">
          Fundamental-weighted DeFi token allocation powered by yield metrics
          and growth trends.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-bg-secondary p-5">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
              Total AUM
            </p>
            <p className="text-2xl font-bold">
              {status?.total_value_usd
                ? usd(status.total_value_usd)
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-bg-secondary p-5">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
              Holdings
            </p>
            <p className="text-2xl font-bold">{status?.num_holdings ?? 0}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-bg-secondary p-5">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
              Last Rebalance
            </p>
            <p className="text-2xl font-bold">
              {status?.last_rebalance_at
                ? new Date(status.last_rebalance_at).toLocaleDateString()
                : "Never"}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        {weights.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart */}
            <div className="rounded-xl border border-white/10 bg-bg-secondary p-5">
              <h2 className="text-lg font-semibold mb-4">
                Target Allocation
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, value }) =>
                      `${name} ${value.toFixed(1)}%`
                    }
                    labelLine={true}
                  >
                    {pieData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={CHART_COLORS[idx % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                    }}
                    formatter={(value) => [`${Number(value).toFixed(2)}%`, "Weight"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart — Target vs Current */}
            <div className="rounded-xl border border-white/10 bg-bg-secondary p-5">
              <h2 className="text-lg font-semibold mb-4">
                Target vs Current
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="symbol"
                    tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                    }}
                    formatter={(value) => [`${Number(value).toFixed(2)}%`]}
                  />
                  <Legend />
                  <Bar dataKey="target" name="Target" fill="#DDB110" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="current" name="Current" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Token Ranking Table */}
        <div className="rounded-xl border border-white/10 bg-bg-secondary p-5 mb-8">
          <h2 className="text-lg font-semibold mb-4">Token Rankings</h2>
          {loading ? (
            <div className="text-center py-12 text-text-secondary">
              Loading...
            </div>
          ) : weights.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              No eligible tokens with mint addresses found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-text-secondary">
                    <th className="text-left py-3 px-3 font-medium">#</th>
                    <th className="text-left py-3 px-3 font-medium">Symbol</th>
                    <th className="text-right py-3 px-3 font-medium">
                      Net Dist. Yield
                    </th>
                    <th className="text-right py-3 px-3 font-medium">
                      Net Rev. Yield
                    </th>
                    <th className="text-right py-3 px-3 font-medium">
                      Growth Trend
                    </th>
                    <th className="text-right py-3 px-3 font-medium">
                      Composite Score
                    </th>
                    <th className="text-right py-3 px-3 font-medium">
                      Target Weight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weights.map((w, i) => (
                    <tr
                      key={w.asset_id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-3 text-text-secondary">
                        {i + 1}
                      </td>
                      <td className="py-3 px-3 font-medium">{w.symbol}</td>
                      <td className="py-3 px-3 text-right">
                        {pct(w.net_distributions_yield_expected_1y)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {pct(w.net_revenue_yield_expected_1y)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {pct(w.growth_trend)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {parseFloat(w.composite_score).toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold" style={{ color: "#DDB110" }}>
                        {pct(w.target_weight)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Allocation History */}
        {allocations.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-bg-secondary p-5">
            <h2 className="text-lg font-semibold mb-4">
              Allocation History
            </h2>
            <div className="space-y-3">
              {allocations.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(a.computed_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {a.allocations.length} tokens &middot;{" "}
                      {a.allocations
                        .slice(0, 5)
                        .map((al) => al.symbol)
                        .join(", ")}
                      {a.allocations.length > 5 && "..."}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      a.status === "executed"
                        ? "bg-green-500/10 text-green-400"
                        : a.status === "dry_run"
                        ? "bg-blue-500/10 text-blue-400"
                        : a.status === "failed"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
