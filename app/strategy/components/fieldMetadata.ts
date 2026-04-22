export type FieldMetadata = {
  label: string;
  color: string;
  tooltip: string;
};

export const FIELD_METADATA: Record<string, FieldMetadata> = {
  distributions_yield_expected_1y: {
    label: "Distributions Yield",
    color: "#10B981",
    tooltip:
      "Expected 1-year distributions yield. The strongest single return predictor in factor research.",
  },
  net_earnings_yield_expected_1y: {
    label: "Net Earnings Yield",
    color: "#3B82F6",
    tooltip:
      "Expected 1-year net earnings yield after emissions. Captures real profitability vs. vanity revenue metrics.",
  },
  revenue_yield_expected_1y: {
    label: "Revenue Yield",
    color: "#06B6D4",
    tooltip:
      "Revenue relative to market cap. Cross-horizon consistent for equities.",
  },
  volume_trend_7d_30d: {
    label: "Volume Trend (7d / 30d)",
    color: "#10B981",
    tooltip:
      "Short-window volume expansion vs. the longer baseline. Rising relative volume signals participation.",
  },
  mc_fees_mr: {
    label: "Mean Reversion (MC / Fees)",
    color: "#06B6D4",
    tooltip:
      "Time-series z-score of market cap / annualized fees. Detects assets cheap relative to their own history.",
  },
  vol_adj_momentum_21d: {
    label: "Vol-Adjusted Momentum (21d)",
    color: "#F59E0B",
    tooltip:
      "21-day return scaled by realized volatility. Rewards persistent trend over choppy moves.",
  },
  price_vs_high_50d: {
    label: "Price vs 50d High",
    color: "#F59E0B",
    tooltip:
      "Current price relative to 50-day high. Rewards assets trading near recent highs — momentum confirmation.",
  },
  rsi_14: {
    label: "RSI (14-day)",
    color: "#F59E0B",
    tooltip:
      "Relative Strength Index. High RSI indicates overbought conditions; in a short book it flags overextension.",
  },
  macd_hist_pct: {
    label: "MACD Histogram %",
    color: "#F59E0B",
    tooltip:
      "MACD histogram as percentage of price. Positive values indicate bullish momentum.",
  },
  earnings_distributions_pct: {
    label: "Earnings Distribution %",
    color: "#8B5CF6",
    tooltip:
      "Share of earnings actually distributed to holders. High payout ratios signal capital-efficient protocols.",
  },
  roc_30d: {
    label: "30d Rate of Change",
    color: "#F59E0B",
    tooltip:
      "30-day price momentum. Short-term trend continuation signal.",
  },
  distributions_180d_o_180d: {
    label: "Distribution Trend (180d)",
    color: "#EF4444",
    tooltip:
      "180-day period-over-period change in distributions. Negatively weighted — falling distributions incur a score penalty.",
  },
  emissions_rate_expected_1y: {
    label: "Emissions Rate",
    color: "#EF4444",
    tooltip:
      "Expected 1-year token emissions. High emissions dilute holders and create sell pressure — the strongest short signal.",
  },
  obv_trend_20d: {
    label: "OBV Trend (20d)",
    color: "#F97316",
    tooltip:
      "On-Balance Volume trend. Rising OBV without price follow-through signals distribution.",
  },
};

const FALLBACK_COLOR = "#DDB110";

export function getFieldMetadata(field: string): FieldMetadata {
  return (
    FIELD_METADATA[field] ?? {
      label: field,
      color: FALLBACK_COLOR,
      tooltip: `Raw preset field: ${field}. Add metadata in fieldMetadata.ts to customize the label, color, and tooltip.`,
    }
  );
}
