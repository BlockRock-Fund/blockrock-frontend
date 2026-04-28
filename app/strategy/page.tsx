"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Activity,
  Brain,
  BarChart3,
  FlaskConical,
} from "lucide-react";
import {
  API_BASE_URL,
  TargetWeight,
  VaultStatus,
  AllocationRecord,
  regimeColor,
  regimeLabel,
  type Universe,
  type StrategyConfigResponse,
} from "./components/types";
import OverviewTab from "./components/OverviewTab";
import StrategyTab from "./components/StrategyTab";
import PerformanceTab from "./components/PerformanceTab";
import FactorResearchTab from "./components/FactorResearchTab";

const TABS = [
  { id: "overview", label: "Live", icon: Activity },
  { id: "strategy", label: "Strategy", icon: Brain },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "factors", label: "Lab", icon: FlaskConical },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function StrategyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [weights, setWeights] = useState<TargetWeight[]>([]);
  const [status, setStatus] = useState<VaultStatus | null>(null);
  const [allocations, setAllocations] = useState<AllocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regimeScore, setRegimeScore] = useState<string | null>(null);
  const [shortAllocationPct, setShortAllocationPct] = useState<string | null>(
    null
  );
  const [confluenceMultiplier, setConfluenceMultiplier] = useState<string | null>(null);
  const [confluenceStressed, setConfluenceStressed] = useState<number | null>(null);
  const [confluenceTotal, setConfluenceTotal] = useState<number | null>(null);
  const [presetName, setPresetName] = useState<string>("default");
  const [universe, setUniverse] = useState<Universe>("token");
  const [strategyConfig, setStrategyConfig] =
    useState<StrategyConfigResponse | null>(null);

  const fetchData = async (uni: Universe = universe) => {
    try {
      setLoading(true);
      setError(null);

      const weightsUrl =
        uni === "all"
          ? `${API_BASE_URL}/vault/target-weights`
          : `${API_BASE_URL}/vault/target-weights?universe=${uni}`;

      const [weightsRes, statusRes, allocsRes, strategyRes] =
        await Promise.all([
          fetch(weightsUrl),
          fetch(`${API_BASE_URL}/vault/status`),
          fetch(`${API_BASE_URL}/vault/allocations?limit=10`),
          fetch(`${API_BASE_URL}/vault/strategy-config?universe=${uni}`),
        ]);

      if (!weightsRes.ok) throw new Error("Failed to load target weights");
      const weightsData = await weightsRes.json();
      setWeights(weightsData.weights || []);
      setRegimeScore(weightsData.regime_score ?? null);
      setShortAllocationPct(weightsData.short_allocation_pct ?? null);
      setConfluenceMultiplier(weightsData.confluence_multiplier ?? null);
      setConfluenceStressed(weightsData.confluence_stressed ?? null);
      setConfluenceTotal(weightsData.confluence_total ?? null);
      setPresetName(weightsData.preset_name ?? "default");

      if (statusRes.ok) setStatus(await statusRes.json());
      if (allocsRes.ok) {
        const allocData = await allocsRes.json();
        setAllocations(allocData.allocations || []);
      }
      if (strategyRes.ok) {
        setStrategyConfig(await strategyRes.json());
      } else {
        setStrategyConfig(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load vault data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(universe);
  }, [universe]);

  const longs = useMemo(
    () => weights.filter((w) => w.side !== "short"),
    [weights]
  );
  const shorts = useMemo(
    () => weights.filter((w) => w.side === "short"),
    [weights]
  );

  const rs = regimeScore ? parseFloat(regimeScore) : null;
  const saPct = shortAllocationPct
    ? (parseFloat(shortAllocationPct) * 100).toFixed(1)
    : "0.0";

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex-1" />
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-white/10 hover:border-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-1">Strategy</h1>
        <p className="text-text-secondary text-sm mb-4">
          Investment strategies optimized for each asset universe.
        </p>

        {/* Universe Selector */}
        <div className="flex gap-2 mb-8">
          {(
            [
              { id: "token", label: "Tokens" },
              { id: "equity", label: "Equities" },
              { id: "all", label: "Tokens + Equities" },
            ] as const
          ).map((u) => (
            <button
              key={u.id}
              onClick={() => setUniverse(u.id)}
              className={`flex-1 rounded-xl px-4 py-3 text-left transition-all ${
                universe === u.id
                  ? "bg-accent-cyan/10 border-2 border-accent-cyan/40"
                  : "bg-white/[0.03] border-2 border-transparent hover:border-white/10"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  universe === u.id ? "text-accent-cyan" : "text-text-primary"
                }`}
              >
                {u.label}
              </p>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Tab Bar */}
        <div className="flex gap-1 border-b border-white/10 mb-8 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  active
                    ? "border-accent-cyan text-accent-cyan"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            weights={weights}
            longs={longs}
            shorts={shorts}
            regimeScore={regimeScore}
            shortAllocationPct={shortAllocationPct}
            status={status}
            loading={loading}
            universe={universe}
            strategyConfig={strategyConfig}
            onTabChange={(tab) => setActiveTab(tab as TabId)}
          />
        )}
        {activeTab === "strategy" && (
          <StrategyTab
            universe={universe}
            regimeScore={regimeScore}
            shortAllocationPct={shortAllocationPct}
            confluenceMultiplier={confluenceMultiplier}
            confluenceStressed={confluenceStressed}
            confluenceTotal={confluenceTotal}
            strategyConfig={strategyConfig}
          />
        )}
        {activeTab === "performance" && (
          <PerformanceTab
            presetName={universe === "all" ? "default" : `default-${universe}`}
          />
        )}
        {activeTab === "factors" && <FactorResearchTab universe={universe} />}
      </div>
    </main>
  );
}
