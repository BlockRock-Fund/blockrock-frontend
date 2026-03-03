"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ASSET_CLASSES,
  PROFILES,
  SLEEVE_COLORS,
  SLEEVE_LABELS,
  SLEEVE_MAP,
  SLEEVE_ORDER,
  SLEEVE_CHILDREN,
  TOOLTIPS,
  type ProfileKey,
  type ComputedStats,
  type SleeveCategory,
} from "./data";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { CheckCircle, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { useState, Fragment } from "react";

// ---------- Profile Selector ----------

interface ProfileSelectorProps {
  selected: ProfileKey;
  onChange: (key: ProfileKey) => void;
}

const PROFILE_PILLS: { key: ProfileKey; label: string }[] = [
  { key: "conservative", label: "Conservative" },
  { key: "moderate", label: "Moderate" },
  { key: "aggressive", label: "Aggressive" },
  { key: "custom", label: "Custom" },
];

export function ProfileSelector({ selected, onChange }: ProfileSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PROFILE_PILLS.map(({ key, label }) => {
        const active = key === selected;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              active
                ? "bg-accent-cyan text-bg-primary"
                : "glass border border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-cyan/30"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Portfolio Input Table (Allocations + CMA combined) ----------

interface PortfolioInputTableProps {
  allocations: Record<string, number>;
  onAllocationChange: (name: string, value: number) => void;
  onSleeveAllocationChange: (sleeve: SleeveCategory, newTotal: number) => void;
  returns: Record<string, number>;
  vols: Record<string, number>;
  onReturnChange: (name: string, value: number) => void;
  onVolChange: (name: string, value: number) => void;
  onReset: () => void;
  totalAllocation: number;
  violations: string[];
}

export function PortfolioInputTable({
  allocations,
  onAllocationChange,
  onSleeveAllocationChange,
  returns,
  vols,
  onReturnChange,
  onVolChange,
  onReset,
  totalAllocation,
  violations,
}: PortfolioInputTableProps) {
  const isValid =
    Math.abs(totalAllocation - 100) < 0.01 && violations.length === 0;

  const [expanded, setExpanded] = useState<Record<SleeveCategory, boolean>>({
    equity: false,
    fixedIncome: false,
    alternatives: false,
    cash: false,
  });

  const toggleSleeve = (sleeve: SleeveCategory) => {
    setExpanded((prev) => ({ ...prev, [sleeve]: !prev[sleeve] }));
  };

  const acMap = Object.fromEntries(ASSET_CLASSES.map((ac) => [ac.name, ac]));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Allocations &amp; Assumptions</h3>
        <button
          onClick={onReset}
          className="text-xs text-text-secondary hover:text-accent-cyan transition-colors"
        >
          Reset assumptions
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
              <th className="text-left py-3 pr-2">Asset Class</th>
              <th className="py-3 px-2 text-center" style={{ minWidth: 160 }}>
                Allocation
              </th>
              <th className="text-center py-3 px-2 w-12">%</th>
              <th className="text-center py-3 px-2">
                <div className="inline-flex items-center gap-1 justify-center">
                  Exp. Return
                  <InfoTooltip content={TOOLTIPS.cmaReturn} />
                </div>
              </th>
              <th className="text-center py-3 px-2">
                <div className="inline-flex items-center gap-1 justify-center">
                  Volatility
                  <InfoTooltip content={TOOLTIPS.cmaVolatility} />
                </div>
              </th>
              <th className="text-center py-3 px-2">Sharpe</th>
              <th className="text-center py-3 pl-2">Proxy</th>
            </tr>
          </thead>
          <tbody>
            {SLEEVE_ORDER.map((sleeve) => {
              const children = SLEEVE_CHILDREN[sleeve];
              const sleeveTotal = children.reduce(
                (sum, name) => sum + (allocations[name] ?? 0),
                0
              );
              const sleevePct = Math.min(sleeveTotal, 100);
              const sleeveColor = SLEEVE_COLORS[sleeve];
              const isOpen = expanded[sleeve];

              // Weighted-average return & vol for the sleeve
              let sleeveReturn = 0;
              let sleeveVol = 0;
              if (sleeveTotal > 0) {
                for (const name of children) {
                  const ac = acMap[name];
                  if (!ac) continue;
                  const w = (allocations[name] ?? 0) / sleeveTotal;
                  sleeveReturn += w * (returns[name] ?? ac.expectedReturn);
                  sleeveVol += w * (vols[name] ?? ac.volatility);
                }
              }
              const sleeveSharpe =
                sleeveTotal > 0 && sleeveVol > 0
                  ? ((sleeveReturn - 4.5) / sleeveVol).toFixed(2)
                  : "—";

              return (
                <Fragment key={sleeve}>
                  {/* Sleeve header row */}
                  <tr
                    className="border-b border-glass-border bg-bg-tertiary/30 cursor-pointer select-none hover:bg-bg-tertiary/50 transition-colors"
                    onClick={() => toggleSleeve(sleeve)}
                  >
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: sleeveColor }}
                        />
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                        )}
                        <span className="font-semibold">
                          {SLEEVE_LABELS[sleeve]}
                        </span>
                      </div>
                    </td>

                    <td
                      className="py-2.5 px-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={sleeveTotal}
                        onChange={(e) =>
                          onSleeveAllocationChange(
                            sleeve,
                            Number(e.target.value)
                          )
                        }
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-cyan [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${sleeveColor} 0%, ${sleeveColor} ${sleevePct}%, rgba(148,163,184,0.2) ${sleevePct}%, rgba(148,163,184,0.2) 100%)`,
                        }}
                      />
                    </td>

                    <td
                      className="py-2.5 px-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round(sleeveTotal * 10) / 10}
                        onChange={(e) => {
                          const v = Math.max(
                            0,
                            Math.min(100, Number(e.target.value) || 0)
                          );
                          onSleeveAllocationChange(sleeve, v);
                        }}
                        className="w-12 text-center text-sm font-semibold bg-white/[0.06] border border-glass-border/60 rounded-md focus:border-accent-cyan focus:outline-none py-0.5 tabular-nums"
                      />
                    </td>

                    {/* Aggregated CMA cells for sleeve */}
                    <td className="text-center py-2.5 px-2 text-accent-cyan/70 font-medium text-xs">
                      {sleeveTotal > 0 ? `${sleeveReturn.toFixed(1)}%` : "—"}
                    </td>
                    <td className="text-center py-2.5 px-2 text-text-secondary/70 font-medium text-xs">
                      {sleeveTotal > 0 ? `${sleeveVol.toFixed(1)}%` : "—"}
                    </td>
                    <td className="text-center py-2.5 px-2 text-text-secondary/70 text-xs">
                      {sleeveSharpe}
                    </td>
                    <td />
                  </tr>

                  {/* Child rows */}
                  {isOpen &&
                    children.map((name) => {
                      const ac = acMap[name];
                      if (!ac) return null;
                      const alloc = allocations[ac.name] ?? 0;
                      const pct = Math.min(alloc, 100);
                      const ret = returns[ac.name] ?? ac.expectedReturn;
                      const vol = vols[ac.name] ?? ac.volatility;
                      const sharpe =
                        vol > 0 ? ((ret - 4.5) / vol).toFixed(2) : "—";

                      return (
                        <tr
                          key={ac.name}
                          className="border-b border-glass-border/50 hover:bg-bg-tertiary/20 transition-colors"
                        >
                          <td className="py-2.5 pr-2 pl-8">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: ac.color }}
                              />
                              <span className="truncate">{ac.name}</span>
                            </div>
                          </td>

                          <td className="py-2.5 px-2">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              step={1}
                              value={alloc}
                              onChange={(e) =>
                                onAllocationChange(
                                  ac.name,
                                  Number(e.target.value)
                                )
                              }
                              className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-cyan [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, ${ac.color} 0%, ${ac.color} ${pct}%, rgba(148,163,184,0.2) ${pct}%, rgba(148,163,184,0.2) 100%)`,
                              }}
                            />
                          </td>

                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              value={alloc}
                              onChange={(e) => {
                                const v = Math.max(
                                  0,
                                  Math.min(100, Number(e.target.value) || 0)
                                );
                                onAllocationChange(ac.name, v);
                              }}
                              className="w-12 text-center text-sm font-medium bg-white/[0.06] border border-glass-border/60 rounded-md focus:border-accent-cyan focus:outline-none py-0.5 tabular-nums"
                            />
                          </td>

                          <td className="text-center py-2.5 px-2">
                            <input
                              type="number"
                              step={0.1}
                              value={ret}
                              onChange={(e) =>
                                onReturnChange(
                                  ac.name,
                                  Number(e.target.value) || 0
                                )
                              }
                              className="w-14 text-center text-accent-cyan font-medium bg-white/[0.06] border border-glass-border/60 rounded-md focus:border-accent-cyan focus:outline-none py-0.5 tabular-nums"
                            />
                            <span className="text-text-secondary ml-0.5">%</span>
                          </td>

                          <td className="text-center py-2.5 px-2">
                            <input
                              type="number"
                              step={0.1}
                              value={vol}
                              onChange={(e) =>
                                onVolChange(
                                  ac.name,
                                  Number(e.target.value) || 0
                                )
                              }
                              className="w-14 text-center text-text-secondary font-medium bg-white/[0.06] border border-glass-border/60 rounded-md focus:border-accent-cyan focus:outline-none py-0.5 tabular-nums"
                            />
                            <span className="text-text-secondary ml-0.5">%</span>
                          </td>

                          <td className="text-center py-2.5 px-2 text-text-secondary">
                            {sharpe}
                          </td>

                          <td className="text-center py-2.5 pl-2 text-text-secondary font-mono text-xs">
                            {ac.proxyETF}
                          </td>
                        </tr>
                      );
                    })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer: total + violations */}
      <div className="mt-4 pt-4 border-t border-glass-border flex items-center gap-2">
        {isValid ? (
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
        )}
        <span
          className={`text-sm font-semibold ${
            isValid ? "text-green-400" : "text-red-400"
          }`}
        >
          Total: {totalAllocation.toFixed(1)}%
        </span>
      </div>
      {violations
        .filter((v) => !v.startsWith("Allocations sum"))
        .map((v, i) => (
          <p key={i} className="text-xs text-red-400 mt-1">
            {v}
          </p>
        ))}
    </div>
  );
}

// ---------- Portfolio Stats Card (stats + donut + sleeves) ----------

interface PortfolioStatsCardProps {
  stats: ComputedStats;
  timeHorizon: string;
  allocation: Record<string, number>;
  profileLabel?: string;
}

export function PortfolioStatsCard({
  stats,
  timeHorizon,
  allocation,
  profileLabel,
}: PortfolioStatsCardProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Portfolio Stats</h3>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_1fr] gap-6 items-center">
        {/* Left: key metrics */}
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            label="Expected Return"
            value={`${stats.expectedReturn.toFixed(1)}%`}
            accent
            tooltip={TOOLTIPS.expectedReturn}
          />
          <StatItem
            label="Volatility"
            value={`${stats.volatility.toFixed(1)}%`}
            tooltip={TOOLTIPS.volatility}
          />
          <StatItem
            label="Sharpe Ratio"
            value={stats.sharpeRatio.toFixed(2)}
            tooltip={TOOLTIPS.sharpe}
          />
          <StatItem
            label="Max Drawdown"
            value={`${stats.maxDrawdown.toFixed(1)}%`}
            tooltip={TOOLTIPS.maxDrawdown}
          />
          <div className="col-span-2 pt-2 text-xs text-text-secondary">
            Time Horizon:{" "}
            <span className="text-text-secondary">{timeHorizon}</span>
          </div>
        </div>

        {/* Center: donut chart */}
        <AllocationDonut allocation={allocation} label={profileLabel} />

        {/* Right: sleeve breakdown */}
        <div>
          <p className="text-xs text-text-secondary mb-3 uppercase tracking-wider">
            Sleeve Breakdown
          </p>
          <div className="space-y-2.5">
            {(Object.keys(SLEEVE_LABELS) as SleeveCategory[]).map((sleeve) => {
              const pct = stats.sleeves[sleeve];
              return (
                <div key={sleeve} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: SLEEVE_COLORS[sleeve] }}
                  />
                  <span className="text-sm text-text-secondary flex-1">
                    {SLEEVE_LABELS[sleeve]}
                  </span>
                  <span className="text-sm font-medium w-10 text-right tabular-nums">
                    {pct.toFixed(0)}%
                  </span>
                  <div className="w-20 h-1.5 rounded-full bg-bg-tertiary/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: SLEEVE_COLORS[sleeve],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  accent,
  tooltip,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tooltip?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <p className="text-xs text-text-secondary">{label}</p>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
      <p
        className={`text-xl font-bold ${
          accent ? "text-accent-cyan" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ---------- Allocation Donut (embeddable, no wrapper card) ----------

function AllocationDonut({
  allocation,
  label,
}: {
  allocation: Record<string, number>;
  label?: string;
}) {
  const data = SLEEVE_ORDER.flatMap((sleeve) =>
    SLEEVE_CHILDREN[sleeve]
      .filter((name) => (allocation[name] ?? 0) > 0)
      .map((name) => {
        const ac = ASSET_CLASSES.find((a) => a.name === name)!;
        return { name: ac.name, value: allocation[ac.name], color: ac.color };
      })
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full relative" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="glass rounded-lg px-3 py-2 text-sm">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-accent-cyan">{d.value}%</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-text-secondary">Profile</span>
          <span className="text-sm font-bold">{label ?? "Custom"}</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Crypto Sleeve ----------

interface CryptoRow {
  symbol: string;
  name: string;
  mc?: number | null;
  price?: number | null;
  distributions_yield_expected_1y?: number | null;
}

interface CryptoSleeveProps {
  cryptoData: CryptoRow[];
}

function formatCompact(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

export function CryptoSleeve({ cryptoData }: CryptoSleeveProps) {
  if (!cryptoData.length) return null;

  const totalMC = cryptoData.reduce((sum, r) => sum + (Number(r.mc) || 0), 0);
  const yields = cryptoData
    .map((r) => Number(r.distributions_yield_expected_1y))
    .filter((y) => y && isFinite(y));
  const avgYield = yields.length
    ? yields.reduce((s, y) => s + y, 0) / yields.length
    : null;

  const top5 = [...cryptoData]
    .sort((a, b) => (Number(b.mc) || 0) - (Number(a.mc) || 0))
    .slice(0, 5);

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Crypto Sleeve
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-xs text-text-secondary mb-1">Holdings</p>
          <p className="text-xl font-bold">{cryptoData.length}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Total Market Cap</p>
          <p className="text-xl font-bold text-accent-cyan">
            {formatCompact(totalMC)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Avg. Yield</p>
          <p className="text-xl font-bold">
            {avgYield ? `${(avgYield * 100).toFixed(2)}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Data Source</p>
          <p className="text-sm text-text-secondary mt-1">Live on-chain</p>
        </div>
      </div>

      <div className="border-t border-glass-border pt-4">
        <p className="text-xs text-text-secondary mb-3 uppercase tracking-wider">
          Top Holdings
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {top5.map((r) => (
            <div
              key={`${r.symbol}-${r.name}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-bg-tertiary/30"
            >
              <span className="text-sm font-semibold text-accent-cyan">
                {r.symbol}
              </span>
              <span className="text-xs text-text-secondary flex-1 truncate">
                {r.name}
              </span>
              <span className="text-xs text-text-secondary">
                {r.mc ? formatCompact(Number(r.mc)) : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
