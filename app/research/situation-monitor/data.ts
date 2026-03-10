// ---------- Polymarket types ----------

export interface PolymarketOutcome {
  label: string;
  probability: number;
  resolved?: boolean;
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

export function formatVolume(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

// ---------- Signal tooltips ----------

export const SIGNAL_TOOLTIPS = {
  cape: "CAPE (Cyclically Adjusted P/E) measures the S&P 500 price relative to 10-year average earnings.\n\nBelow 15: Cheap — historically strong forward returns.\n15–25: Fair value — average forward returns.\nAbove 25: Elevated — below-average forward returns expected.",
  yieldCurve:
    "The yield curve spread (10Y minus 2Y Treasury) signals economic expectations.\n\nInverted (< 0%): Recession risk — historically precedes downturns.\nFlat (0–0.5%): Caution — slowing growth signals.\nSteep (> 0.5%): Healthy — economy expanding normally.",
  hySpread:
    "High-yield bond spread over Treasuries measures credit risk appetite.\n\nTight (< 3.5%): Complacency — little compensation for credit risk.\nNeutral (3.5–6%): Fair — normal risk pricing.\nWide (> 6%): Attractive — high compensation, often near cycle bottoms.",
};
