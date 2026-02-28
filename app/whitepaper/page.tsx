import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TableOfContents from "./toc";

/* ── tiny helpers ────────────────────────────────────────────── */
function MajorHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-accent-cyan mt-20 mb-2 scroll-mt-28">
      {children}
    </h2>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mt-14 mb-6 scroll-mt-28">
      {children}
    </h3>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-lg font-semibold text-text-primary mb-4">{children}</h4>
  );
}

/* ── page ────────────────────────────────────────────────────── */
export default function WhitepaperPage() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        {/* ── header / cover ──────────────────────────────────── */}
        <header className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-cyan mb-4">
            BlockRock Whitepaper
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-4">
            BlackRock on the Blockchain
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-5">
            Ownership funds on Solana using fair-launched tokens, decision markets, and AI agents.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <span>2025</span>
            <span className="hidden sm:inline text-glass-border">|</span>
            <span className="text-accent-cyan/80 font-medium">Whitepaper</span>
          </div>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-accent-cyan/60 via-accent-cyan/20 to-transparent" />
        </header>

        {/* ── body layout: TOC sidebar + prose ─────────────────── */}
        <div className="flex gap-12 items-start">
          <TableOfContents />

          <article className="min-w-0 max-w-3xl flex-1 space-y-0">
            {/* ── Summary ────────────────────────────────────────── */}
            <MajorHeading id="summary">Summary</MajorHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlackRock is the world&apos;s largest asset manager with $14T+ AUM. Asset managers (e.g. BlackRock, Vanguard, Fidelity) help people grow their wealth. But traditional asset managers suffer from three structural problems &mdash; fee misalignment, regulatory restrictions, and organizational complexity &mdash; causing downstream effects like underperformance, high fees, narrative capture, bureaucracy, and user friction.
            </p>

            {/* callout */}
            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
              <p className="text-text-primary font-semibold mb-2">BlockRock</p>
              <p className="text-text-secondary leading-relaxed">
                &ldquo;Ownership funds&rdquo; on Solana that use fair-launched tokens, decision markets (futarchy), and AI agents to deliver asset management with performance-aligned incentives, unrestricted access, and organizational scalability &mdash; helping more people grow their wealth with confidence and convenience.
              </p>
            </div>

            {/* three pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { stat: "Tokens", label: "Performance-Aligned Incentives", detail: "Fair-launched tokens make holders first-class beneficiaries. No value leaks to management or VCs." },
                { stat: "Futarchy", label: "Unrestricted Access", detail: "Onchain operations bypass jurisdictional bottlenecks. Decision markets replace committees." },
                { stat: "AI Agents", label: "Organizational Scalability", detail: "AI replaces human infrastructure. The fund scales with compute, not headcount." },
              ].map((d) => (
                <div key={d.label} className="glass rounded-xl p-5 text-center">
                  <p className="text-2xl font-bold text-accent-cyan mb-1">{d.stat}</p>
                  <p className="text-sm font-semibold text-text-primary mb-1">{d.label}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>

            {/* ── WHY ────────────────────────────────────────────── */}
            <MajorHeading id="why">Why: The Case for a New Kind of Asset Manager</MajorHeading>
            <p className="text-text-secondary leading-relaxed mb-10">
              The $120T+ asset management industry runs on a broken model. Three structural problems compound into persistent investor harm.
            </p>

            {/* Fee Misalignment */}
            <SectionHeading id="fee-misalignment">Fee Misalignment</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlackRock earns ~73% of its revenue from management fees tied to AUM. These fees are collected regardless of fund performance. Performance fees account for just ~5% of revenue.
            </p>

            <p className="text-text-secondary leading-relaxed mb-4">
              This incentivizes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-8">
              <li><strong className="text-text-primary">Asset gathering over generating returns</strong></li>
              <li><strong className="text-text-primary">Consensus-driven investing</strong></li>
              <li><strong className="text-text-primary">Career risk aversion</strong></li>
              <li><strong className="text-text-primary">Narrative capture</strong> &mdash; e.g. BlackRock&apos;s shifting ESG stance tracking institutional demand rather than investment merit</li>
            </ul>

            {/* Regulatory Restrictions */}
            <SectionHeading id="regulatory-restrictions">Regulatory Restrictions</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Dense multi-jurisdictional regulation hinders performance. Compliance layers delay action, fiduciary standards push for conservative allocations, and cross-border restrictions fragment strategy.
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-amber-500/60 mb-8">
              <p className="text-text-secondary leading-relaxed">
                The gap between how fast capital <em>should</em> move and how fast it <em>can</em> move is a compounding drag on returns.
              </p>
            </div>

            {/* Organizational Complexity */}
            <SectionHeading id="organizational-complexity">Organizational Complexity</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Sprawling hierarchies create bureaucratic bloat. Decisions pass through committees, internal politics shape strategy, and a huge operational costs reinforce the pressure to prioritize asset gathering. For example, BlackRock:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { stat: "20,000+", label: "Employees" },
                { stat: "70+", label: "Global Offices" },
                { stat: "1,700+", label: "ETFs (Noise, Not Clarity)" },
              ].map((d) => (
                <div key={d.label} className="glass rounded-xl p-5 text-center">
                  <p className="text-2xl font-bold text-accent-cyan mb-1">{d.stat}</p>
                  <p className="text-sm font-semibold text-text-primary">{d.label}</p>
                </div>
              ))}
            </div>

            {/* The Death Spiral */}
            <SectionHeading id="death-spiral">The Death Spiral</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              These problems reinforce each other in a self-perpetuating cycle:
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-red-500/60 mb-8">
              <p className="text-text-secondary leading-relaxed">
                Fee models incentivize scale &rarr; Scale demands complexity &rarr; Complexity invites conservative compliance &rarr; Compliance slows decisions &rarr; Slow decisions reduce performance &rarr; Fees come in anyway.
              </p>
              <p className="text-text-primary font-semibold mt-4">
                The industry remains structurally mediocre at the job investors hire it for.
              </p>
            </div>

            {/* Why Now */}
            <SectionHeading id="why-now">Why Now: Peak Uncertainty</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Investment conviction is at an all-time low. Growing &mdash; let alone preserving &mdash; wealth is more difficult, time-consuming, and anxiety-inducing than ever.
            </p>

            <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-10">
              <li>Stocks ranging at all-time highs</li>
              <li>Precious metals swinging more violently than ever</li>
              <li>USD reserve status being questioned</li>
              <li>AI threatening to displace white-collar work</li>
              <li>Crypto getting mogged</li>
            </ul>

            {/* ── HOW ────────────────────────────────────────────── */}
            <MajorHeading id="how">How: BlockRock&apos;s Architecture</MajorHeading>
            <p className="text-text-secondary leading-relaxed mb-10">
              BlockRock addresses each root cause with a purpose-built mechanism.
            </p>

            {/* Token-Based Ownership */}
            <SectionHeading id="token-ownership">Token-Based Ownership: Solving Fee Misalignment</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              A fair-launched Solana token makes holders first-class beneficiaries. No value leaks to management or VCs. Token value is tied to fund performance, aligning incentives.
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
              <div className="flex items-start gap-4">
                <span className="text-3xl font-bold text-accent-cyan/60 shrink-0">$</span>
                <div>
                  <p className="text-text-primary font-semibold mb-1">Problem &rarr; Solution</p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    AUM-based fees that reward asset gathering regardless of performance &rarr; Token ownership where value is directly tied to fund performance.
                  </p>
                </div>
              </div>
            </div>

            {/* Futarchy Governance */}
            <SectionHeading id="futarchy-governance">Futarchy Governance: Solving Regulatory Restrictions</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Onchain operations bypass jurisdictional bottlenecks. Governance uses conditional decision markets: proposals trigger two markets pricing the fund&apos;s expected value if passed vs. failed. The higher-priced outcome wins.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { trait: "Fast", desc: "No committee delays or multi-jurisdiction compliance cycles" },
                { trait: "Continuous", desc: "Markets operate 24/7, not quarterly" },
                { trait: "Resistant to drift", desc: "Decisions are priced by participants with skin in the game, not shaped by institutional politics" },
              ].map((t) => (
                <div key={t.trait} className="glass rounded-xl p-4 flex gap-3 items-start">
                  <span className="text-accent-cyan font-bold text-sm shrink-0">&bull;</span>
                  <div>
                    <span className="text-text-primary font-semibold">{t.trait}:</span>{" "}
                    <span className="text-text-secondary text-sm">{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Agents */}
            <SectionHeading id="ai-agents">AI Agents: Solving Organizational Complexity</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              AI agents replace the human infrastructure of analysts, portfolio managers, and committees. They continuously generate proposals &mdash; rebalancing, yield opportunities, risk strategies &mdash; which the decision markets then evaluate.
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
              <p className="text-text-primary font-semibold mb-2">Key insight:</p>
              <p className="text-text-secondary leading-relaxed">
                This separates <strong className="text-text-primary">idea generation</strong> from <strong className="text-text-primary">idea evaluation</strong>, eliminating political dynamics. The fund scales with context and compute, not headcount.
              </p>
            </div>

            {/* Positive Flywheel */}
            <SectionHeading id="positive-flywheel">The Positive Flywheel</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlockRock inverts the traditional cycle of bloat and extraction:
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-accent-green/60 mb-10">
              <p className="text-text-secondary leading-relaxed">
                Token ownership &rarr; better-incentivized market participants &rarr; more accurate futarchy &rarr; better AI proposal filtering &rarr; stronger performance &rarr; higher token value &rarr; more sophisticated participants.
              </p>
              <p className="text-text-primary font-semibold mt-4">
                Minimal overhead means more returns flow to holders.
              </p>
            </div>

            {/* ── WHAT ───────────────────────────────────────────── */}
            <MajorHeading id="what">What: BlockRock in Practice</MajorHeading>
            <p className="text-text-secondary leading-relaxed mb-10">
              Inner workings of BlockRock&apos;s architecture.
            </p>

            {/* Tokenomics */}
            <SectionHeading id="tokenomics">Tokenomics</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              A fund is bootstrapped with an ICO on MetaDAO&apos;s Futardio launchpad for full-stack un-ruggability and futarchy governance of the treasury. Each fund is issued with a mandate to guide the treasury&apos;s investment into a basket of onchain assets.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold">Feature</th>
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold">Detail</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 px-4 font-medium text-text-primary">Launch</td>
                    <td className="py-3 px-4">ICO on MetaDAO&apos;s Futardio launchpad</td>
                  </tr>
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 px-4 font-medium text-text-primary">Asset Types</td>
                    <td className="py-3 px-4">Spot holdings, lend/borrow positions, futures positions, LP positions</td>
                  </tr>
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 px-4 font-medium text-text-primary">Value Accrual</td>
                    <td className="py-3 px-4">100% to tokenholders via treasury value &rarr; token liquidation value</td>
                  </tr>
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 px-4 font-medium text-text-primary">Management Fees</td>
                    <td className="py-3 px-4">None</td>
                  </tr>
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 px-4 font-medium text-text-primary">Performance Fees</td>
                    <td className="py-3 px-4">None</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">Operational Costs</td>
                    <td className="py-3 px-4">Minimal (compute + infrastructure), funded transparently from treasury</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* The Decision Cycle */}
            <SectionHeading id="decision-cycle">The Decision Cycle</SectionHeading>

            <div className="space-y-4 mb-10">
              {[
                { num: "1", title: "Proposal enters", body: "From AI agent or human participant." },
                { num: "2", title: "Conditional decision markets open", body: "One market prices the token if adopted, another if rejected." },
                { num: "3", title: "Markets resolve", body: "The higher-priced outcome is automatically executed." },
                { num: "4", title: "Correct traders profit", body: "Accurate judgment is rewarded, creating a meritocratic feedback loop." },
              ].map((p) => (
                <div key={p.num} className="glass rounded-xl p-5 flex gap-4">
                  <span className="text-2xl font-bold text-accent-cyan/60 shrink-0">{p.num}</span>
                  <div>
                    <p className="text-text-primary font-semibold mb-1">{p.title}</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* The AI Layer */}
            <SectionHeading id="ai-layer">The AI Layer</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              AI agents act as always-on analysts, ingesting on-chain data, market signals, and macro context to generate a continuous stream of proposals.
            </p>

            <ul className="list-disc pl-5 space-y-3 text-text-secondary leading-relaxed mb-8">
              <li><strong className="text-text-primary">No authority to execute</strong> &mdash; only to propose. Their ideas compete with human submissions on equal footing.</li>
              <li><strong className="text-text-primary">Judged purely by market pricing</strong> &mdash; no institutional bias or politics in evaluation.</li>
              <li><strong className="text-text-primary">Automatically expanding</strong> &mdash; as AI capabilities improve, the fund&apos;s strategic surface area expands automatically.</li>
            </ul>

            {/* The Resulting User Experience */}
            <SectionHeading id="user-experience">The Resulting User Experience</SectionHeading>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { label: "Passive Holders", detail: "Benefit from fund performance. Minimal value leakage (only trading fees). Transparent decisions. Secure architecture." },
                { label: "Active Investors", detail: "Submit proposals, trade in decision markets, and profit for accurate judgment." },
              ].map((d) => (
                <div key={d.label} className="glass rounded-xl p-5">
                  <p className="text-base font-semibold text-accent-cyan mb-2">{d.label}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-10">
              <p className="text-text-primary font-semibold text-lg leading-relaxed">
                The structural foundation &mdash; ownership alignment, market-driven decisions, and automation &mdash; remains constant as the fund evolves.
              </p>
            </div>

            {/* ── Disclaimer ──────────────────────────────────── */}
            <div className="border-t border-glass-border pt-6">
              <p className="text-text-muted text-xs leading-relaxed italic">
                This whitepaper is for informational and educational purposes only. It does not constitute investment advice, a recommendation, or an offer to buy or sell any security or token. Cryptocurrency investments are highly volatile and carry significant risk. Consult a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
