"use client";

import {
  ASSET_CLASSES,
  PROFILES,
  type ProfileKey,
  type Profile,
} from "./data";

// ---------- Profile Selector ----------

interface ProfileSelectorProps {
  selected: ProfileKey;
  onChange: (key: ProfileKey) => void;
}

const PROFILE_KEYS: ProfileKey[] = ["conservative", "moderate", "aggressive"];

export function ProfileSelector({ selected, onChange }: ProfileSelectorProps) {
  return (
    <div className="flex gap-2">
      {PROFILE_KEYS.map((key) => {
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
            {PROFILES[key].name}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Profile Summary Card ----------

interface ProfileSummaryCardProps {
  profile: Profile;
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  const { stats } = profile;

  const sleeveData = [
    { label: "Equity", value: stats.equityPct, color: "#3b82f6" },
    { label: "Fixed Income", value: stats.fixedIncomePct, color: "#10b981" },
    { label: "Alternatives", value: stats.alternativesPct, color: "#f59e0b" },
    { label: "Cash", value: stats.cashPct, color: "#94a3b8" },
    { label: "Digital", value: stats.digitalPct, color: "#DDB110" },
  ];

  return (
    <div className="glass rounded-2xl p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">
        {profile.name} Profile
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatItem
          label="Expected Return"
          value={`${stats.expectedReturn.toFixed(1)}%`}
          accent
        />
        <StatItem
          label="Volatility"
          value={`${stats.volatility.toFixed(1)}%`}
        />
        <StatItem label="Time Horizon" value={stats.timeHorizon} />
        <StatItem label="Max Drawdown" value={stats.maxDrawdown} />
      </div>

      <div className="border-t border-glass-border pt-4">
        <p className="text-xs text-text-muted mb-3 uppercase tracking-wider">
          Sleeve Breakdown
        </p>
        <div className="space-y-2">
          {sleeveData.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-sm text-text-secondary flex-1">
                {s.label}
              </span>
              <span className="text-sm font-medium">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-text-muted mb-1">{label}</p>
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

// ---------- CMA Table ----------

export function CMATable() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Capital Market Assumptions
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-glass-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-3 pr-4">Asset Class</th>
              <th className="text-right py-3 px-4">Exp. Return</th>
              <th className="text-right py-3 px-4">Volatility</th>
              <th className="text-right py-3 px-4">Sharpe</th>
              <th className="text-right py-3 pl-4">Proxy</th>
            </tr>
          </thead>
          <tbody>
            {ASSET_CLASSES.map((ac) => (
              <tr
                key={ac.name}
                className="border-b border-glass-border/50 hover:bg-bg-tertiary/20 transition-colors"
              >
                <td className="py-3 pr-4 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ac.color }}
                  />
                  {ac.name}
                </td>
                <td className="text-right py-3 px-4 text-accent-cyan font-medium">
                  {ac.expectedReturn.toFixed(1)}%
                </td>
                <td className="text-right py-3 px-4 text-text-secondary">
                  {ac.volatility.toFixed(1)}%
                </td>
                <td className="text-right py-3 px-4 text-text-secondary">
                  {ac.sharpeRatio.toFixed(2)}
                </td>
                <td className="text-right py-3 pl-4 text-text-muted font-mono text-xs">
                  {ac.proxyETF}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Digital Assets Sleeve ----------

interface CryptoRow {
  symbol: string;
  name: string;
  mc?: number | null;
  price?: number | null;
  distributions_yield_expected_1y?: number | null;
}

interface DigitalAssetsSleeveProps {
  cryptoData: CryptoRow[];
}

function formatCompact(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

export function DigitalAssetsSleeve({ cryptoData }: DigitalAssetsSleeveProps) {
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
        Digital Assets Sleeve
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-xs text-text-muted mb-1">Holdings</p>
          <p className="text-xl font-bold">{cryptoData.length}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-1">Total Market Cap</p>
          <p className="text-xl font-bold text-accent-cyan">
            {formatCompact(totalMC)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-1">Avg. Yield</p>
          <p className="text-xl font-bold">
            {avgYield ? `${(avgYield * 100).toFixed(2)}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-1">Data Source</p>
          <p className="text-sm text-text-secondary mt-1">Live on-chain</p>
        </div>
      </div>

      <div className="border-t border-glass-border pt-4">
        <p className="text-xs text-text-muted mb-3 uppercase tracking-wider">
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
              <span className="text-xs text-text-muted flex-1 truncate">
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
