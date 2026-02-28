"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PROFILES, type ProfileKey } from "./data";
import { ProfileSelector, ProfileSummaryCard, CMATable, DigitalAssetsSleeve } from "./components";
import { AllocationDonutChart, SignalGauges, RiskReturnScatter, AllocationComparisonBars } from "./charts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

interface SignalsResponse {
  signals: { series_id: string; label: string; value: number | null; unit: string }[];
  valuation: {
    cape: number | null;
    cape_signal: string;
    yield_curve: number | null;
    yield_curve_signal: string;
    hy_spread: number | null;
    hy_spread_signal: string;
  };
  fetched_at: string | null;
}

interface CryptoRow {
  symbol: string;
  name: string;
  mc?: number | null;
  price?: number | null;
  distributions_yield_expected_1y?: number | null;
}

export default function PortfolioPage() {
  const [profile, setProfile] = useState<ProfileKey>("moderate");
  const [signals, setSignals] = useState<SignalsResponse | null>(null);
  const [signalsLoading, setSignalsLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState<CryptoRow[]>([]);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch(`${API_BASE_URL}/allocation/signals`);
        if (res.ok) {
          setSignals(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch allocation signals:", err);
      } finally {
        setSignalsLoading(false);
      }
    }

    async function fetchCrypto() {
      try {
        const res = await fetch(`${API_BASE_URL}/main-table`);
        if (res.ok) {
          const rows = await res.json();
          setCryptoData(
            rows.filter((r: Record<string, unknown>) => !r.sec_ticker).map((r: Record<string, unknown>) => ({
              symbol: r.symbol,
              name: r.name,
              mc: r.mc != null ? Number(r.mc) : null,
              price: r.price != null ? Number(r.price) : null,
              distributions_yield_expected_1y:
                r.distributions_yield_expected_1y != null
                  ? Number(r.distributions_yield_expected_1y)
                  : null,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch crypto data:", err);
      }
    }

    fetchSignals();
    fetchCrypto();
  }, []);

  const activeProfile = PROFILES[profile];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* back link */}
        <Link href="/research" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Research
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Portfolio Construction
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Model portfolio allocations across traditional and digital asset
            classes, driven by live market signals.
          </p>
        </div>

        {/* Profile selector */}
        <div className="mb-8">
          <ProfileSelector selected={profile} onChange={setProfile} />
        </div>

        {/* Summary + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProfileSummaryCard profile={activeProfile} />
          <AllocationDonutChart profile={activeProfile} />
        </div>

        {/* Signal Gauges */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Market Signals
          </h2>
          <SignalGauges
            valuation={signals?.valuation ?? null}
            loading={signalsLoading}
          />
          {signals && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {signals.signals.map((s) => (
                <div
                  key={s.series_id}
                  className="glass rounded-lg p-3 text-center"
                >
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 truncate">
                    {s.label}
                  </p>
                  <p className="text-sm font-bold">
                    {s.value != null
                      ? `${s.value.toFixed(2)}${s.unit}`
                      : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scatter + Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RiskReturnScatter />
          <AllocationComparisonBars />
        </div>

        {/* CMA Table */}
        <div className="mb-8">
          <CMATable />
        </div>

        {/* Digital Assets Sleeve */}
        <DigitalAssetsSleeve cryptoData={cryptoData} />
      </div>
    </section>
  );
}
