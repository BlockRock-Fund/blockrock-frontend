"use client";

import { useMemo, useDeferredValue, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  ASSET_CLASSES,
  PROFILES,
  SLEEVE_CHILDREN,
  computePortfolioStats,
  type ProfileKey,
  type PresetKey,
  type SleeveCategory,
} from "./data";
import {
  ProfileSelector,
  PortfolioInputTable,
  PortfolioStatsCard,
} from "./components";
import {
  RiskReturnScatter,
  AllocationComparisonBars,
  CorrelationHeatmap,
} from "./charts";

interface BuilderState {
  selectedProfile: ProfileKey;
  allocations: Record<string, number>;
  customReturns: Record<string, number>;
  customVols: Record<string, number>;
}

function makeDefaultReturns(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const ac of ASSET_CLASSES) m[ac.name] = ac.expectedReturn;
  return m;
}

function makeDefaultVols(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const ac of ASSET_CLASSES) m[ac.name] = ac.volatility;
  return m;
}

function initBuilder(key: PresetKey): BuilderState {
  const profile = PROFILES[key];
  return {
    selectedProfile: key,
    allocations: { ...profile.allocation },
    customReturns: makeDefaultReturns(),
    customVols: makeDefaultVols(),
  };
}

export default function PortfolioBuilderPage() {
  const [builder, setBuilder] = useState<BuilderState>(() =>
    initBuilder("moderate")
  );
  const handleProfileSelect = useCallback((key: ProfileKey) => {
    if (key === "custom") {
      setBuilder((prev) => ({ ...prev, selectedProfile: "custom" }));
    } else {
      setBuilder(initBuilder(key));
    }
  }, []);

  const handleAllocationChange = useCallback((name: string, value: number) => {
    setBuilder((prev) => ({
      ...prev,
      selectedProfile: "custom",
      allocations: { ...prev.allocations, [name]: value },
    }));
  }, []);

  const handleReturnChange = useCallback((name: string, value: number) => {
    setBuilder((prev) => ({
      ...prev,
      selectedProfile: "custom",
      customReturns: { ...prev.customReturns, [name]: value },
    }));
  }, []);

  const handleVolChange = useCallback((name: string, value: number) => {
    setBuilder((prev) => ({
      ...prev,
      selectedProfile: "custom",
      customVols: { ...prev.customVols, [name]: value },
    }));
  }, []);

  const handleCMAReset = useCallback(() => {
    setBuilder((prev) => ({
      ...prev,
      customReturns: makeDefaultReturns(),
      customVols: makeDefaultVols(),
    }));
  }, []);

  const handleSleeveAllocationChange = useCallback(
    (sleeve: SleeveCategory, newTotal: number) => {
      setBuilder((prev) => {
        const children = SLEEVE_CHILDREN[sleeve];
        const currentTotal = children.reduce(
          (sum, name) => sum + (prev.allocations[name] ?? 0),
          0
        );

        const newAllocations = { ...prev.allocations };

        if (currentTotal === 0) {
          const equal =
            Math.round((newTotal / children.length) * 10) / 10;
          const remainder =
            Math.round((newTotal - equal * children.length) * 10) / 10;
          for (const name of children) {
            newAllocations[name] = equal;
          }
          newAllocations[children[0]] =
            Math.round((equal + remainder) * 10) / 10;
        } else {
          const ratios = children.map(
            (name) => (prev.allocations[name] ?? 0) / currentTotal
          );
          let distributed = 0;
          let largestIdx = 0;
          let largestRatio = 0;

          for (let i = 0; i < children.length; i++) {
            if (ratios[i] > largestRatio) {
              largestRatio = ratios[i];
              largestIdx = i;
            }
            const val = Math.round(newTotal * ratios[i] * 10) / 10;
            newAllocations[children[i]] = val;
            distributed += val;
          }

          const remainder =
            Math.round((newTotal - distributed) * 10) / 10;
          newAllocations[children[largestIdx]] =
            Math.round(
              (newAllocations[children[largestIdx]] + remainder) * 10
            ) / 10;
        }

        return {
          ...prev,
          selectedProfile: "custom",
          allocations: newAllocations,
        };
      });
    },
    []
  );

  const computed = useMemo(
    () =>
      computePortfolioStats(
        builder.allocations,
        builder.customReturns,
        builder.customVols
      ),
    [builder.allocations, builder.customReturns, builder.customVols]
  );

  // Deferred values — keeps sliders responsive while charts catch up
  const deferredReturns = useDeferredValue(builder.customReturns);
  const deferredVols = useDeferredValue(builder.customVols);
  const deferredAllocations = useDeferredValue(builder.allocations);
  const deferredComputed = useDeferredValue(computed);

  const isPreset = builder.selectedProfile !== "custom";
  const activePreset = isPreset
    ? PROFILES[builder.selectedProfile as PresetKey]
    : null;
  const timeHorizon = activePreset?.timeHorizon ?? "Custom";

  return (
    <section className="pt-6 sm:pt-10 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/research"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-cyan transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Research
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Portfolio Builder
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Model portfolio allocations across asset
            classes.
          </p>
        </div>

        {/* Profile selector */}
        <div className="mb-8">
          <ProfileSelector
            selected={builder.selectedProfile}
            onChange={handleProfileSelect}
          />
        </div>

        {/* Allocations & Assumptions */}
        <div className="mb-8">
          <PortfolioInputTable
            allocations={builder.allocations}
            onAllocationChange={handleAllocationChange}
            onSleeveAllocationChange={handleSleeveAllocationChange}
            returns={builder.customReturns}
            vols={builder.customVols}
            onReturnChange={handleReturnChange}
            onVolChange={handleVolChange}
            onReset={handleCMAReset}
            totalAllocation={computed.totalAllocation}
            violations={computed.violations}
          />
        </div>

        {/* Portfolio Stats (metrics + donut + sleeves) */}
        <div className="mb-8">
          <PortfolioStatsCard
            stats={computed}
            timeHorizon={timeHorizon}
            allocation={builder.allocations}
            profileLabel={activePreset?.name}
          />
        </div>

        {/* Scatter + Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RiskReturnScatter
            customReturns={deferredReturns}
            customVols={deferredVols}
            portfolioStats={deferredComputed}
          />
          <AllocationComparisonBars
            allocations={deferredAllocations}
            isCustom={builder.selectedProfile === "custom"}
          />
        </div>

        {/* Correlation Matrix */}
        <div className="mb-8">
          <CorrelationHeatmap />
        </div>
      </div>
    </section>
  );
}
