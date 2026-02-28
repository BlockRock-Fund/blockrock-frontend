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
    color: "#6366f1",
  },
  {
    name: "Emerging Markets",
    expectedReturn: 8.0,
    volatility: 20.0,
    sharpeRatio: 0.4,
    proxyETF: "EEM",
    color: "#8b5cf6",
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
    color: "#14b8a6",
  },
  {
    name: "High Yield",
    expectedReturn: 5.5,
    volatility: 9.0,
    sharpeRatio: 0.61,
    proxyETF: "HYG",
    color: "#f59e0b",
  },
  {
    name: "REITs",
    expectedReturn: 6.5,
    volatility: 18.0,
    sharpeRatio: 0.36,
    proxyETF: "VNQ",
    color: "#ef4444",
  },
  {
    name: "Commodities",
    expectedReturn: 4.0,
    volatility: 16.0,
    sharpeRatio: 0.25,
    proxyETF: "DJP",
    color: "#f97316",
  },
  {
    name: "Cash",
    expectedReturn: 4.5,
    volatility: 0.5,
    sharpeRatio: 9.0,
    proxyETF: "BIL",
    color: "#94a3b8",
  },
  {
    name: "Digital Assets",
    expectedReturn: 15.0,
    volatility: 55.0,
    sharpeRatio: 0.27,
    proxyETF: "—",
    color: "#DDB110",
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
  digitalPct: number;
}

export interface Profile {
  name: string;
  allocation: ProfileAllocation;
  stats: ProfileStats;
}

export type ProfileKey = "conservative" | "moderate" | "aggressive";

export const PROFILES: Record<ProfileKey, Profile> = {
  conservative: {
    name: "Conservative",
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
      "Digital Assets": 2,
    },
    stats: {
      expectedReturn: 4.6,
      volatility: 5.8,
      timeHorizon: "1–3 years",
      maxDrawdown: "-8%",
      equityPct: 20,
      fixedIncomePct: 50,
      alternativesPct: 10,
      cashPct: 18,
      digitalPct: 2,
    },
  },
  moderate: {
    name: "Moderate",
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
      "Digital Assets": 5,
    },
    stats: {
      expectedReturn: 6.4,
      volatility: 10.2,
      timeHorizon: "3–7 years",
      maxDrawdown: "-18%",
      equityPct: 40,
      fixedIncomePct: 30,
      alternativesPct: 15,
      cashPct: 10,
      digitalPct: 5,
    },
  },
  aggressive: {
    name: "Aggressive",
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
      "Digital Assets": 15,
    },
    stats: {
      expectedReturn: 8.9,
      volatility: 16.5,
      timeHorizon: "7+ years",
      maxDrawdown: "-35%",
      equityPct: 52,
      fixedIncomePct: 10,
      alternativesPct: 18,
      cashPct: 5,
      digitalPct: 15,
    },
  },
};
