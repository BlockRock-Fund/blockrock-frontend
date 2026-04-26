export type FieldFormat =
  | "pct"
  | "usd_compact"
  | "ratio"
  | "zscore"
  | "rsi"
  | "raw";

export type FieldMetadata = {
  label: string;
  shortLabel?: string;
  color: string;
  tooltip: string;
  format: FieldFormat;
};

export const FIELD_METADATA: Record<string, FieldMetadata> = {
  distributions_1y: {
    label: "Distributions 1y",
    color: "#10B981",
    tooltip:
      "Trailing 1-year distributions paid to holders (raw dollar amount). Level-based cash-flow signal — rewards protocols with proven, sustained payout history over yield-ratio noise.",
    format: "usd_compact",
  },
  distributions_yield_expected_1y: {
    label: "Distributions Yield",
    color: "#10B981",
    tooltip:
      "Expected 1-year distributions yield. The strongest single return predictor in factor research.",
    format: "pct",
  },
  net_distributions_yield_expected_1y: {
    label: "Net Distributions Yield",
    shortLabel: "Net Dist. Yield",
    color: "#10B981",
    tooltip:
      "Expected 1-year distributions yield after emissions dilution. Captures true holder cash return net of token issuance.",
    format: "pct",
  },
  net_earnings_yield_expected_1y: {
    label: "Net Earnings Yield",
    shortLabel: "Net Earn. Yield",
    color: "#3B82F6",
    tooltip:
      "Expected 1-year net earnings yield after emissions. Captures real profitability vs. vanity revenue metrics.",
    format: "pct",
  },
  revenue_yield_expected_1y: {
    label: "Revenue Yield",
    color: "#06B6D4",
    tooltip:
      "Revenue relative to market cap. Cross-horizon consistent for equities.",
    format: "pct",
  },
  net_revenue_yield_expected_1y: {
    label: "Net Revenue Yield",
    color: "#06B6D4",
    tooltip:
      "Expected 1-year revenue yield after emissions dilution.",
    format: "pct",
  },
  net_revenue_1y_o_1y: {
    label: "Net Revenue Growth (1y / 1y)",
    shortLabel: "Net Rev. Growth",
    color: "#06B6D4",
    tooltip:
      "Current trailing-year net revenue (after emissions) vs. the prior trailing year. Growth signal that rewards protocols whose real cash flows are accelerating.",
    format: "pct",
  },
  net_revenue_90d_o_90d: {
    label: "Net Revenue Growth (90d / 90d)",
    color: "#06B6D4",
    tooltip:
      "90-day net revenue vs. prior 90-day window. Shorter-horizon growth signal.",
    format: "pct",
  },
  revenue_90d_o_90d: {
    label: "Revenue Growth (90d / 90d)",
    color: "#06B6D4",
    tooltip:
      "Gross 90-day revenue vs. prior 90-day window.",
    format: "pct",
  },
  volume_trend_7d_30d: {
    label: "Volume Trend (7d / 30d)",
    shortLabel: "Vol. Trend",
    color: "#10B981",
    tooltip:
      "Short-window volume expansion vs. the longer baseline. Rising relative volume signals participation.",
    format: "ratio",
  },
  mc_fees_mr: {
    label: "Mean Reversion (MC / Fees)",
    shortLabel: "MR (MC/Fees)",
    color: "#06B6D4",
    tooltip:
      "Time-series z-score of market cap / annualized fees. Detects assets cheap relative to their own history.",
    format: "zscore",
  },
  vol_adj_momentum_21d: {
    label: "Vol-Adjusted Momentum (21d)",
    shortLabel: "VolAdj Mom 21d",
    color: "#F59E0B",
    tooltip:
      "21-day return scaled by realized volatility. Rewards persistent trend over choppy moves.",
    format: "zscore",
  },
  vol_adj_momentum_30d: {
    label: "Vol-Adjusted Momentum (30d)",
    shortLabel: "VolAdj Mom 30d",
    color: "#F59E0B",
    tooltip:
      "30-day return scaled by realized volatility.",
    format: "zscore",
  },
  price_vs_high_50d: {
    label: "Price vs 50d High",
    shortLabel: "Px vs 50d Hi",
    color: "#F59E0B",
    tooltip:
      "Current price relative to 50-day high. Rewards assets trading near recent highs — momentum confirmation.",
    format: "ratio",
  },
  price_vs_high_20d: {
    label: "Price vs 20d High",
    color: "#F59E0B",
    tooltip:
      "Current price relative to 20-day high.",
    format: "ratio",
  },
  price_vs_sma50: {
    label: "Price vs 50d SMA",
    color: "#F59E0B",
    tooltip:
      "Current price relative to its 50-day simple moving average.",
    format: "ratio",
  },
  sma50_vs_sma200: {
    label: "50d SMA vs 200d SMA",
    color: "#F59E0B",
    tooltip:
      "Ratio of 50d to 200d SMA. Above 1 indicates an uptrend regime.",
    format: "ratio",
  },
  rsi_14: {
    label: "RSI (14-day)",
    color: "#F59E0B",
    tooltip:
      "Relative Strength Index. High RSI indicates overbought conditions; in a short book it flags overextension.",
    format: "rsi",
  },
  macd_hist_pct: {
    label: "MACD Histogram %",
    shortLabel: "MACD Hist %",
    color: "#F59E0B",
    tooltip:
      "MACD histogram as percentage of price. Positive values indicate bullish momentum.",
    format: "pct",
  },
  earnings_distributions_pct: {
    label: "Earnings Distribution %",
    color: "#8B5CF6",
    tooltip:
      "Share of earnings actually distributed to holders. High payout ratios signal capital-efficient protocols.",
    format: "pct",
  },
  roc_30d: {
    label: "30d Rate of Change",
    color: "#F59E0B",
    tooltip:
      "30-day price momentum. Short-term trend continuation signal.",
    format: "pct",
  },
  roc_7d: {
    label: "7d Rate of Change",
    color: "#F59E0B",
    tooltip:
      "7-day price momentum.",
    format: "pct",
  },
  roc_90d: {
    label: "90d Rate of Change",
    color: "#F59E0B",
    tooltip:
      "90-day price momentum.",
    format: "pct",
  },
  distributions_180d_o_180d: {
    label: "Distribution Trend (180d)",
    color: "#EF4444",
    tooltip:
      "180-day period-over-period change in distributions. Negatively weighted — falling distributions incur a score penalty.",
    format: "pct",
  },
  emissions_rate_expected_1y: {
    label: "Emissions Rate",
    color: "#EF4444",
    tooltip:
      "Expected 1-year token emissions. High emissions dilute holders and create sell pressure — the strongest short signal.",
    format: "pct",
  },
  obv_trend_20d: {
    label: "OBV Trend (20d)",
    color: "#F97316",
    tooltip:
      "On-Balance Volume trend. Rising OBV without price follow-through signals distribution.",
    format: "ratio",
  },
  volume_ratio_20d: {
    label: "Volume Ratio (20d)",
    color: "#10B981",
    tooltip:
      "Current 20-day volume vs. its longer-run baseline.",
    format: "ratio",
  },
  days_since_20d_high: {
    label: "Days Since 20d High",
    color: "#F59E0B",
    tooltip:
      "Number of days since the asset last printed a 20-day high.",
    format: "raw",
  },
  growth_trend: {
    label: "Growth Trend",
    color: "#06B6D4",
    tooltip:
      "Composite growth indicator computed across multiple horizons.",
    format: "pct",
  },
  treasury_coverage: {
    label: "Treasury Coverage",
    color: "#8B5CF6",
    tooltip:
      "Treasury value relative to market cap.",
    format: "ratio",
  },
  tvl_chg_30d: {
    label: "TVL Change (30d)",
    color: "#06B6D4",
    tooltip:
      "30-day change in total value locked.",
    format: "pct",
  },
};

const FALLBACK_COLOR = "#DDB110";

export function getFieldMetadata(field: string): FieldMetadata {
  return (
    FIELD_METADATA[field] ?? {
      label: field,
      color: FALLBACK_COLOR,
      tooltip: `Raw preset field: ${field}. Add metadata in fieldMetadata.ts to customize the label, color, and tooltip.`,
      format: "raw",
    }
  );
}

function formatCompactDollar(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function formatFactorValue(
  field: string,
  value: string | null | undefined
): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = parseFloat(value);
  if (isNaN(n)) return "—";

  const meta = getFieldMetadata(field);
  switch (meta.format) {
    case "pct":
      return `${(n * 100).toFixed(2)}%`;
    case "usd_compact":
      return formatCompactDollar(n);
    case "ratio":
      return `${n.toFixed(2)}×`;
    case "zscore":
      return n.toFixed(2);
    case "rsi":
      return n.toFixed(1);
    case "raw":
    default:
      return n.toFixed(4);
  }
}
