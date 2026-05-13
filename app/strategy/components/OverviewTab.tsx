"use client";

import { useMemo } from "react";
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
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import {
  TargetWeight,
  VaultStatus,
  CHART_COLORS,
  SHORT_COLORS,
  pct,
  scoreColor,
  regimeColor,
  regimeLabel,
  type Universe,
  type StrategyConfigResponse,
  type ScoreTerm,
} from "./types";
import { getFieldMetadata, formatFactorValue } from "./fieldMetadata";

interface OverviewTabProps {
  weights: TargetWeight[];
  longs: TargetWeight[];
  shorts: TargetWeight[];
  regimeScore: string | null;
  regime: string | null;
  shortAllocationPct: string | null;
  longAllocationPct: string | null;
  status: VaultStatus | null;
  loading: boolean;
  universe: Universe;
  strategyConfig: StrategyConfigResponse | null;
}

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "8px",
  color: "#f1f5f9",
  fontSize: "12px",
};

const RADIAN = Math.PI / 180;

function renderPieLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
}: any) {
  const radius = outerRadius + 70;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fill="var(--text-secondary)"
      fontSize={14}
    >
      {name} {value.toFixed(1)}%
    </text>
  );
}

export default function OverviewTab({
  weights,
  longs,
  shorts,
  regimeScore,
  regime,
  shortAllocationPct,
  longAllocationPct,
  status,
  loading,
  universe,
  strategyConfig,
}: OverviewTabProps) {
  // Top 3 factor columns for the Token Rankings table — sorted by absolute
  // weight in the active strategy's long-side score formula. The list collapses
  // gracefully when the strategy uses fewer than 3 factors.
  const topFactors: ScoreTerm[] = useMemo(() => {
    const terms = strategyConfig?.score_terms ?? [];
    return [...terms]
      .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
      .slice(0, 3);
  }, [strategyConfig]);

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

  // Regime banner data — populated from the live API response. The backend
  // returns regime=null when the active preset has no regime_config (so the
  // banner is hidden); regime="unknown" when configured but data was missing.
  const rs = regimeScore ? parseFloat(regimeScore) : null;
  const sPct =
    shortAllocationPct !== null ? parseFloat(shortAllocationPct) * 100 : null;
  const lPct =
    longAllocationPct !== null
      ? parseFloat(longAllocationPct) * 100
      : sPct !== null
      ? 100 - sPct
      : null;
  const regimeText =
    regime && regime !== "unknown"
      ? regime.charAt(0).toUpperCase() + regime.slice(1)
      : rs !== null
      ? regimeLabel(rs)
      : null;
  const regimeUnknown = regime === "unknown";
  const showRegimeBanner = regime !== null;
  const presetSourceCount = strategyConfig?.regime_config?.sources?.length ?? 0;

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
      {/* Regime Banner — hidden when the active preset has no regime_config */}
      {showRegimeBanner && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Long / Short Regime
            </h3>
            {strategyConfig?.preset_name && (
              <span className="ml-auto text-[11px] font-mono text-text-muted">
                {strategyConfig.preset_name}
              </span>
            )}
          </div>

          {regimeUnknown ? (
            <div className="text-sm text-text-muted">
              Insufficient signal data &mdash; using a 50/50 long/short split
              until the configured sources catch up.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
                  Regime
                </p>
                <div className="flex items-center gap-2">
                  {rs !== null && (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: regimeColor(rs) }}
                    />
                  )}
                  <span
                    className="text-lg font-bold"
                    style={{ color: rs !== null ? regimeColor(rs) : undefined }}
                  >
                    {regimeText ?? "—"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
                  Score
                </p>
                <p className="text-lg font-bold font-mono">
                  {rs !== null ? rs.toFixed(2) : "—"}
                  <span className="text-xs text-text-muted ml-1">/ 1.00</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
                  Long
                </p>
                <p className="text-lg font-bold font-mono text-emerald-400">
                  {lPct !== null ? `${lPct.toFixed(0)}%` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
                  Short
                </p>
                <p className="text-lg font-bold font-mono text-red-400">
                  {sPct !== null ? `${sPct.toFixed(0)}%` : "—"}
                </p>
              </div>
            </div>
          )}

          {presetSourceCount > 0 && !regimeUnknown && (
            <p className="text-[11px] text-text-muted mt-3">
              Blended from {presetSourceCount}{" "}
              {presetSourceCount === 1 ? "source" : "sources"} &middot; 1.00 ={" "}
              <span className="text-emerald-400">bullish</span> &middot; 0.00 ={" "}
              <span className="text-red-400">bearish</span>
            </p>
          )}
        </div>
      )}

      {/* Donut + Longs + Shorts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Donut Chart */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Allocation</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={renderPieLabel}
                labelLine={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }}
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
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Longs */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="text-xl font-semibold">Longs</h3>
            <span className="text-xs text-text-muted">({longs.length})</span>
          </div>
          <div className="space-y-2">
            {longs.map((w, i) => (
              <div
                key={w.asset_id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-text-muted w-4">{i + 1}</span>
                  <span className="font-medium text-sm truncate">{w.symbol}</span>
                </div>
                <span
                  className="text-sm font-bold min-w-[44px] text-right"
                  style={{ color: "#DDB110" }}
                >
                  {(parseFloat(w.target_weight) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shorts */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <h3 className="text-xl font-semibold">Shorts</h3>
            <span className="text-xs text-text-muted">({shorts.length})</span>
          </div>
          {shorts.length === 0 ? (
            <div className="text-xs text-text-muted py-2 px-3">
              No short positions
            </div>
          ) : (
            <div className="space-y-2">
              {shorts.map((w, i) => (
                <div
                  key={w.asset_id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-500/[0.04] hover:bg-red-500/[0.07] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-text-muted w-4">{i + 1}</span>
                    <span className="font-medium text-sm truncate">{w.symbol}</span>
                    {w.perp_leverage && parseFloat(w.perp_leverage) !== 1 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">
                        {parseFloat(w.perp_leverage).toFixed(0)}x
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-red-400 min-w-[44px] text-right">
                    {(parseFloat(w.target_weight) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          )}
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
        <h3 className="text-xl font-semibold mb-4">Rankings</h3>
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
                  <th className="text-center py-3 px-3 font-medium">Position</th>
                  {topFactors.length > 0 ? (
                    topFactors.map((term) => {
                      const meta = getFieldMetadata(term.field);
                      return (
                        <th
                          key={term.field}
                          className="text-right py-3 px-3 font-medium"
                          title={meta.tooltip}
                        >
                          {meta.shortLabel ?? meta.label}
                        </th>
                      );
                    })
                  ) : (
                    <>
                      <th className="text-right py-3 px-3 font-medium">
                        Dist. Yield
                      </th>
                      <th className="text-right py-3 px-3 font-medium">
                        Net Earn. Yield
                      </th>
                    </>
                  )}
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
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {isShort ? "Short" : "Long"}
                        </span>
                      </td>
                      {topFactors.length > 0 ? (
                        topFactors.map((term) => (
                          <td
                            key={term.field}
                            className="py-3 px-3 text-right font-mono"
                          >
                            {formatFactorValue(
                              term.field,
                              w.factor_values?.[term.field] ?? null
                            )}
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="py-3 px-3 text-right">
                            {pct(w.distributions_yield_expected_1y)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {pct(w.net_earnings_yield_expected_1y)}
                          </td>
                        </>
                      )}
                      <td
                        className="py-3 px-3 text-right font-mono"
                        style={{
                          color: isShort
                            ? "#F87171"
                            : scoreColor(parseFloat(w.composite_score)),
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

    </div>
  );
}
