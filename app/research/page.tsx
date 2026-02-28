import Link from "next/link";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Coins,
  ShieldCheck,
  Activity,
  Layers,
  FileText,
} from "lucide-react";

const analyses = [
  {
    title: "Valuation Models",
    description:
      "Cashflow analysis for valuing equities and tokens.",
    icon: TrendingUp,
    href: "/research/cashflows",
    accent: "from-accent-cyan to-amber-500",
    status: "live" as const,
  },
  {
    title: "Portfolio Construction",
    description:
      "Allocation breakdowns, concentration risk, correlation matrices, and rebalancing signals.",
    icon: PieChart,
    href: "/research/portfolio",
    accent: "from-accent-green to-accent-cyan",
    status: "live" as const,
  },
  {
    title: "AI & Markets",
    description:
      "How artificial intelligence will reshape the economy and what it means for portfolios.",
    icon: FileText,
    href: "/research/ai-markets",
    accent: "from-amber-500 to-yellow-600",
    status: "live" as const,
  },
  {
    title: "Market Structure",
    description:
      "Liquidity depth, order flow, volume profiles, and market microstructure analysis.",
    icon: BarChart3,
    href: "/research/market-structure",
    accent: "from-accent-blue to-accent-purple",
    status: "soon" as const,
  },
  {
    title: "Token Supply",
    description:
      "Emission schedules, unlock timelines, circulating vs. fully diluted supply tracking.",
    icon: Coins,
    href: "/research/supply",
    accent: "from-amber-500 to-accent-cyan",
    status: "soon" as const,
  },
  {
    title: "Risk Metrics",
    description:
      "Smart contract risk scores, audit history, economic attack surface, and insurance coverage.",
    icon: ShieldCheck,
    href: "/research/risk",
    accent: "from-red-400 to-accent-purple",
    status: "soon" as const,
  },
  {
    title: "On-chain Activity",
    description:
      "Active addresses, transaction volumes, developer activity, and usage growth trends.",
    icon: Activity,
    href: "/research/onchain",
    accent: "from-accent-green to-emerald-400",
    status: "soon" as const,
  },
  {
    title: "Sector Comparison",
    description:
      "Cross-sector benchmarking across DeFi, L1/L2, infrastructure, and application layers.",
    icon: Layers,
    href: "/research/sectors",
    accent: "from-accent-cyan to-accent-blue",
    status: "soon" as const,
  },
];

export default function AnalysisPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Research
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Institutional-grade research for managing BlockRock funds.
            Deep-dive into fundamentals, risk, and market dynamics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {analyses.map((item) => {
            const Icon = item.icon;
            const isLive = item.status === "live";

            const card = (
              <div
                className={`gradient-border rounded-2xl p-6 transition-all duration-300 group h-full flex flex-col ${
                  isLive
                    ? "hover:scale-[1.02] cursor-pointer"
                    : "opacity-60 cursor-default"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-bg-tertiary/50">
                    <Icon className="w-5 h-5 text-accent-cyan" />
                  </div>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-accent-green bg-accent-green/10 border border-accent-green/20 rounded-full px-2.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-text-muted bg-bg-tertiary/50 border border-glass-border rounded-full px-2.5 py-0.5">
                      Coming Soon
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {item.description}
                </p>

                {isLive && (
                  <div className="mt-4 pt-3 border-t border-glass-border">
                    <span className="text-sm font-medium text-accent-cyan group-hover:underline">
                      Open →
                    </span>
                  </div>
                )}
              </div>
            );

            if (isLive) {
              return (
                <Link key={item.title} href={item.href} className="block">
                  {card}
                </Link>
              );
            }

            return <div key={item.title}>{card}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
