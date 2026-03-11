"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TerminalMarketList, TerminalPricesTable, TerminalTweetList } from "./charts";
import type { BangitFeedsResponse, HyperliquidPricesResponse, PolymarketEventsResponse } from "./data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

type Category = "all" | "politics" | "finance" | "geopolitics" | "tech" | "economy";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "politics", label: "POL" },
  { key: "finance", label: "FIN" },
  { key: "geopolitics", label: "GEO" },
  { key: "tech", label: "TECH" },
  { key: "economy", label: "ECO" },
];

export default function SituationMonitorPage() {
  const [markets, setMarkets] = useState<PolymarketEventsResponse | null>(null);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [prices, setPrices] = useState<HyperliquidPricesResponse | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [tweets, setTweets] = useState<BangitFeedsResponse | null>(null);
  const [loadingTweets, setLoadingTweets] = useState(true);
  const [category, setCategory] = useState<Category>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMarkets = useCallback(async (cat: Category) => {
    setLoadingMarkets(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/polymarket/events?category=${cat}&limit=40`
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

  const fetchTweets = useCallback(async () => {
    setLoadingTweets(true);
    try {
      const res = await fetch(`${API_BASE_URL}/bangit/tweets?limit=100`);
      if (res.ok) setTweets(await res.json());
    } catch (err) {
      console.error("Failed to fetch Bangit tweets:", err);
    } finally {
      setLoadingTweets(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets(category);
  }, [category, fetchMarkets]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchMarkets(category);
      fetchPrices();
      fetchTweets();
    }, 60_000);
    return () => clearInterval(interval);
  }, [autoRefresh, category, fetchMarkets, fetchPrices, fetchTweets]);

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 flex flex-col font-mono border-t border-accent-cyan/20 bg-bg-primary overflow-hidden z-10">
      {/* Terminal top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-accent-cyan/20 bg-bg-secondary/60 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/research"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            BACK
          </Link>
          <span className="text-xs text-accent-cyan tracking-widest font-semibold">
            SITUATION MONITOR
          </span>
        </div>
        <button
          onClick={() => setAutoRefresh((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-cyan transition-colors"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              autoRefresh ? "bg-accent-green animate-pulse" : "bg-text-muted"
            }`}
          />
          {autoRefresh ? "LIVE" : "PAUSED"}
        </button>
      </div>

      {/* 3-column grid */}
      <div className="flex-1 grid grid-cols-[1fr_1.5fr_1fr] overflow-hidden min-h-0">
        {/* LEFT — Prediction Markets */}
        <div className="flex flex-col overflow-hidden min-h-0 border-r border-accent-cyan/20">
          {/* Column header */}
          <div className="shrink-0 h-10 border-b border-accent-cyan/30 bg-bg-secondary/60 px-3 flex items-center justify-between gap-2">
            <span className="text-xs text-accent-cyan tracking-widest uppercase">
              Prediction Markets
            </span>
            <div className="flex items-center gap-0.5">
              {CATEGORIES.map((cat, i) => (
                <span key={cat.key} className="flex items-center">
                  <button
                    onClick={() => setCategory(cat.key)}
                    className={`text-[10px] px-1.5 py-0.5 transition-colors ${
                      category === cat.key
                        ? "text-accent-cyan"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {cat.label}
                  </button>
                  {i < CATEGORIES.length - 1 && (
                    <span className="text-text-muted/40 text-[10px]">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <TerminalMarketList
              events={markets?.events ?? []}
              loading={loadingMarkets}
            />
          </div>
        </div>

        {/* CENTER — Prices */}
        <div className="flex flex-col overflow-hidden min-h-0 border-r border-accent-cyan/20">
          {/* Column header */}
          <div className="shrink-0 h-10 border-b border-accent-cyan/30 bg-bg-secondary/60 px-3 flex items-center">
            <span className="text-xs text-accent-cyan tracking-widest uppercase">
              Prices
            </span>
            <span className="text-[10px] text-text-muted ml-2">
              hyperliquid perps · 24h vol
            </span>
          </div>
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 min-h-0 overflow-x-auto">
            <TerminalPricesTable
              assets={prices?.assets ?? []}
              loading={loadingPrices}
            />
          </div>
        </div>

        {/* RIGHT — Tweets */}
        <div className="flex flex-col overflow-hidden min-h-0">
          {/* Column header */}
          <div className="shrink-0 h-10 border-b border-accent-cyan/30 bg-bg-secondary/60 px-3 flex items-center">
            <span className="text-xs text-accent-cyan tracking-widest uppercase">
              Tweets
            </span>
            <span className="text-[10px] text-text-muted ml-2">bangit · hot feed</span>
          </div>
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <TerminalTweetList tweets={tweets?.tweets ?? []} loading={loadingTweets} />
          </div>
        </div>
      </div>
    </div>
  );
}
