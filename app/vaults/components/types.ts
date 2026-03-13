export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

export type TargetWeight = {
  asset_id: number;
  symbol: string;
  mint_address: string;
  composite_score: string;
  target_weight: string;
  net_distributions_yield_expected_1y: string | null;
  net_revenue_yield_expected_1y: string | null;
  growth_trend: string | null;
  side: "long" | "short";
  perp_market: string | null;
  perp_direction: string | null;
  perp_leverage: string | null;
};

export type TargetWeightsResponse = {
  weights: TargetWeight[];
  computed_at: string;
  regime_score: string | null;
  short_allocation_pct: string | null;
  confluence_multiplier: string | null;
  confluence_stressed: number | null;
  confluence_total: number | null;
};

export type VaultHolding = {
  mint_address: string;
  asset_id: number | null;
  symbol: string | null;
  token_balance: string | null;
  value_usd: string | null;
  weight: string | null;
};

export type VaultStatus = {
  vault_address: string | null;
  total_value_usd: string | null;
  num_holdings: number;
  holdings: VaultHolding[];
  last_rebalance_at: string | null;
};

export type AllocationRecord = {
  id: number;
  computed_at: string;
  total_vault_value_usd: string | null;
  allocations: Array<{
    symbol: string;
    target_weight: string;
    composite_score: string;
    side?: string;
    perp_market?: string | null;
    perp_direction?: string | null;
    perp_leverage?: string | null;
  }>;
  status: string;
  regime_score: string | null;
  short_allocation_pct: string | null;
};

export const CHART_COLORS = [
  "#DDB110",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#A78BFA",
];

export const SHORT_COLORS = ["#F87171", "#FB923C", "#F472B6", "#FBBF24", "#E879F9"];

export function pct(val: string | null | undefined): string {
  if (!val) return "\u2014";
  const n = parseFloat(val);
  if (isNaN(n)) return "\u2014";
  return `${(n * 100).toFixed(2)}%`;
}

export function usd(val: string | null | undefined): string {
  if (!val) return "\u2014";
  const n = parseFloat(val);
  if (isNaN(n)) return "\u2014";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function scoreColor(score: number): string {
  if (score > 0) return "#10B981";
  if (score < 0) return "#EF4444";
  return "var(--text-secondary)";
}

export function regimeColor(score: number): string {
  if (score <= 0.3) return "#10B981";
  if (score <= 0.6) return "#F59E0B";
  return "#EF4444";
}

export function regimeLabel(score: number): string {
  if (score <= 0.3) return "Benign";
  if (score <= 0.6) return "Elevated";
  return "Stressed";
}
