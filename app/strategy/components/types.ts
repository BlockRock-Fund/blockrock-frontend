export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://blockrock-backend-production.up.railway.app";

export type Universe = "all" | "token" | "equity";

export type TargetWeight = {
  asset_id: number;
  symbol: string;
  mint_address: string;
  composite_score: string;
  target_weight: string;
  // Current scoring fields
  distributions_yield_expected_1y: string | null;
  net_earnings_yield_expected_1y: string | null;
  // Legacy fields
  net_distributions_yield_expected_1y: string | null;
  net_revenue_yield_expected_1y: string | null;
  growth_trend: string | null;
  side: "long" | "short";
  perp_market: string | null;
  perp_direction: string | null;
  perp_leverage: string | null;
  // Per-asset values for every field referenced by the active preset's score
  // formulas, keyed by field name. Used to render dynamic factor columns.
  factor_values: Record<string, string | null>;
};

export type TargetWeightsResponse = {
  weights: TargetWeight[];
  computed_at: string;
  preset_name: string;
  regime_score: string | null;
  // "bullish" | "neutral" | "bearish" | "unknown" | null. Authoritative label
  // from the backend; null means the active preset has no regime_config.
  regime: string | null;
  short_allocation_pct: string | null;
  long_allocation_pct: string | null;
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

export type ScoreTerm = {
  field: string;
  weight: number;
};

export type RegimeSource = {
  name: string;
  weight: number;
};

export type RegimeConfig = {
  sma_window_days: number | null;
  short_pct_bearish: number | null;
  short_pct_bullish: number | null;
  sources: RegimeSource[] | null;
};

export type VaultConstraints = {
  max_holdings: number | null;
  max_weight: number | null;
  max_short_positions: number | null;
  max_short_weight: number | null;
  rebalance_threshold: number | null;
};

export type StrategyConfigResponse = {
  universe: Universe;
  preset_name: string;
  preset_file: string;
  description: string | null;
  score_terms: ScoreTerm[];
  short_score_terms: ScoreTerm[] | null;
  default_short_leverage: number;
  regime_config: RegimeConfig | null;
  exclude_symbols: string[] | null;
  constraints: VaultConstraints;
};

export const CHART_COLORS = ["#4ADE80"];

export const SHORT_COLORS = ["#F87171"];

export interface BacktestSummary {
  preset_name: string;
  backtest_start: string;
  backtest_end: string;
  measurement_start: string | null;
  num_assets: number;
  warnings: string[];
  total_return: number | null;
  sharpe: number | null;
  sortino: number | null;
  calmar: number | null;
  alpha: number | null;
  beta: number | null;
  max_drawdown: number | null;
  eq_weight_return: number | null;
  eq_weight_max_drawdown: number | null;
  sol_return: number | null;
  sol_max_drawdown: number | null;
  btc_return: number | null;
  btc_max_drawdown: number | null;
  cagr: number | null;
  eq_weight_cagr: number | null;
  sol_cagr: number | null;
  btc_cagr: number | null;
  information_ratio: number | null;
  win_rate: number | null;
  volatility: number | null;
}

export interface BacktestHolding {
  symbol: string;
  weight: number;
  side: "long" | "short";
}

export interface BacktestDaily {
  date: string;
  vault_nav: number;
  eq_weight_nav: number;
  sol_nav: number;
  btc_nav: number | null;
  vault_dd: number;
  eq_weight_dd: number;
  sol_dd: number;
  btc_dd: number | null;
  holdings: BacktestHolding[] | null;
  eq_holdings: BacktestHolding[] | null;
}

export interface BacktestData {
  summary: BacktestSummary;
  daily: BacktestDaily[];
  monthly_returns: { month: string; vault: number; eqWeight: number; sol: number; btc: number }[];
}

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

// Backend convention (vault_regime.py): score=1.0 is bullish (fewer shorts),
// score=0.0 is bearish (more shorts), 0.5 is neutral/unknown.
export function regimeColor(score: number): string {
  if (score >= 0.7) return "#10B981";
  if (score >= 0.3) return "#F59E0B";
  return "#EF4444";
}

export function regimeLabel(score: number): string {
  if (score >= 0.7) return "Bullish";
  if (score >= 0.3) return "Neutral";
  return "Bearish";
}
