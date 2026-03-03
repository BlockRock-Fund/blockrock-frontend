"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignalGauges } from "./charts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

interface SignalsResponse {
  signals: {
    series_id: string;
    label: string;
    value: number | null;
    unit: string;
  }[];
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

export default function SignalsPage() {
  const [signals, setSignals] = useState<SignalsResponse | null>(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    }
    fetchSignals();
  }, []);

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
            Situation Monitor
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Live macro signals and prediction market odds.
          </p>
        </div>

        {/* Valuation Gauges */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Valuation Gauges</h2>
          <SignalGauges
            valuation={signals?.valuation ?? null}
            loading={loading}
          />
        </div>

        {/* FRED Market Signals */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">FRED Market Signals</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-lg p-3 h-16 animate-pulse"
                />
              ))}
            </div>
          ) : signals ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {signals.signals.map((s) => (
                <div
                  key={s.series_id}
                  className="glass rounded-lg p-3 text-center"
                >
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 truncate">
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
          ) : (
            <p className="text-text-secondary text-sm">
              Unable to load market signals.
            </p>
          )}
        </div>

        {/* Timestamp */}
        {signals?.fetched_at && (
          <p className="text-xs text-text-secondary">
            Data as of{" "}
            {new Date(signals.fetched_at).toLocaleString()}
          </p>
        )}
      </div>
    </section>
  );
}
