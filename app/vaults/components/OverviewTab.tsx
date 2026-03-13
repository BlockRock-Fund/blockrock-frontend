"use client";

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
  ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import {
  TargetWeight,
  VaultStatus,
  CHART_COLORS,
  SHORT_COLORS,
  pct,
  scoreColor,
} from "./types";

interface OverviewTabProps {
  weights: TargetWeight[];
  longs: TargetWeight[];
  shorts: TargetWeight[];
  regimeScore: string | null;
  shortAllocationPct: string | null;
  status: VaultStatus | null;
  loading: boolean;
  onTabChange: (tab: string) => void;
}

const TOOLTIP_STYLE = {
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "var(--text-primary)",
};

export default function OverviewTab({
  weights,
  longs,
  shorts,
  shortAllocationPct,
  status,
  loading,
  onTabChange,
}: OverviewTabProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass rounded-2xl p-6 h-64 animate-pulse bg-white/[0.02]"
          />
        ))}
      </div>
    );
  }

  const longPct = shortAllocationPct
    ? 100 - parseFloat(shortAllocationPct) * 100
    : 100;

  const pieData = [
    ...longs.map((w) => ({
      name: w.symbol,
      value: parseFloat(w.target_weight) * 100,
      side: "long" as const,
    })),
    ...shorts.map((w) => ({
      name: `${w.symbol}`,
      value: parseFloat(w.target_weight) * 100,
      side: "short" as const,
    })),
  ];

  const barData = weights.map((w) => {
    const holding = status?.holdings.find(
      (h) => h.mint_address === w.mint_address
    );
    const targetVal = parseFloat(w.target_weight) * 100;
    const currentVal = holding?.weight ? parseFloat(holding.weight) * 100 : 0;
    return {
      symbol: w.symbol,
      target: w.side === "short" ? -targetVal : targetVal,
      current: w.side === "short" ? -currentVal : currentVal,
      side: w.side,
    };
  });

  return (
    <div className="space-y-10">
      {/* Donut + Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Target Allocation</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={2}
                label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
                labelLine={true}
              >
                {pieData.map((entry, idx) => {
                  if (entry.side === "short") {
                    const shortIdx = pieData
                      .slice(0, idx)
                      .filter((e) => e.side === "short").length;
                    return (
                      <Cell
                        key={idx}
                        fill={SHORT_COLORS[shortIdx % SHORT_COLORS.length]}
                      />
                    );
                  }
                  const longIdx = pieData
                    .slice(0, idx)
                    .filter((e) => e.side !== "short").length;
                  return (
                    <Cell
                      key={idx}
                      fill={CHART_COLORS[longIdx % CHART_COLORS.length]}
                    />
                  );
                })}
              </Pie>
              {/* Center Label */}
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-text-primary text-2xl font-bold"
                style={{ fontSize: "22px", fontWeight: 700 }}
              >
                {longPct.toFixed(0)}%
              </text>
              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-text-secondary"
                style={{ fontSize: "11px" }}
              >
                net long
              </text>
              <RechartsTooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [
                  `${Number(value).toFixed(2)}%`,
                  "Weight",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings Lists */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Holdings</h3>
          <div className="space-y-6">
            {/* Longs */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs uppercase tracking-wider text-text-secondary font-medium">
                  Long Positions ({longs.length})
                </span>
              </div>
              <div className="space-y-2">
                {longs.map((w, i) => (
                  <div
                    key={w.asset_id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-5">
                        {i + 1}
                      </span>
                      <span className="font-medium text-sm">{w.symbol}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="text-xs font-mono"
                        style={{ color: scoreColor(parseFloat(w.composite_score)) }}
                      >
                        {parseFloat(w.composite_score).toFixed(4)}
                      </span>
                      <span
                        className="text-sm font-bold min-w-[52px] text-right"
                        style={{ color: "#DDB110" }}
                      >
                        {(parseFloat(w.target_weight) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shorts */}
            {shorts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-xs uppercase tracking-wider text-text-secondary font-medium">
                    Short Positions ({shorts.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {shorts.map((w, i) => (
                    <div
                      key={w.asset_id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-500/[0.04] hover:bg-red-500/[0.07] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-muted w-5">
                          {i + 1}
                        </span>
                        <span className="font-medium text-sm">{w.symbol}</span>
                        {w.perp_leverage && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">
                            {parseFloat(w.perp_leverage).toFixed(0)}x
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-red-400">
                          {parseFloat(w.composite_score).toFixed(4)}
                        </span>
                        <span className="text-sm font-bold text-red-400 min-w-[52px] text-right">
                          {(parseFloat(w.target_weight) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Target vs Current Bar Chart */}
      {status && status.holdings.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Target vs Current</h3>
          <p className="text-xs text-text-muted mb-4">
            Shorts shown as negative bars below the zero line
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData} margin={{ left: 10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="symbol"
                tick={{ fill: "var(--text-secondary)", fontSize: 11, dy: 8 }}
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                width={50}
              />
              <RechartsTooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [`${Math.abs(Number(value)).toFixed(2)}%`]}
              />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
              <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]}>
                {barData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.side === "short" ? "#F87171" : "#DDB110"}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="current"
                name="Current"
                fill="rgba(255,255,255,0.2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Token Rankings Table */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Token Rankings</h3>
        {weights.length === 0 ? (
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
                  <th className="text-center py-3 px-3 font-medium">Side</th>
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
                {weights.map((w, i) => {
                  const isShort = w.side === "short";
                  return (
                    <tr
                      key={w.asset_id}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                        isShort
                          ? "border-l-2 border-l-red-500/50 bg-red-500/[0.03]"
                          : ""
                      }`}
                    >
                      <td className="py-3 px-3 text-text-secondary">
                        {i + 1}
                      </td>
                      <td className="py-3 px-3 font-medium">{w.symbol}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isShort
                              ? "bg-red-500/10 text-red-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {w.perp_direction
                            ? `${isShort ? "Short" : "Long"}${
                                w.perp_leverage
                                  ? ` ${parseFloat(w.perp_leverage).toFixed(0)}X`
                                  : ""
                              }`
                            : "Spot"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {pct(w.net_distributions_yield_expected_1y)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {pct(w.net_revenue_yield_expected_1y)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {pct(w.growth_trend)}
                      </td>
                      <td
                        className="py-3 px-3 text-right font-mono"
                        style={{
                          color: scoreColor(parseFloat(w.composite_score)),
                        }}
                      >
                        {parseFloat(w.composite_score).toFixed(4)}
                      </td>
                      <td
                        className="py-3 px-3 text-right font-bold"
                        style={{ color: isShort ? "#F87171" : "#DDB110" }}
                      >
                        {pct(w.target_weight)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Strategy Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "50/30/20 Scoring",
            desc: "Dist Yield + Rev Yield + Growth",
            icon: "📊",
          },
          {
            title: "Long / Short",
            desc: "Best fundamentals long, worst short",
            icon: "⚖️",
          },
          {
            title: "Regime-Driven Shorts",
            desc: "Macro stress controls hedge size",
            icon: "🌡️",
          },
          {
            title: "25% / 25% Caps",
            desc: "Max position size per side",
            icon: "🛡️",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="glass rounded-2xl p-5 text-center hover:bg-white/[0.04] transition-colors"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-sm font-semibold mb-1">{card.title}</p>
            <p className="text-xs text-text-muted">{card.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button
          onClick={() => onTabChange("strategy")}
          className="text-sm text-accent-cyan hover:underline inline-flex items-center gap-1"
        >
          Learn more about the strategy
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
