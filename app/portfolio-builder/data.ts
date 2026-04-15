// Capital Market Assumptions (CMA) — updated annually
// These are long-term expected returns/volatilities, not worth storing in a DB.

export interface AssetClass {
  name: string;
  expectedReturn: number; // annualized %
  volatility: number; // annualized std dev %
  sharpeRatio: number;
  proxyETF: string;
  color: string;
}

export const ASSET_CLASSES: AssetClass[] = [
  {
    name: "US Large Cap",
    expectedReturn: 7.5,
    volatility: 15.0,
    sharpeRatio: 0.5,
    proxyETF: "SPY",
    color: "#3b82f6",
  },
  {
    name: "Int'l Developed",
    expectedReturn: 6.5,
    volatility: 16.0,
    sharpeRatio: 0.41,
    proxyETF: "EFA",
    color: "#3b82f6",
  },
  {
    name: "Emerging Markets",
    expectedReturn: 8.0,
    volatility: 20.0,
    sharpeRatio: 0.4,
    proxyETF: "EEM",
    color: "#3b82f6",
  },
  {
    name: "US Agg Bond",
    expectedReturn: 4.0,
    volatility: 5.5,
    sharpeRatio: 0.73,
    proxyETF: "AGG",
    color: "#10b981",
  },
  {
    name: "TIPS",
    expectedReturn: 3.5,
    volatility: 5.0,
    sharpeRatio: 0.7,
    proxyETF: "TIP",
    color: "#10b981",
  },
  {
    name: "High Yield",
    expectedReturn: 5.5,
    volatility: 9.0,
    sharpeRatio: 0.61,
    proxyETF: "HYG",
    color: "#10b981",
  },
  {
    name: "REITs",
    expectedReturn: 6.5,
    volatility: 18.0,
    sharpeRatio: 0.36,
    proxyETF: "VNQ",
    color: "#f59e0b",
  },
  {
    name: "Commodities",
    expectedReturn: 4.0,
    volatility: 16.0,
    sharpeRatio: 0.25,
    proxyETF: "DJP",
    color: "#f59e0b",
  },
  {
    name: "Crypto",
    expectedReturn: 15.0,
    volatility: 55.0,
    sharpeRatio: 0.27,
    proxyETF: "CMC20",
    color: "#f59e0b",
  },
  {
    name: "Cash",
    expectedReturn: 4.5,
    volatility: 0.5,
    sharpeRatio: 9.0,
    proxyETF: "BIL",
    color: "#94a3b8",
  },
];

export interface ProfileAllocation {
  [assetClass: string]: number; // percentage
}

export interface ProfileStats {
  expectedReturn: number;
  volatility: number;
  timeHorizon: string;
  maxDrawdown: string;
  equityPct: number;
  fixedIncomePct: number;
  alternativesPct: number;
  cashPct: number;
}

export interface Profile {
  name: string;
  allocation: ProfileAllocation;
  stats: ProfileStats;
  rationale: string;
  timeHorizon: string;
}

export type PresetKey = "conservative" | "moderate" | "aggressive";
export type ProfileKey = PresetKey | "custom";

export const PROFILES: Record<PresetKey, Profile> = {
  conservative: {
    name: "Conservative",
    timeHorizon: "1–3 years",
    rationale:
      "Capital preservation focus with heavy fixed-income weighting. Minimal equity and crypto exposure limits downside while maintaining modest real returns above inflation.",
    allocation: {
      "US Large Cap": 15,
      "Int'l Developed": 5,
      "Emerging Markets": 0,
      "US Agg Bond": 30,
      TIPS: 15,
      "High Yield": 5,
      REITs: 5,
      Commodities: 5,
      Cash: 18,
      Crypto: 2,
    },
    stats: {
      expectedReturn: 4.6,
      volatility: 5.8,
      timeHorizon: "1–3 years",
      maxDrawdown: "-8%",
      equityPct: 20,
      fixedIncomePct: 50,
      alternativesPct: 12,
      cashPct: 18,
    },
  },
  moderate: {
    name: "Moderate",
    timeHorizon: "3–7 years",
    rationale:
      "Balanced growth and income with diversified equity exposure and a meaningful crypto allocation. Fixed income provides ballast while alternatives add uncorrelated return sources.",
    allocation: {
      "US Large Cap": 25,
      "Int'l Developed": 10,
      "Emerging Markets": 5,
      "US Agg Bond": 20,
      TIPS: 5,
      "High Yield": 5,
      REITs: 8,
      Commodities: 7,
      Cash: 10,
      Crypto: 5,
    },
    stats: {
      expectedReturn: 6.4,
      volatility: 10.2,
      timeHorizon: "3–7 years",
      maxDrawdown: "-18%",
      equityPct: 40,
      fixedIncomePct: 30,
      alternativesPct: 20,
      cashPct: 10,
    },
  },
  aggressive: {
    name: "Aggressive",
    timeHorizon: "7+ years",
    rationale:
      "Maximum growth orientation with over half in equities and a significant crypto position. Minimal fixed income and cash — suited for investors with long horizons who can tolerate sharp drawdowns.",
    allocation: {
      "US Large Cap": 30,
      "Int'l Developed": 12,
      "Emerging Markets": 10,
      "US Agg Bond": 5,
      TIPS: 0,
      "High Yield": 5,
      REITs: 8,
      Commodities: 10,
      Cash: 5,
      Crypto: 15,
    },
    stats: {
      expectedReturn: 8.9,
      volatility: 16.5,
      timeHorizon: "7+ years",
      maxDrawdown: "-35%",
      equityPct: 52,
      fixedIncomePct: 10,
      alternativesPct: 33,
      cashPct: 5,
    },
  },
};

// ---------- Tooltips ----------

export const TOOLTIPS = {
  expectedReturn:
    "Weighted average of component expected returns.\nFormula: Rp = Sum(wi x Ri)\nwhere wi = allocation weight and Ri = asset class expected return.",
  volatility:
    "Portfolio volatility using the full covariance matrix.\nFormula: sigma_p = sqrt(Sum_ij(wi x wj x sigma_i x sigma_j x rho_ij))\nCaptures diversification benefit from imperfect correlations.",
  correlation:
    "Pairwise correlation coefficients between asset classes (10-year rolling averages). Values range from -1 (perfect inverse) to +1 (perfect co-movement). Low or negative correlations provide diversification benefit when combined in a portfolio.",
  sharpe:
    "Risk-adjusted return measure.\nFormula: (Rp - Rf) / sigma_p\nwhere Rf = 4.5% (Cash return).\nHigher is better — above 0.5 is considered good.",
  maxDrawdown:
    "Estimated worst-case peak-to-trough decline.\nHeuristic: -2 x portfolio volatility\nThis approximates a 95th-percentile drawdown scenario.",
  cmaReturn:
    "Long-term annualized expected return for each asset class. Based on fundamental models: earnings yield, dividend growth, valuation mean-reversion.",
  cmaVolatility:
    "Annualized standard deviation of returns. Measures the typical range of yearly outcomes. Higher vol = wider range of possible returns.",
};

// ---------- Short Labels (for heatmap axes) ----------

export const ASSET_SHORT_LABELS: Record<string, string> = {
  "US Large Cap": "US LC",
  "Int'l Developed": "Int'l Dev",
  "Emerging Markets": "EM",
  "US Agg Bond": "US Agg",
  TIPS: "TIPS",
  "High Yield": "HY",
  REITs: "REITs",
  Commodities: "Cmdty",
  Cash: "Cash",
  Crypto: "Crypto",
};

// ---------- Correlation Matrix ----------
// 10x10 symmetric matrix — order matches ASSET_CLASSES array.
// Values based on 10-year rolling historical averages (institutional CMA style).
//
// Order: US LC, Int'l Dev, EM, US Agg, TIPS, HY, REITs, Cmdty, Crypto, Cash

export const CORRELATION_MATRIX: number[][] = [
  //        US LC  Int'l   EM    Agg   TIPS   HY    REITs  Cmdty  Crypto Cash
  /* US LC */  [ 1.00,  0.88,  0.72, -0.05,  0.10,  0.62,  0.60,  0.27,  0.35, -0.02],
  /* Int'l */  [ 0.88,  1.00,  0.82, -0.02,  0.12,  0.58,  0.55,  0.32,  0.30, -0.01],
  /* EM    */  [ 0.72,  0.82,  1.00,  0.02,  0.15,  0.55,  0.48,  0.38,  0.32,  0.00],
  /* Agg   */  [-0.05, -0.02,  0.02,  1.00,  0.82, -0.10,  0.15,  0.08, -0.15,  0.25],
  /* TIPS  */  [ 0.10,  0.12,  0.15,  0.82,  1.00,  0.05,  0.20,  0.22, -0.10,  0.18],
  /* HY    */  [ 0.62,  0.58,  0.55, -0.10,  0.05,  1.00,  0.52,  0.28,  0.40, -0.05],
  /* REITs */  [ 0.60,  0.55,  0.48,  0.15,  0.20,  0.52,  1.00,  0.22,  0.25,  0.00],
  /* Cmdty */  [ 0.27,  0.32,  0.38,  0.08,  0.22,  0.28,  0.22,  1.00,  0.18, -0.05],
  /* Crypto */ [ 0.35,  0.30,  0.32, -0.15, -0.10,  0.40,  0.25,  0.18,  1.00, -0.08],
  /* Cash  */  [-0.02, -0.01,  0.00,  0.25,  0.18, -0.05,  0.00, -0.05, -0.08,  1.00],
];

// ---------- Sleeve Map ----------

export type SleeveCategory =
  | "equity"
  | "fixedIncome"
  | "alternatives"
  | "cash";

export const SLEEVE_MAP: Record<string, SleeveCategory> = {
  "US Large Cap": "equity",
  "Int'l Developed": "equity",
  "Emerging Markets": "equity",
  "US Agg Bond": "fixedIncome",
  TIPS: "fixedIncome",
  "High Yield": "fixedIncome",
  REITs: "alternatives",
  Commodities: "alternatives",
  Cash: "cash",
  Crypto: "alternatives",
};

export const SLEEVE_COLORS: Record<SleeveCategory, string> = {
  equity: "#3b82f6",
  fixedIncome: "#10b981",
  alternatives: "#f59e0b",
  cash: "#94a3b8",
};

export const SLEEVE_LABELS: Record<SleeveCategory, string> = {
  equity: "Equity",
  fixedIncome: "Fixed Income",
  alternatives: "Alternatives",
  cash: "Cash",
};

export const SLEEVE_ORDER: SleeveCategory[] = [
  "equity",
  "fixedIncome",
  "alternatives",
  "cash",
];

export const SLEEVE_CHILDREN: Record<SleeveCategory, string[]> = {
  equity: ["US Large Cap", "Int'l Developed", "Emerging Markets"],
  fixedIncome: ["US Agg Bond", "TIPS", "High Yield"],
  alternatives: ["REITs", "Commodities", "Crypto"],
  cash: ["Cash"],
};

// ---------- Portfolio Computation ----------

const RISK_FREE_RATE = 4.5;
const MAX_SINGLE_CLASS_PCT = 45;

export interface ComputedStats {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  sleeves: Record<SleeveCategory, number>;
  totalAllocation: number;
  violations: string[];
}

export function computePortfolioStats(
  allocations: Record<string, number>,
  returns: Record<string, number>,
  vols: Record<string, number>
): ComputedStats {
  const violations: string[] = [];
  let totalAlloc = 0;
  let weightedReturn = 0;

  const n = ASSET_CLASSES.length;
  const weights: number[] = new Array(n);
  const sigmas: number[] = new Array(n);

  const sleeves: Record<SleeveCategory, number> = {
    equity: 0,
    fixedIncome: 0,
    alternatives: 0,
    cash: 0,
  };

  for (let i = 0; i < n; i++) {
    const ac = ASSET_CLASSES[i];
    const w = (allocations[ac.name] ?? 0) / 100;
    weights[i] = w;
    sigmas[i] = (vols[ac.name] ?? ac.volatility) / 100; // convert % to decimal
    totalAlloc += allocations[ac.name] ?? 0;
    weightedReturn += w * (returns[ac.name] ?? ac.expectedReturn);

    const sleeve = SLEEVE_MAP[ac.name];
    if (sleeve) {
      sleeves[sleeve] += allocations[ac.name] ?? 0;
    }

    if ((allocations[ac.name] ?? 0) > MAX_SINGLE_CLASS_PCT) {
      violations.push(`${ac.name} exceeds ${MAX_SINGLE_CLASS_PCT}% limit`);
    }
  }

  if (Math.abs(totalAlloc - 100) > 0.01) {
    violations.push(`Allocations sum to ${totalAlloc.toFixed(1)}%, not 100%`);
  }

  // Covariance-based portfolio volatility:
  // sigma_p = sqrt( Sum_ij( wi * wj * sigma_i * sigma_j * rho_ij ) )
  let variance = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      variance +=
        weights[i] *
        weights[j] *
        sigmas[i] *
        sigmas[j] *
        CORRELATION_MATRIX[i][j];
    }
  }
  const portfolioVol = Math.sqrt(Math.max(variance, 0)) * 100; // back to %

  const sharpeRatio =
    portfolioVol > 0
      ? (weightedReturn - RISK_FREE_RATE) / portfolioVol
      : 0;
  const maxDrawdown = -2 * portfolioVol;

  return {
    expectedReturn: weightedReturn,
    volatility: portfolioVol,
    sharpeRatio,
    maxDrawdown,
    sleeves,
    totalAllocation: totalAlloc,
    violations,
  };
}
