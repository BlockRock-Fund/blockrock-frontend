// ---------- Polymarket types ----------

export interface PolymarketOutcome {
  label: string;
  probability: number;
  resolved?: boolean;
  probability_change?: number | null;
}

export interface PolymarketEventData {
  id: number;
  gamma_event_id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  categories: string[];
  active: boolean;
  end_date: string | null;
  volume: number;
  volume_24hr: number;
  liquidity: number;
  open_interest: number;
  competitive: number;
  outcomes: PolymarketOutcome[];
  is_binary: boolean;
  num_outcomes: number;
  polymarket_url: string;
  recorded_date: string;
  updated_at: string;
}

export interface PolymarketEventsResponse {
  events: PolymarketEventData[];
  fetched_at: string | null;
}

// ---------- Hyperliquid types ----------

export interface HyperliquidPriceData {
  coin: string;
  display_name: string;
  mark_price: number;
  day_ntl_volume: number;
  open_interest: number | null;
  funding_rate: number | null;
  change_4h_pct: number | null;
  change_8h_pct: number | null;
  change_1d_pct: number | null;
  change_3d_pct: number | null;
  change_7d_pct: number | null;
  fetched_at: string;
}

export interface HyperliquidPricesResponse {
  assets: HyperliquidPriceData[];
  fetched_at: string | null;
}

export function formatVolume(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export function formatPrice(v: number): string {
  if (v >= 1000) return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (v >= 1) return `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${v.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

export function formatPercentChange(v: number | null): string {
  if (v == null) return "—";
  const pct = v * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function hyperliquidTradeUrl(coin: string): string {
  // HIP-3 coins like "xyz:TSLA" → use the full coin identifier
  // Regular perps like "BTC" → just the coin name
  return `https://app.hyperliquid.xyz/trade/${coin}`;
}

export function formatImpact(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(v / 1_000).toFixed(2)}K`;
  return v.toString();
}

// ---------- Bangit types ----------

export interface BangitTweet {
  id: string;
  username: string;
  text: string;
  impact?: number | null;
  url?: string | null;
}

export interface BangitFeedsResponse {
  tweets: BangitTweet[];
  fetched_at?: string | null;
}

// ---------- Signal tooltips ----------

export const SIGNAL_TOOLTIPS = {
  cape: "CAPE (Cyclically Adjusted P/E) measures the S&P 500 price relative to 10-year average earnings.\n\nBelow 15: Cheap — historically strong forward returns.\n15–25: Fair value — average forward returns.\nAbove 25: Elevated — below-average forward returns expected.",
  yieldCurve:
    "The yield curve spread (10Y minus 2Y Treasury) signals economic expectations.\n\nInverted (< 0%): Recession risk — historically precedes downturns.\nFlat (0–0.5%): Caution — slowing growth signals.\nSteep (> 0.5%): Healthy — economy expanding normally.",
  hySpread:
    "High-yield bond spread over Treasuries measures credit risk appetite.\n\nTight (< 3.5%): Complacency — little compensation for credit risk.\nNeutral (3.5–6%): Fair — normal risk pricing.\nWide (> 6%): Attractive — high compensation, often near cycle bottoms.",
};
