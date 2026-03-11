"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import {
  SignalGauges,
  MarketCard,
  MarketCardSkeleton,
  HyperliquidPricesTable,
  HyperliquidPricesSkeleton,
} from "./charts";
import type { HyperliquidPricesResponse, PolymarketEventsResponse } from "./data";

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

type Category = "all" | "politics" | "finance" | "geopolitics" | "tech" | "economy";

export default function SituationMonitorPage() {
  const [signals, setSignals] = useState<SignalsResponse | null>(null);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [markets, setMarkets] = useState<PolymarketEventsResponse | null>(null);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [prices, setPrices] = useState<HyperliquidPricesResponse | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [category, setCategory] = useState<Category>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch(`${API_BASE_URL}/allocation/signals`);
        if (res.ok) setSignals(await res.json());
      } catch (err) {
        console.error("Failed to fetch allocation signals:", err);
      } finally {
        setLoadingSignals(false);
      }
    }
    fetchSignals();
  }, []);

  const fetchMarkets = useCallback(async (cat: Category) => {
    setLoadingMarkets(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/polymarket/events?category=${cat}&limit=20`
      );
      if (res.ok) setMarkets(await res.json());
    } catch (err) {
      console.error("Failed to fetch polymarket events:", err);
    } finally {
      setLoadingMarkets(false);
    }
  }, []);

  const fetchPrices = useCallback(async () => {
    setLoadingPrices(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hyperliquid/prices?limit=50`);
      if (res.ok) setPrices(await res.json());
    } catch (err) {
      console.error("Failed to fetch Hyperliquid prices:", err);
    } finally {
      setLoadingPrices(false);
    }
  }, []);

  // Fetch on mount and category change
  useEffect(() => {
    fetchMarkets(category);
  }, [category, fetchMarkets]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchMarkets(category);
      fetchPrices();
    }, 60_000);
    return () => clearInterval(interval);
  }, [autoRefresh, category, fetchMarkets, fetchPrices]);

  // Reset card index when category changes or new data loads
  useEffect(() => {
    setCardIndex(0);
  }, [category, markets]);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "All" },
    { key: "politics", label: "Politics" },
    { key: "finance", label: "Finance" },
    { key: "geopolitics", label: "Geopolitics" },
    { key: "tech", label: "Tech" },
    { key: "economy", label: "Economy" },
  ];

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
              Situation Monitor
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Live macro signals and prediction market odds.
            </p>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-glass-border hover:border-accent-cyan/30 transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                autoRefresh
                  ? "bg-accent-green animate-pulse"
                  : "bg-text-muted"
              }`}
            />
            {autoRefresh ? "Live" : "Paused"}
          </button>
        </div>

        {/* Prediction Markets */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Prediction Markets</h2>
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    category === cat.key
                      ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                      : "text-text-secondary border border-glass-border hover:border-accent-cyan/20"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loadingMarkets ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <MarketCardSkeleton key={i} />
              ))}
            </div>
          ) : markets && markets.events.length > 0 ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCardIndex((i) => Math.max(0, i - 3))}
                disabled={cardIndex === 0}
                className="shrink-0 p-2 rounded-full border border-glass-border hover:border-accent-cyan/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {markets.events.slice(cardIndex, cardIndex + 3).map((ev) => (
                  <MarketCard key={ev.gamma_event_id} event={ev} />
                ))}
              </div>
              <button
                onClick={() =>
                  setCardIndex((i) =>
                    Math.min(i + 3, markets.events.length - 3)
                  )
                }
                disabled={cardIndex + 3 >= markets.events.length}
                className="shrink-0 p-2 rounded-full border border-glass-border hover:border-accent-cyan/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-text-secondary text-sm">
                No prediction market data available.
              </p>
            </div>
          )}
        </div>

        {/* Prices */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div>
              <h2 className="text-lg font-semibold">Prices</h2>
              <p className="text-sm text-text-secondary">
                Top Hyperliquid perpetuals by 24h notional volume.
              </p>
            </div>
          </div>

          {loadingPrices ? (
            <HyperliquidPricesSkeleton />
          ) : prices && prices.assets.length > 0 ? (
            <HyperliquidPricesTable assets={prices.assets} />
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-text-secondary text-sm">
                No Hyperliquid price data available.
              </p>
            </div>
          )}
        </div>

        {/* Macro Signals */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Valuation Gauges</h2>
          <SignalGauges
            valuation={signals?.valuation ?? null}
            loading={loadingSignals}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">FRED Market Signals</h2>
          {loadingSignals ? (
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
              {signals.signals.map((s) => {
                let display = "—";
                if (s.value != null) {
                  if (s.unit === "prob") {
                    display = `${(s.value * 100).toFixed(0)}%`;
                  } else {
                    display = `${s.value.toFixed(2)}${s.unit}`;
                  }
                }
                return (
                  <div
                    key={s.series_id}
                    className="glass rounded-lg p-4 text-center"
                  >
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1.5 leading-tight">
                      {s.label}
                    </p>
                    <p className="text-lg font-bold">
                      {display}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">
              Unable to load market signals.
            </p>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex gap-4 text-xs text-text-secondary">
          {signals?.fetched_at && (
            <p>
              Signals as of{" "}
              {new Date(signals.fetched_at).toLocaleString()}
            </p>
          )}
          {markets?.fetched_at && (
            <p>
              Markets as of{" "}
              {new Date(markets.fetched_at).toLocaleString()}
            </p>
          )}
          {prices?.fetched_at && (
            <p>
              Hyperliquid as of{" "}
              {new Date(prices.fetched_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
