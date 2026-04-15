export const MOCK_NAV_HISTORY = [
  { month: "Apr '25", vault: 100.0, benchmark: 100.0 },
  { month: "May '25", vault: 103.2, benchmark: 102.1 },
  { month: "Jun '25", vault: 107.8, benchmark: 105.4 },
  { month: "Jul '25", vault: 105.1, benchmark: 99.2 },
  { month: "Aug '25", vault: 109.4, benchmark: 101.8 },
  { month: "Sep '25", vault: 112.6, benchmark: 103.5 },
  { month: "Oct '25", vault: 110.2, benchmark: 96.4 },
  { month: "Nov '25", vault: 114.8, benchmark: 100.2 },
  { month: "Dec '25", vault: 118.1, benchmark: 104.7 },
  { month: "Jan '26", vault: 116.3, benchmark: 101.3 },
  { month: "Feb '26", vault: 120.5, benchmark: 106.1 },
  { month: "Mar '26", vault: 122.4, benchmark: 108.3 },
];

export const MOCK_DRAWDOWN = [
  { month: "Apr '25", vault: 0, benchmark: 0 },
  { month: "May '25", vault: 0, benchmark: 0 },
  { month: "Jun '25", vault: 0, benchmark: 0 },
  { month: "Jul '25", vault: -2.5, benchmark: -5.9 },
  { month: "Aug '25", vault: 0, benchmark: -3.4 },
  { month: "Sep '25", vault: 0, benchmark: -1.8 },
  { month: "Oct '25", vault: -2.1, benchmark: -8.5 },
  { month: "Nov '25", vault: 0, benchmark: -4.9 },
  { month: "Dec '25", vault: 0, benchmark: -0.7 },
  { month: "Jan '26", vault: -1.5, benchmark: -3.9 },
  { month: "Feb '26", vault: 0, benchmark: -0.5 },
  { month: "Mar '26", vault: 0, benchmark: 0 },
];

export const MOCK_MONTHLY_RETURNS = [
  { month: "Apr '25", vault: 0.0, benchmark: 0.0 },
  { month: "May '25", vault: 3.2, benchmark: 2.1 },
  { month: "Jun '25", vault: 4.5, benchmark: 3.2 },
  { month: "Jul '25", vault: -2.5, benchmark: -5.9 },
  { month: "Aug '25", vault: 4.1, benchmark: 2.6 },
  { month: "Sep '25", vault: 2.9, benchmark: 1.7 },
  { month: "Oct '25", vault: -2.1, benchmark: -6.9 },
  { month: "Nov '25", vault: 4.2, benchmark: 3.9 },
  { month: "Dec '25", vault: 2.9, benchmark: 4.5 },
  { month: "Jan '26", vault: -1.5, benchmark: -3.2 },
  { month: "Feb '26", vault: 3.6, benchmark: 4.7 },
  { month: "Mar '26", vault: 1.6, benchmark: 2.1 },
];

export const MOCK_RISK_METRICS = {
  totalReturn: 22.4,
  sharpe: 1.62,
  sortino: 2.1,
  maxDrawdown: -2.5,
  alpha: 14.1,
  winRate: 75,
  volatility: 12.8,
  beta: 0.58,
  calmar: 1.72,
  informationRatio: 1.05,
  benchmarkReturn: 8.3,
};
