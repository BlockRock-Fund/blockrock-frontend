import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TableOfContents from "./toc";

/* ── tiny helpers ────────────────────────────────────────────── */
function Badge({ children, variant }: { children: React.ReactNode; variant: "positive" | "negative" | "mixed" }) {
  const colors = {
    positive: "bg-accent-green/15 text-accent-green border-accent-green/25",
    negative: "bg-red-500/15 text-red-400 border-red-500/25",
    mixed: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  };
  return (
    <span className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${colors[variant]}`}>
      {children}
    </span>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-16 mb-6 scroll-mt-28">
      {children}
    </h2>
  );
}

/* ── page ────────────────────────────────────────────────────── */
export default function AIMarketsPage() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* back link */}
        <Link href="/research" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Research
        </Link>

        {/* ── header / cover ──────────────────────────────────── */}
        <header className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-cyan mb-4">
            BlockRock Research
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-4">
            AI &amp; The Economy
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-5">
            Implications for markets and portfolio construction.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <span>February 2026</span>
            <span className="hidden sm:inline text-glass-border">|</span>
            <span className="text-accent-cyan/80 font-medium">Research Synthesis</span>
          </div>
          <p className="text-xs text-text-muted mt-3 italic">
            Synthesized from 15+ primary sources including Citrini Research, Citadel Securities, Morgan Stanley, Bain &amp; Company, Goldman Sachs, the Federal Reserve, BLS, and Gallup
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-accent-cyan/60 via-accent-cyan/20 to-transparent" />
        </header>

        {/* ── body layout: TOC sidebar + prose ─────────────────── */}
        <div className="flex gap-12 items-start">
          <TableOfContents />

          <article className="min-w-0 max-w-3xl flex-1 space-y-0">
            {/* ── Executive Summary ────────────────────────────── */}
            <SectionHeading id="executive-summary">Executive Summary</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              Artificial intelligence is repricing the economy in real time. U.S. labor share of GDP fell to 53.8% in Q3 2025, the lowest reading since 1947, while nonfarm productivity growth surged to 4.9% annualized. Corporate profits hit record highs as hiring slowed sharply. The central question is whether abundant machine intelligence will produce a deflationary boom that raises living standards, or a displacement spiral that collapses consumer demand faster than markets can adapt.
            </p>

            {/* callout */}
            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
              <p className="text-text-primary font-semibold mb-2">Core finding:</p>
              <p className="text-text-secondary leading-relaxed">
                Current data favors a gradual transition (5&ndash;15 years) over an acute crisis (2&ndash;3 years). But markets are already imposing crisis-speed repricing on software and intermediation businesses, creating real winners and losers regardless of which macro scenario materializes.
              </p>
            </div>

            {/* three dynamics */}
            <h3 className="text-lg font-semibold text-text-primary mb-4">Three dynamics are occurring simultaneously:</h3>
            <ul className="list-disc pl-5 space-y-3 text-text-secondary leading-relaxed mb-8">
              <li><strong className="text-text-primary">A structural repricing of SaaS and white-collar-dependent business models</strong> that is already well advanced, with $285 billion in single-day market cap destruction following AI product launches.</li>
              <li><strong className="text-text-primary">A genuine productivity acceleration</strong> that is real but concentrated in a narrow set of industries, with gains running roughly 2.5 percentage points above the pre-pandemic trend.</li>
              <li><strong className="text-text-primary">A speculative narrative about macro collapse</strong> that has limited supporting data: unemployment remains 4.3%, initial claims are 212K/week, and adoption intensity shows no inflection.</li>
            </ul>

            {/* three key data points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { stat: "53.8%", label: "Labor Share of GDP", detail: "Record low since 1947. Down from 55.6% decade average. Productivity gains accruing to capital, not labor." },
                { stat: "38%", label: "AI Adoption (Flat QoQ)", detail: "Gallup Q4 2025. Half of U.S. workers have never used AI at work. Adoption is linear, not exponential." },
                { stat: "4.3%", label: "Unemployment", detail: "Initial claims 212K/week. Cooling but not cracking. Displacement is a risk, not a current reality." },
              ].map((d) => (
                <div key={d.label} className="glass rounded-xl p-5 text-center">
                  <p className="text-2xl font-bold text-accent-cyan mb-1">{d.stat}</p>
                  <p className="text-sm font-semibold text-text-primary mb-1">{d.label}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>

            {/* ── What the Data Shows ──────────────────────────── */}
            <SectionHeading id="what-the-data-shows">What the Data Actually Shows</SectionHeading>

            <h3 className="text-lg font-semibold text-text-primary mb-4">The White-Collar Labor Market</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The white-collar recession is real and predates current AI capabilities. Finance, insurance, information, and professional services have cut jobs on net for three years despite solid GDP growth. If pre-pandemic hiring trends had continued, these sectors would employ 2.3 million more workers.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-8">
              <li>White-collar job postings fell <strong className="text-text-primary">35.8%</strong> between Q1 2023 and Q1 2025 (Revelio Labs), with software developers declining at roughly double the overall rate.</li>
              <li>LinkedIn reports a <strong className="text-text-primary">32% drop</strong> in hiring above $125K. Junior tech hiring is down approximately 40% from pre-2022 levels.</li>
              <li>Employers added just <strong className="text-text-primary">584,000 jobs</strong> in all of 2025, down from 2 million in 2024. January 2026 revisions showed average monthly gains of only 15,000.</li>
              <li>However, headline unemployment remains 4.3% and <strong className="text-text-primary">blue-collar sectors</strong> (healthcare, construction, trades) continue adding jobs. Weakness is concentrated in back-office roles, recruiting, HR, and mid-level management.</li>
            </ul>

            <h3 className="text-lg font-semibold text-text-primary mb-4">Productivity</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              U.S. labor productivity is accelerating. Nonfarm business productivity grew 4.9% annualized in Q3 2025, the strongest pace in years. The Kansas City Fed finds the post-2022 pickup runs approximately 2.5 percentage points above the pre-pandemic trend.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-4">
              <li>The <strong className="text-text-primary">productivity-pay divergence is widening:</strong> Q3 2025 productivity growth was 4.9% annualized while real wage growth remained modest. Fortune 500 profits hit a record $1.87T in 2024.</li>
              <li>The Kansas City Fed finds these gains are <strong className="text-text-primary">not yet broad-based.</strong> A small set of industries (computer systems design, online retail, data processing, management of companies) accounts for most of the pickup.</li>
            </ul>
            <div className="glass rounded-xl p-5 border-l-4 border-amber-500/60 mb-8">
              <p className="text-text-secondary text-sm leading-relaxed">
                <strong className="text-text-primary">Ghost GDP:</strong> Output that never circulates through consumer paychecks. The embryonic form of this dynamic is already visible in the productivity-pay gap. If it deepens, it becomes a drag on consumption and a structural headwind for consumer-facing businesses.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-4">AI Adoption: Linear, Not Exponential</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              AI adoption is widespread but shallow. The gap between adoption rates and realized economic effects is the single most important data point in this debate.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-4">
              <li>Gallup Q4 2025: only <strong className="text-text-primary">38%</strong> of employees report organizational AI integration, essentially unchanged quarter-over-quarter.</li>
              <li>OECD: only <strong className="text-text-primary">20.2%</strong> of firms globally use AI. U.S. Census BTOS: just <strong className="text-text-primary">5.4%</strong> of businesses used AI in the previous two weeks.</li>
              <li>Morgan Stanley survey of 935 executives: <strong className="text-text-primary">11.5%</strong> average productivity gains and 4% net headcount reduction, but over 80% of firms report no measurable impact on employment or productivity over the past three years.</li>
            </ul>
            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
              <p className="text-text-secondary leading-relaxed">
                <strong className="text-text-primary">Recursive technology capability does not equal recursive economic deployment.</strong> Every source in this analysis &mdash; bull, bear, and neutral &mdash; agrees that AI capability will continue advancing rapidly. The disagreement is entirely about how quickly that capability translates into real economic displacement.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-4">SaaS and Software Markets</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The SaaS repricing is severe and well-documented.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-4">
              <li>The IGV ETF fell over <strong className="text-text-primary">23% year-to-date</strong> by mid-February, its worst stretch since 2008.</li>
              <li>Anthropic product launches triggered approximately <strong className="text-text-primary">$285 billion</strong> in single-day market cap destruction. Salesforce is down roughly 40% from 2025 highs.</li>
              <li>Forward P/E ratios have compressed from roughly <strong className="text-text-primary">35x to 20x</strong>, levels not seen since 2014.</li>
              <li>Apollo cut its direct lending funds&apos; software exposure nearly in half during 2025.</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mb-8">
              However, SaaS growth had decelerated every quarter since the 2021 peak, well before AI fears catalyzed the selloff. Bain reports gross retention still around 90% or better. The selloff reflects both real structural concern and a repricing of long-overdue valuation excesses from the ZIRP era.
            </p>

            <h3 className="text-lg font-semibold text-text-primary mb-4">Business Formation and Demographics</h3>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-4">
              <li>New business applications remain elevated at approximately <strong className="text-text-primary">532,000/month</strong> (January 2026), well above pre-pandemic levels, with projected formations up 4.5% month-over-month.</li>
              <li>BLS projects <strong className="text-text-primary">17% software engineering growth</strong> through 2033 (327,900 new U.S. jobs). AI/ML and cybersecurity postings surged 163% and 124% YoY respectively.</li>
              <li>U.S. fertility sits at <strong className="text-text-primary">1.62</strong> (well below 2.1 replacement), population over 65 rising from 17.9% to 21.2% by 2035, and the U.S.-born labor force is growing just 0.3%/year.</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mb-10">
              AI may be offsetting a structural labor shortage, not creating a surplus. The labor market is transforming, not vanishing.
            </p>

            {/* ── Scenario Framework ──────────────────────────── */}
            <SectionHeading id="scenario-framework">Scenario Framework</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              The debate maps onto four scenarios with distinct probability weightings and portfolio implications. None is certain; portfolio construction should account for all four.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold">Scenario</th>
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold">Prob.</th>
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold min-w-[200px]">Key Mechanisms</th>
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold min-w-[200px]">Market Implications</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 px-4 font-medium text-text-primary">Gradual Transformation</td>
                    <td className="py-3 px-4">50&ndash;65%</td>
                    <td className="py-3 px-4">AI diffusion follows S-curve; institutional friction slows adoption; deflation raises purchasing power gradually; labor market restructures over 5&ndash;15 years</td>
                    <td className="py-3 px-4">Software repricing continues but moderates; broad equity market grinds higher on productivity; value rotation favors physical-world assets</td>
                  </tr>
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 px-4 font-medium text-text-primary">Abundance Boom</td>
                    <td className="py-3 px-4">20&ndash;30%</td>
                    <td className="py-3 px-4">AI deflation creates massive consumer surplus; business formation surges; new industries emerge from science breakthroughs; demographic cliff makes AI complementary</td>
                    <td className="py-3 px-4">Equity bull market broadens; infrastructure and energy outperform; compute layer captures outsized returns; consumer discretionary benefits</td>
                  </tr>
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 px-4 font-medium text-text-primary">Rapid Displacement</td>
                    <td className="py-3 px-4">10&ndash;20%</td>
                    <td className="py-3 px-4">White-collar displacement accelerates into negative feedback loop: layoffs &rarr; reduced spending &rarr; more AI adoption &rarr; more layoffs. Private credit contagion. Ghost GDP dynamics dominate</td>
                    <td className="py-3 px-4">Broad equity drawdown of 25&ndash;40%; software destroyed further; Treasuries rally; gold outperforms; compute partially insulated</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">Stalled Diffusion</td>
                    <td className="py-3 px-4">5&ndash;15%</td>
                    <td className="py-3 px-4">Regulatory pushback, compute bottlenecks, trust barriers, or capability plateaus slow deployment. AI capex generates disappointing ROI</td>
                    <td className="py-3 px-4">Resembles prior tech hype cycles. Modest productivity gains. AI infrastructure retains some value</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-text-secondary leading-relaxed mb-10">
              The gradual transformation is the base case because: (1) adoption intensity data shows no inflection, (2) productivity gains remain concentrated in a narrow industry set consistent with early diffusion, (3) headline labor markets have not broken, and (4) two centuries of technology transitions have followed gradual S-curves rather than step-function shocks.
            </p>

            {/* ── Sector Implications ─────────────────────────── */}
            <SectionHeading id="sector-implications">Sector-by-Sector Implications</SectionHeading>

            <h3 className="text-lg font-semibold text-accent-green mb-4">High-Conviction Overweights</h3>

            <div className="space-y-6 mb-10">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-semibold text-text-primary">AI Infrastructure and Compute</h4>
                  <Badge variant="positive">Overweight</Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Compute demand exceeds supply across all scenarios except the most extreme stalled-diffusion case. Hyperscalers are on track to spend $660&ndash;690 billion on infrastructure in 2026, nearly doubling 2025. The real bottlenecks are power, land, data center shells, and advanced memory. Even in the bear case, AI infrastructure continues posting record revenues as companies shift spend from labor to compute. Semiconductors, power generation/transmission, data center REITs, and cooling technology are all structurally supported.
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-semibold text-text-primary">Energy and Power Infrastructure</h4>
                  <Badge variant="positive">Overweight</Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Data center electricity demand is an observable, near-term tailwind for utilities, nuclear, natural gas, and grid infrastructure. This sector benefits under all macro scenarios and is the closest thing to a consensus overweight across the entire debate. The Jevons Paradox applies: AI efficiency creates more demand for physical infrastructure, not less. The energy transition is a multi-decade tailwind.
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-semibold text-text-primary">Physical Economy and Skilled Trades</h4>
                  <Badge variant="positive">Overweight</Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Healthcare, construction, advanced manufacturing, and skilled trades retain structural demand because AI struggles with physical-world dexterity. Blue-collar job openings have remained relatively stable even as white-collar postings collapsed. The demographic cliff reinforces demand for human-performed physical work. AI-driven design and optimization accelerates demand for physical buildout rather than substituting for it.
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-semibold text-text-primary">Healthcare and Life Sciences</h4>
                  <Badge variant="positive">Overweight</Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  AI-accelerated drug discovery is compressing 10-year pipelines into months. Each breakthrough creates manufacturing, distribution, and care delivery work. Demographic aging guarantees demand growth (healthcare AI adoption growing at 36.8% CAGR). Physical delivery of care resists automation. This sector benefits from both the technology tailwind and the demographic tailwind simultaneously.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-amber-400 mb-4">Sectors Requiring Nuance</h3>

            <div className="space-y-6 mb-10">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-semibold text-text-primary">Traditional SaaS and Enterprise Software</h4>
                  <Badge variant="negative">Underweight</Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Seat-based models in horizontal SaaS face structural headwinds as enterprises consolidate vendors and compress licenses. However, deeply embedded systems of record (CRM, ERP) with high switching costs and proprietary data will survive at lower multiples rather than go to zero. Bain reports gross retention still around 90%. The Jevons Paradox also applies: demand for better software may be near-infinite. The opportunity is in identifying companies that transition to consumption-based or outcome-based pricing, own irreplaceable data assets, or serve as the mediation layer between AI models and enterprise workflows. Avoid long-tail horizontal SaaS with narrow functionality that AI can replicate.
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-semibold text-text-primary">Consulting and IT Services</h4>
                  <Badge variant="negative">Underweight</Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  AI directly substitutes for the core value proposition: navigating complexity humans find tedious. India IT services ($200B+ in exports) face a structural headwind as the marginal cost of AI-generated analysis approaches the cost of electricity. Already visible in slowing hiring at major firms. Geographic concentration risk (India, Philippines) is underappreciated.
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-semibold text-text-primary">Consumer Discretionary</h4>
                  <Badge variant="mixed">Neutral</Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  This sector is the most sensitive to which scenario materializes. The top 20% of earners drive approximately 65% of consumer spending. Even modest displacement of this cohort has outsized consumption impact, with a 2&ndash;3 quarter lag as savings buffers deplete. If AI deflation raises purchasing power (bull case), consumer discretionary benefits enormously. If white-collar displacement outpaces price declines (bear case), it suffers first. Position neutrally and watch white-collar jobless claims data closely.
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-base font-semibold text-text-primary">Financial Intermediaries</h4>
                  <Badge variant="negative">Underweight Selectively</Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Companies whose moats depend on consumer friction, habit, or information asymmetry face genuine long-term pressure from AI agents. This includes elements of payments (interchange fees), insurance distribution, real estate brokerage, travel aggregation, and gig-economy platforms. However, the timeline is longer than bears suggest. As of early 2026, there is no evidence of meaningful agent-led payment disintermediation at scale. Reduce exposure to pure friction-based moats but recognize this is a 5&ndash;10 year structural risk, not an immediate catalyst.
                </p>
              </div>
            </div>

            {/* ── Tail Risk Hedging ───────────────────────────── */}
            <SectionHeading id="tail-risk-hedging">Tail Risk Hedging</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              While the rapid-displacement scenario is low probability, a potential GFC-scale drawdown warrants dedicated hedging. Key instruments and transmission mechanisms:
            </p>

            <div className="space-y-4 mb-10">
              <div className="glass rounded-xl p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-2">Treasuries and Duration</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  In the bear case, bonds rally as the Fed cuts aggressively into a deflationary displacement spiral. Technology-driven disinflation should keep real rates contained even outside the bear case. Modest duration exposure serves as portfolio insurance against deflationary demand collapse.
                </p>
              </div>
              <div className="glass rounded-xl p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-2">Gold</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  If displacement reaches crisis proportions, governments will respond with massive fiscal stimulus, UBI proposals, or aggressive money-printing. Gold hedges the tail scenario where governments attempt to inflate their way out of an AI-driven deflationary crisis, and performs well if geopolitical instability rises during the transition.
                </p>
              </div>
              <div className="glass rounded-xl p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-2">Private Credit Exposure (Reduce)</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  PE-backed software deals from the 2021&ndash;2023 vintage with seat-based revenue models represent concentrated risk. Apollo&apos;s decision to cut software exposure in half is a signal. Monitor credit spreads on PE-backed software and technology paper; Zendesk-style defaults are the canary. Audit software-sector concentration and vintage exposure immediately.
                </p>
              </div>
              <div className="glass rounded-xl p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-2">Prime Mortgage Deterioration (Monitor)</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Monitor early-stage delinquency in tech-heavy ZIP codes (SF, Seattle, Austin, NYC). HELOC draws, 401(k) withdrawals, and credit card balances spiking while mortgages remain current are leading indicators. The 30-year fixed-rate structure provides substantial cushion, making this a watch item rather than an immediate position.
                </p>
              </div>
            </div>

            {/* ── Monitoring Framework ────────────────────────── */}
            <SectionHeading id="monitoring-framework">Forward Monitoring Framework</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              The debate will be resolved by data over the next 6&ndash;18 months. Rather than making binary bets, the optimal approach is to monitor leading indicators and adjust positioning as evidence accumulates.
            </p>

            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold">Indicator</th>
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold">Current</th>
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold">Bear Trigger</th>
                    <th className="text-left py-3 px-4 text-accent-cyan font-semibold">Source / Freq.</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  {[
                    { ind: "Labor share of GDP", current: "53.8% (Q3 2025)", trigger: "Sustained below 52%", source: "BLS / Quarterly" },
                    { ind: "AI adoption (daily use)", current: "~19% of workers", trigger: "Step-function jump above 35%", source: "Gallup, St. Louis Fed / Quarterly" },
                    { ind: "Org. AI integration", current: "38% (flat QoQ)", trigger: "Jump above 50\u201360%", source: "Gallup / Quarterly" },
                    { ind: "Initial jobless claims", current: "212K/week", trigger: "Sustained above 350K", source: "DOL / Weekly" },
                    { ind: "White-collar JOLTS", current: "Declining YoY", trigger: "Collapse below 4M total", source: "BLS / Monthly" },
                    { ind: "Software credit spreads", current: "Elevated but contained", trigger: "PE software defaults >3%", source: "Moody\u2019s / Ongoing" },
                    { ind: "SaaS net revenue retention", current: "Gross ~90%", trigger: "Gross drops below 80%", source: "Quarterly Earnings" },
                    { ind: "New business applications", current: "~532K/month", trigger: "Sustained YoY decline", source: "Census Bureau / Monthly" },
                    { ind: "Productivity breadth", current: "Narrow (top 5\u20136 industries)", trigger: "Remains narrow 12+ months", source: "KC Fed QILP / Quarterly" },
                    { ind: "Inference cost / token", current: "Declining ~40% YoY", trigger: "Decline accelerates >70% YoY", source: "AI Lab Pricing / Ongoing" },
                  ].map((r) => (
                    <tr key={r.ind} className="border-b border-glass-border/50">
                      <td className="py-3 px-4 font-medium text-text-primary">{r.ind}</td>
                      <td className="py-3 px-4">{r.current}</td>
                      <td className="py-3 px-4">{r.trigger}</td>
                      <td className="py-3 px-4">{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Portfolio Construction ───────────────────────── */}
            <SectionHeading id="portfolio-construction">Portfolio Construction Principles</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              The AI economic transition creates a portfolio construction challenge that is unusual because the range of outcomes is genuinely wide, the dominant scenario requires patience, and the tail scenarios would reward very different positioning. Six principles emerge from the evidence:
            </p>

            <div className="space-y-4 mb-10">
              {[
                { num: "1", title: "Do not position the entire portfolio for one scenario.", body: "The honest assessment is that nobody knows whether AI will produce a 2028 crisis, a 2028 boom, or (most likely) a muddled middle. Maintain core equity exposure for the base case while using satellite positions and hedges to capture tail outcomes." },
                { num: "2", title: "The software repricing is a sector story, not a macro story \u2014 yet.", body: "The SaaS selloff is well-advanced and real. But the leap from \"software margins are compressing\" to \"the consumer economy is collapsing\" requires several additional links that have not materialized. Be precise about which thesis you are betting on." },
                { num: "3", title: "Overweight what benefits under all scenarios.", body: "Energy infrastructure, compute supply chain, and physical-world-intensive sectors benefit whether AI produces a boom or a crisis. These are the highest-conviction allocations because they do not require predicting which macro scenario wins." },
                { num: "4", title: "The speed of adoption is the critical variable.", body: "If Gallup\u2019s organizational AI integration metric jumps from 38% to 60%+ in the next two quarters, the bear case timeline becomes much more credible. If it continues its gradual drift, the base case holds. This single indicator is more informative than any earnings call or market commentary." },
                { num: "5", title: "Deflation is the underappreciated macro force.", body: "Technology-driven disinflation in services (70% of consumer spending) is coming regardless of pace. A 2\u20133% sustained decline in service costs functions as a tax cut for every household in the economy. Position for a world where nominal growth may be modest but real growth is strong." },
                { num: "6", title: "Audit private credit exposure immediately.", body: "PE-backed horizontal SaaS from the 2021\u20132023 vintage is where concentrated risk is already identifiable. This is not speculative; it is reflected in Apollo\u2019s portfolio actions. Understand your software concentration and vintage profile." },
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

            {/* ── Key Risks ───────────────────────────────────── */}
            <SectionHeading id="key-risks">Key Risks to This Framework</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              This report&apos;s base case assumes gradual transformation. The following developments would invalidate that assumption and require rapid portfolio repositioning:
            </p>

            <ul className="list-disc pl-5 space-y-3 text-text-secondary leading-relaxed mb-10">
              <li><strong className="text-text-primary">Non-linear adoption breakpoint.</strong> If a consumer AI agent achieves mass adoption (analogous to the iPhone moment), diffusion curves could steepen dramatically. Watch for any single AI product reaching 500M+ daily active users within a 12-month period.</li>
              <li><strong className="text-text-primary">Recursive AI self-improvement.</strong> If AI systems begin meaningfully accelerating their own capability development &mdash; not just training efficiency, but qualitative capability jumps &mdash; all timeline assumptions collapse. This remains speculative but cannot be dismissed.</li>
              <li><strong className="text-text-primary">Energy or compute breakthrough.</strong> Fusion or other step-function energy cost reductions would remove the natural cost floor on AI deployment that currently constrains substitution speed.</li>
              <li><strong className="text-text-primary">Geopolitical AI race dynamics.</strong> U.S.&ndash;China competition could override domestic economic caution, pushing both nations toward aggressive AI deployment regardless of labor market consequences.</li>
              <li><strong className="text-text-primary">Regulatory failure or capture.</strong> If policy response is absent during rapid displacement or counterproductive through incumbent entrenchment, the transition risk magnifies dramatically.</li>
            </ul>

            {/* ── Conclusion ──────────────────────────────────── */}
            <SectionHeading id="conclusion">Conclusion</SectionHeading>

            <p className="text-text-secondary leading-relaxed mb-6">
              AI is producing a real and measurable shift in the distribution of economic returns from labor to capital. This is confirmed by record-low labor share, surging productivity, and slowing job creation. However, the pace of actual workplace deployment remains firmly linear, not exponential, and the overwhelming weight of evidence favors a 5&ndash;15 year transformation over a 2&ndash;3 year crisis.
            </p>

            <p className="text-text-secondary leading-relaxed mb-6">
              The optimal portfolio stance is to position for gradual capital-over-labor rotation &mdash; overweight AI infrastructure, physical economy, energy, and healthcare; underweight labor-intensive intermediation and undifferentiated software &mdash; while maintaining dedicated tail-risk hedges against the displacement spiral scenario.
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-10">
              <p className="text-text-primary font-semibold text-lg leading-relaxed">
                Position for the base case. Hedge for the tail. Monitor relentlessly.
              </p>
            </div>

            {/* ── Sources ─────────────────────────────────────── */}
            <SectionHeading id="sources">Sources</SectionHeading>

            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary text-sm leading-relaxed mb-4">
              <li>Citrini Research &amp; Alap Shah</li>
              <li>Citadel Securities (Frank Flight)</li>
              <li>Colin McNamara</li>
              <li>Seb Krier</li>
              <li>Loeber</li>
              <li>Galois</li>
              <li>Dwarkesh Patel &amp; Brian Albrecht</li>
              <li>Sleepysol</li>
              <li>Kobeissi</li>
              <li>Michael Bloch</li>
              <li>Jason Lemkin &amp; Roy O&apos;Driscoll</li>
              <li>Morgan Stanley</li>
              <li>Bain &amp; Company</li>
              <li>Goldman Sachs</li>
              <li>Apollo Global Management</li>
            </ul>
            <p className="text-text-muted text-xs leading-relaxed mb-10">
              <strong>Data:</strong> BLS Employment Situation (Feb 2026), BLS Productivity &amp; Costs (Q3 2025), Gallup Workplace AI Survey (Q4 2025), OECD AI Adoption (Jan 2026), Indeed/FRED Job Postings, Kansas City Fed QILP, St. Louis Fed RTPS, U.S. Census Bureau Business Applications, Revelio Labs, LinkedIn Economic Graph.
            </p>

            {/* ── Disclaimer ──────────────────────────────────── */}
            <div className="border-t border-glass-border pt-6">
              <p className="text-text-muted text-xs leading-relaxed italic">
                This report is for informational and educational purposes only. It does not constitute investment advice, a recommendation, or an offer to buy or sell any security. Past performance does not guarantee future results. Consult a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
