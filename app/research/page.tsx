import Link from "next/link";
import { PieChart, Activity, TrendingUp, FileText } from "lucide-react";

const analyses = [
  {
    title: "Portfolio Builder",
    description:
      "Allocation breakdowns, concentration risk, correlation matrices, and rebalancing signals.",
    icon: PieChart,
    href: "/research/portfolio-builder",
    accent: "from-accent-green to-accent-cyan",
    status: "live" as const,
  },
  {
    title: "Valuations",
    description:
      "Cashflow analysis for valuing equities and tokens.",
    icon: TrendingUp,
    href: "/research/valuations",
    accent: "from-accent-cyan to-amber-500",
    status: "live" as const,
  },
  {
    title: "AI & Markets",
    description:
      "How AI affects the economy and what it means for portfolios.",
    icon: FileText,
    href: "/research/ai-markets",
    accent: "from-amber-500 to-yellow-600",
    status: "coming-soon" as const,
  },
  {
    title: "Situation Monitor",
    description:
      "Live macro signals and prediction market odds.",
    icon: Activity,
    href: "/research/signals",
    accent: "from-accent-cyan to-accent-green",
    status: "coming-soon" as const,
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
                    <span className="text-[11px] font-medium text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 rounded-full px-2.5 py-0.5">
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
