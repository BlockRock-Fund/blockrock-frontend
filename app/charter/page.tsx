import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TableOfContents from "./toc";

/* ── tiny helpers ────────────────────────────────────────────── */
function MajorHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary mt-20 mb-2 scroll-mt-28">
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
export default function CharterPage() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        {/* ── header / cover ──────────────────────────────────── */}
        <header className="mb-14">
          <p className="font-semibold uppercase tracking-[0.25em] text-accent-cyan mb-4">
            BlockRock Charter
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-4">
            BlackRock on the Blockchain
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-5">
            The ownership fund helping people grow wealth with confidence
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-accent-cyan/60 via-accent-cyan/20 to-transparent" />
        </header>

        {/* ── body layout: TOC sidebar + prose ─────────────────── */}
        <div className="flex gap-12 items-start">
          <TableOfContents />

          <article className="min-w-0 max-w-3xl flex-1 space-y-0 [&>h2:first-child]:mt-0">
            {/* ── Summary ────────────────────────────────────────── */}
            <MajorHeading id="summary">Summary</MajorHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Asset managers (e.g. BlackRock, Vanguard, Fidelity) help people grow their wealth. But traditional asset managers suffer from structural problems that cause underperformance.
            </p>

            {/* callout */}
            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
              <p className="text-text-secondary leading-relaxed">
              <span className="text-text-primary font-bold mb-2">BlockRock</span> is an &ldquo;ownership fund&rdquo; on Solana with treasury-backed tokens, decision markets, and AI agents to help people grow wealth with confidence.
              </p>
            </div>

            {/* three pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { stat: "Ownership", label: "Who Benefits", detail: "Full-stack governance makes tokenholders first-class beneficiaries." },
                { stat: "Futarchy", label: "How Decisions Get Made", detail: "Decision markets prioritize performance. Skin-in-the-game replaces institutional politics." },
                { stat: "AI", label: "How Work Gets Done", detail: "AI enhances alpha generation. Funds scale with context and compute, not headcount." },
              ].map((d) => (
                <div key={d.label} className="glass rounded-xl p-5 text-center">
                  <p className="text-2xl font-bold text-accent-cyan mb-1">{d.stat}</p>
                  <p className="text-sm font-semibold text-text-primary mb-1">{d.label}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>

            {/* ── WHY ────────────────────────────────────────────── */}
            <MajorHeading id="why">Why: The Case for a New Kind of Asset Manager</MajorHeading>
            <p className="text-text-secondary leading-relaxed mb-10">
              The $120T+ asset management industry is broken.
            </p>

            {/* Fee Misalignment */}
            <SectionHeading id="fee-misalignment">Fee Misalignment</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-8">
              BlackRock earns ~73% of its revenue from management fees tied to AUM. These fees are collected regardless of fund performance. Performance fees account for just ~5% of revenue. This incentivizes asset accumulation over performance, consensus-driven investing, and narrative capture (e.g. BlackRock&apos;s shifting ESG stance tracking institutional clout instead of investment merit).
            </p>

            {/* Regulatory Restrictions */}
            <SectionHeading id="regulatory-restrictions">Regulatory Restrictions</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Dense multi-jurisdictional regulation hinders performance. Compliance delays action, fiduciary standards push for conservative allocations, and cross-border restrictions fragment strategy. The gap between how capital <em>should</em> move and how it <em>can</em> move is a compounding drag on returns.
            </p>

            {/* Organizational Complexity */}
            <SectionHeading id="organizational-complexity">Organizational Complexity</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Sprawling hierarchies create bureaucratic bloat. Decisions pass through committees, internal politics shape strategy, and huge operational costs reinforce the pressure to prioritize asset gathering. BlackRock has 20,000+ employees, 70+ global offices, and 1,700+ ETFs.
            </p>

            {/* The Death Spiral */}
            <SectionHeading id="death-spiral">The Death Spiral</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              These problems reinforce each other in a negative cycle:
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
              <p className="text-text-secondary leading-relaxed">
                fee model incentivizes scale &rarr; scale demands complexity &rarr; complexity invites compliance &rarr; fee model + complexity + compliance = worse decisions &rarr; bad decisions reduce performance &rarr; fees come in anyway
              </p>
            </div>

            <p className="text-accent-cyan font-semibold leading-relaxed mb-8">
              Traditional asset managers remain mediocre at the job investors hire them for. Most actively managed funds underperform their benchmarks, especially after fees.
            </p>

            {/* Why Now */}
            <SectionHeading id="why-now">Why Now</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-10">
              Converging forces are opening a window of opportunity for a new kind of asset manager.
            </p>

            {/* Peak Uncertainty */}
            <SubHeading>Peak Uncertainty</SubHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Investment conviction is at an all-time low. Growing (let alone preserving) wealth is more difficult, time-consuming, and anxiety-inducing than ever.
            </p>

            <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-10">
              <li>Stocks ranging at all-time highs</li>
              <li>Precious metals swinging more violently than ever</li>
              <li>USD reserve status being questioned</li>
              <li>AI threatening to displace white-collar work</li>
              <li>Crypto underperforming expectations</li>
            </ul>

            {/* Ownership Infrastructure */}
            <SubHeading>Ownership Infrastructure</SubHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              MetaDAO&apos;s permissionless launchpad lets anyone launch an &quot;ownership coin&quot; whose value is tied to a futarchy-governed treasury. This infrastructure is battle-tested and soon becoming publicly available.
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              In 2025, MtnCapital launched an ownership fund on MetaDAO, positioned as an early-stage VC fund. But it struggled to pass proposals and eventually wound down. private VC deals are difficult to price with asymmetric information, long timelines, and binary outcomes.
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              Futarchy governance works by letting markets price competing outcomes, but private VC deals are difficult to price with asymmetric information, long timelines, and binary outcomes.
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              Liquid asset allocation for risk-adjusted returns gives futarchy the pricing efficiency it requires. Decision markets can evaluate portfolio construction, yield strategies, and value accrual more effectively than illiquid VC bets.
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              Proof of safety: When MtnCapital wound down, holders received their proportional share of
              the treasury through the protocol&apos;s built-in liquidation mechanism. The
              system&apos;s guarantees worked as intended. Even in
              failure, no value was lost to extraction or mismanagement.
            </p>

            {/* Onchain Assets */}
            <SubHeading>Onchain Assets</SubHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              The universe of investable assets on Solana is expanding rapidly. Spot markets, perpetual futures, lending markets, structured yield products, and RWAs (tokenized stocks, bonds, commodities, etc.) are accessible onchain with deep liquidity and composable infrastructure.
            </p>

            <p className="text-text-secondary leading-relaxed mb-10">
              A fund operating entirely onchain is no longer limited to a handful of tokens. The breadth of positions available now rivals what traditional asset managers can access, without the friction.
            </p>

            {/* ── HOW ────────────────────────────────────────────── */}
            <MajorHeading id="how">How: BlockRock&apos;s Principles</MajorHeading>
            <p className="text-text-secondary leading-relaxed mb-10">
              BlockRock manages assets with a new system where incentives, governance, and execution are rebuilt from first principles.
            </p>

            {/* Layer 1: Ownership */}
            <SectionHeading id="ownership">Ownership</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-2">
              <strong className="text-text-primary">Who benefits</strong>
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              Tokenholders are the primary beneficiaries of fund performance via treasury backing. Minimal management fees are funded transparently from the treasury and adjustable via governance. No percentage-based skimming.
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              Tokens also enable borderless access. Anyone with a wallet can hold the token, bypassing the geographic and accreditation barriers of traditional funds.
            </p>

            {/* Layer 2: Futarchy Governance */}
            <SectionHeading id="futarchy">Futarchy</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-2">
              <strong className="text-text-primary">How decisions get made</strong>
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              Governance uses conditional decision markets. When a proposal enters, two markets open: one pricing the token if the proposal is adopted, another if rejected. At the end of the period, the condition with the highest time-weighted average price wins.
            </p>

            <ul className="list-disc pl-5 space-y-3 text-text-secondary leading-relaxed mb-8">
              <li><strong className="text-text-primary">Replaces committees with markets.</strong> No boardroom politics, no career risk aversion, no consensus-seeking. Decisions are priced by participants with capital at stake to maximize risk-adjusted returns.</li>
              <li><strong className="text-text-primary">Operates continuously.</strong> Speed of capital movement matches speed of opportunity.</li>
              <li><strong className="text-text-primary">Reinforces incentive alignment.</strong> Because participants are token-holders pricing outcomes, the governance layer inherits the ownership layer&apos;s alignment. Self-interested pricing incentivizes better decision-making.</li>
            </ul>

            {/* Layer 3: AI Agents */}
            <SectionHeading id="ai">AI</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-2">
              <strong className="text-text-primary">How work gets done</strong>
            </p>

            <p className="text-text-secondary leading-relaxed mb-4">
              AI agents act as always-on analysts, ingesting live data, market signals, and macro context to generate a continuous stream of proposals. Critically:
            </p>

            <ul className="list-disc pl-5 space-y-3 text-text-secondary leading-relaxed mb-6">
              <li><strong className="text-text-primary">They propose, never execute.</strong> AI agents have no authority to force decisions &mdash; only to submit ideas to the governance layer. Their proposals compete with human submissions on equal footing.</li>
              <li><strong className="text-text-primary">They are judged purely by market pricing.</strong> No institutional bias filters their ideas. Good proposals win regardless of source.</li>
              <li><strong className="text-text-primary">They scale with compute, not headcount.</strong> As AI capabilities grow, the fund&apos;s capability grows too. With minimal overhead.</li>
            </ul>

            {/* Positive Flywheel */}
            <SectionHeading id="positive-flywheel">The Positive Flywheel</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlockRock inverts the traditional cycle of bloat and extraction:
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
              <p className="text-text-secondary leading-relaxed">
                token ownership &rarr; better-incentivized market participants &rarr; more accurate futarchy &rarr; better proposal filtering &rarr; stronger performance &rarr; higher token value &rarr; more token ownership
              </p>
            </div>

            {/* The Resulting User Experience */}
            <SectionHeading id="user-experience">The Resulting User Experience</SectionHeading>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { label: "Passive Holders", detail: "Enjoy increasing treasury-backed value with secure structure, bullish decision-making, and minimal value leakage." },
                { label: "Active Investors", detail: "Submit proposals, trade decision markets, and profit for accurate judgment." },
              ].map((d) => (
                <div key={d.label} className="glass rounded-xl p-5">
                  <p className="text-base font-semibold text-accent-cyan mb-2">{d.label}</p>
                  <p className="text-text-secondary leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>

            {/* ── WHAT ───────────────────────────────────────────── */}
            <MajorHeading id="what">What: BlockRock in Practice</MajorHeading>
            <p className="text-text-secondary leading-relaxed mb-10">
              The playbook for launching, operating, and scaling BlockRock.
            </p>

            {/* Launch */}
            <SectionHeading id="launch">Launch</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlockRock funds launch via ICO on MetaDAO&apos;s permissionless launchpad, which provides full-stack futarchy governance with legal enforcement, so that token value is tied to treasury value.
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlockRock&apos;s Flagship Fund launches first with a mandate for a moderate risk strategy to maximize Sortino ratio (penalizing downside volatility) by allocating the treasury into a portfolio of onchain positions. 95% of tokens are distributed to ICO participants at the same price. The remaining 5% is allocated to the founding team, which unlocks at 30-day TWAPs of 2X, 4X, 8X, 16X, and 32X the ICO price. An $8K allowance per month is allocated to the team for supporting infrastructure.
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlockRock may launch additional funds in the future, each with a unique mandate and risk profile.
            </p>

            {/* Operations */}
            <SectionHeading id="operations">Operations</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Every fund operation follows the same decision cycle:
            </p>

            <div className="space-y-4 mb-10">
              {[
                { num: "1", title: "Proposal enters", body: "An AI agent or human submits a proposal to the governance layer." },
                { num: "2", title: "Conditional markets open", body: "Two markets price the token: one if the proposal passes, one if it fails." },
                { num: "3", title: "Markets resolve", body: "After the voting period, the outcome with the higher time-weighted average price wins and is automatically executed. Traders who priced the winning outcome correctly profit." },
              ].map((p) => (
                <div key={p.num} className="glass rounded-xl p-5 flex gap-4">
                  <span className="text-2xl font-bold text-accent-cyan shrink-0">{p.num}</span>
                  <div>
                    <p className="text-text-primary font-semibold mb-1">{p.title}</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Distributions */}
            <SectionHeading id="distribution">Distributions</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Any token holder can submit a proposal to distribute value to holders via buybacks, dividends, or liquidation. If the decision market resolves in favor of a distribution, the treasury is automatically distributed according to the proposal.
            </p>

            {/* Communications */}
            <SectionHeading id="communications">Communications</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlockRock is a spectator sport. Everyday, anyone interested in financial markets can check BlockRock to see strategists proposing investment theses, traders battling to approve or reject proposals, and the fund&apos;s portfolio growing in lockstep with the token. Every decision market resolution is an official verdict, automatically executed by smart contracts. Updates are shared on X (Twitter) via @blockrockfund.
            </p>

            {/* Scaling */}
            <SectionHeading id="scaling">Scaling</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              BlockRock is designed to scale to trillions in assets under management. The token&apos;s mint authority is governed by futarchy. So decision markets can approve additional fundraises with new token mints, while avoiding unfair dilution. BlockRock funds expand when governance deems it bullish.
            </p>

            {/* ── Disclaimer ──────────────────────────────────── */}
            <div className="border-t border-glass-border pt-6">
              <p className="text-text-secondary text-sm leading-relaxed italic">
                This charter is for informational purposes only. It does not constitute investment advice, a recommendation, or an offer to buy or sell any security or token. Cryptocurrency investments are highly volatile and carry significant risk. Consult a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
