import Link from "next/link";
import { Activity, TrendingUp, Layers, FileText, PieChart } from "lucide-react";

const modules = [
  {
    title: "Situation Monitor",
    description:
      "Birds-eye view of hot assets, prediction markets, tweets, and live news. The terminal for staying ahead.",
    icon: Activity,
    href: "/situation-monitor",
  },
  {
    title: "Valuations",
    description:
      "Cashflow analysis across tokens and equities — revenue multiples, earnings yield, and treasury coverage.",
    icon: TrendingUp,
    href: "/valuations",
  },
  {
    title: "Strategy",
    description:
      "Factor-driven allocation engine with regime detection, backtests, and live target weights.",
    icon: Layers,
    href: "/strategy",
  },
  {
    title: "AI & Markets",
    description:
      "How AI affects the economy and what it means for portfolio construction — synthesized from 15+ primary sources.",
    icon: FileText,
    href: "/ai-markets",
  },
  {
    title: "Portfolio Builder",
    description:
      "Allocation modeling with correlation matrices, risk/return scatter, and custom profile presets.",
    icon: PieChart,
    href: "/portfolio-builder",
  },
];

export default function ResearchSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.title} href={mod.href} className="block group">
                <div className="gradient-border rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] glow-cyan-hover cursor-pointer">

                  {/* Icon row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-bg-tertiary/50">
                      <Icon className="w-5 h-5 text-accent-cyan" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-accent-green bg-accent-green/10 border border-accent-green/20 rounded-full px-2.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">
                    {mod.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed flex-1">
                    {mod.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-5 pt-4 border-t border-glass-border">
                    <span className="text-sm font-medium text-accent-cyan group-hover:underline">
                      Open →
                    </span>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>


      </div>
    </section>
  );
}
