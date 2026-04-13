"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TerminalMarketList, TerminalNewsList, TerminalPricesTable, TerminalTweetList } from "./charts";
import type { BangitFeedsResponse, HyperliquidPricesResponse, NewsHeadlinesResponse, PolymarketEventsResponse } from "./data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

type Category = "all" | "politics" | "finance" | "geopolitics" | "tech" | "economy";
type FeedType = "HOT" | "TOP_7D" | "BUMP";
type NewsCategory = "all" | "crypto" | "finance" | "macro" | "tech";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "politics", label: "POL" },
  { key: "finance", label: "FIN" },
  { key: "geopolitics", label: "GEO" },
  { key: "tech", label: "TECH" },
  { key: "economy", label: "ECO" },
];

const FEED_TYPES: { key: FeedType; label: string }[] = [
  { key: "HOT", label: "HOT" },
  { key: "TOP_7D", label: "TOP 7D" },
  { key: "BUMP", label: "BUMP" },
];

const NEWS_CATEGORIES: { key: NewsCategory; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "crypto", label: "CRYPTO" },
  { key: "finance", label: "FIN" },
  { key: "macro", label: "MACRO" },
  { key: "tech", label: "TECH" },
];

export default function SituationMonitorPage() {
  const [markets, setMarkets] = useState<PolymarketEventsResponse | null>(null);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [prices, setPrices] = useState<HyperliquidPricesResponse | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [tweets, setTweets] = useState<BangitFeedsResponse | null>(null);
  const [loadingTweets, setLoadingTweets] = useState(true);
  const [news, setNews] = useState<NewsHeadlinesResponse | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [category, setCategory] = useState<Category>("all");
  const [feedType, setFeedType] = useState<FeedType>("HOT");
  const [newsCategory, setNewsCategory] = useState<NewsCategory>("all");
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

  const fetchTweets = useCallback(async (ft: FeedType) => {
    setLoadingTweets(true);
    try {
      const res = await fetch(`${API_BASE_URL}/bangit/tweets?limit=100&feed_type=${ft}`);
      if (res.ok) setTweets(await res.json());
    } catch (err) {
      console.error("Failed to fetch Bangit tweets:", err);
    } finally {
      setLoadingTweets(false);
    }
  }, []);

  const fetchNews = useCallback(async (cat: NewsCategory) => {
    setLoadingNews(true);
    try {
      const res = await fetch(`${API_BASE_URL}/news/headlines?category=${cat}&limit=40`);
      if (res.ok) setNews(await res.json());
    } catch (err) {
      console.error("Failed to fetch news headlines:", err);
    } finally {
      setLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets(category);
  }, [category, fetchMarkets]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    fetchTweets(feedType);
  }, [feedType, fetchTweets]);

  useEffect(() => {
    fetchNews(newsCategory);
  }, [newsCategory, fetchNews]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchMarkets(category);
      fetchPrices();
      fetchTweets(feedType);
      fetchNews(newsCategory);
    }, 60_000);
    return () => clearInterval(interval);
  }, [autoRefresh, category, feedType, newsCategory, fetchMarkets, fetchPrices, fetchTweets, fetchNews]);

  return (
    <div className="fixed inset-0 flex flex-col font-mono border-t border-accent-cyan/20 bg-bg-primary overflow-hidden z-50">
      {/* Terminal top bar */}
      <div className="relative flex items-center justify-center px-4 py-1.5 border-b border-accent-cyan/30 bg-bg-secondary shrink-0">
        <Link
          href="/research"
          className="absolute left-4 flex items-center gap-1 text-[10px] text-text-muted hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          BACK
        </Link>
        <span className="text-xs text-accent-cyan tracking-widest font-bold uppercase">
          SITUATION MONITOR
        </span>
        <button
          onClick={() => setAutoRefresh((v) => !v)}
          className="absolute right-4 flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-cyan transition-colors"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              autoRefresh ? "bg-accent-green animate-pulse" : "bg-text-muted"
            }`}
          />
          {autoRefresh ? "LIVE" : "PAUSED"}
        </button>
      </div>

      {/* 2x2 grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 overflow-hidden min-h-0">
        {/* TOP-LEFT — Prediction Markets */}
        <div className="flex flex-col overflow-hidden min-h-0 border-r border-b border-accent-cyan/20">
          {/* Column header */}
          <div className="shrink-0 h-8 border-b border-accent-cyan/30 bg-bg-secondary px-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-primary tracking-widest uppercase font-bold">
                Predictions
              </span>
              <span className="text-[10px] text-accent-cyan">polymarket</span>
            </div>
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

        {/* TOP-RIGHT — Assets */}
        <div className="flex flex-col overflow-hidden min-h-0 border-b border-accent-cyan/20">
          {/* Column header */}
          <div className="shrink-0 h-8 border-b border-accent-cyan/30 bg-bg-secondary px-3 flex items-center">
            <span className="text-[11px] text-text-primary tracking-widest uppercase font-bold">
              Assets
            </span>
            <span className="text-[10px] text-accent-cyan ml-2">
              hyperliquid
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

        {/* BOTTOM-LEFT — Tweets */}
        <div className="flex flex-col overflow-hidden min-h-0 border-r border-accent-cyan/20">
          {/* Column header */}
          <div className="shrink-0 h-8 border-b border-accent-cyan/30 bg-bg-secondary px-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-primary tracking-widest uppercase font-bold">
                Tweets
              </span>
              <span className="text-[10px] text-accent-cyan">bangit</span>
            </div>
            <div className="flex items-center gap-0.5">
              {FEED_TYPES.map((ft, i) => (
                <span key={ft.key} className="flex items-center">
                  <button
                    onClick={() => setFeedType(ft.key)}
                    className={`text-[10px] px-1.5 py-0.5 transition-colors ${
                      feedType === ft.key
                        ? "text-accent-cyan"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {ft.label}
                  </button>
                  {i < FEED_TYPES.length - 1 && (
                    <span className="text-text-muted/40 text-[10px]">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <TerminalTweetList tweets={tweets?.tweets ?? []} loading={loadingTweets} />
          </div>
        </div>

        {/* BOTTOM-RIGHT — News */}
        <div className="flex flex-col overflow-hidden min-h-0">
          {/* Column header */}
          <div className="shrink-0 h-8 border-b border-accent-cyan/30 bg-bg-secondary px-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-primary tracking-widest uppercase font-bold">
                News
              </span>
              <span className="text-[10px] text-accent-cyan">rss</span>
            </div>
            <div className="flex items-center gap-0.5">
              {NEWS_CATEGORIES.map((cat, i) => (
                <span key={cat.key} className="flex items-center">
                  <button
                    onClick={() => setNewsCategory(cat.key)}
                    className={`text-[10px] px-1.5 py-0.5 transition-colors ${
                      newsCategory === cat.key
                        ? "text-accent-cyan"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {cat.label}
                  </button>
                  {i < NEWS_CATEGORIES.length - 1 && (
                    <span className="text-text-muted/40 text-[10px]">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <TerminalNewsList
              articles={news?.articles ?? []}
              loading={loadingNews}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
