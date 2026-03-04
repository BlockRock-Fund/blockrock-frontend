/* ──────────────────────────────────────────────────────────────
   Charter Slides — 1080 × 1080 px (full content)
   /charter/slides
   ────────────────────────────────────────────────────────────── */

import React from "react";

/* ── style constants ────────────────────────────────────────── */

const body: React.CSSProperties = {
  fontSize: 20,
  lineHeight: "22px",
  color: "#94a3b8",
};

const sectionHead: React.CSSProperties = {
  fontSize: 20,
  lineHeight: "22px",
  fontWeight: 700,
  color: "#e8edf5",
};

const subHead: React.CSSProperties = {
  fontSize: 18,
  lineHeight: "20px",
  fontWeight: 600,
  color: "#e8edf5",
};

const bold: React.CSSProperties = { color: "#e8edf5", fontWeight: 700 };

/* ── helpers ────────────────────────────────────────────────── */

function Slide({
  children,
  id,
  padding = 48,
}: {
  children: React.ReactNode;
  id: string;
  padding?: number;
}) {
  return (
    <div
      id={id}
      className="relative overflow-hidden shrink-0"
      style={{ width: 1080, height: 1080 }}
    >
      <div className="absolute inset-0" style={{ background: "#050C22" }} />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(221,177,16,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(221,177,16,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "54px 54px",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          top: -120,
          left: -80,
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(221,177,16,0.07) 0%, transparent 65%)",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -80,
          right: -60,
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(30,63,153,0.08) 0%, transparent 65%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(3,6,16,0.45) 100%)",
        }}
      />

      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 3,
          background:
            "linear-gradient(to right, #DDB110, rgba(221,177,16,0.3) 60%, transparent)",
        }}
      />

      <div
        className="relative z-10 flex flex-col h-full"
        style={{
          padding,
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        }}
      >
        {children}
      </div>

      <div className="absolute z-20" style={{ bottom: 20, right: 28 }}>
        <span
          style={{ fontSize: 11, letterSpacing: "0.15em" }}
          className="text-[#475569] font-medium uppercase"
        >
          blockrock.fund
        </span>
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background: "#0B1535",
        border: "1px solid rgba(221,177,16,0.10)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function GoldDivider() {
  return (
    <div
      style={{
        height: 1,
        background:
          "linear-gradient(to right, rgba(221,177,16,0.5), rgba(221,177,16,0.15), transparent)",
      }}
    />
  );
}

function Bullet({
  children,
  style: extraStyle,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="flex items-start" style={{ gap: 8, ...extraStyle }}>
      <span
        className="shrink-0"
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#DDB110",
          opacity: 0.5,
          marginTop: 7,
        }}
      />
      <span style={body}>{children}</span>
    </div>
  );
}

function Gap({ h }: { h: number }) {
  return <div style={{ height: h, flexShrink: 0 }} />;
}

/* ── page ────────────────────────────────────────────────────── */

export default function CharterSlidesPage() {
  return (
    <div
      className="flex flex-col items-center gap-12 py-16 overflow-x-auto"
      style={{ background: "#020408", minWidth: 1080 }}
    >
      {/* ════════════════════════════════════════════════════════
          SLIDE 1 — Title + Summary
          ════════════════════════════════════════════════════════ */}
      <Slide id="slide-1" padding={56}>
        <div className="flex flex-col justify-center flex-1" style={{ gap: 0, maxWidth: 920, margin: "0 auto", width: "100%" }}>
        <p
          style={{ fontSize: 24, letterSpacing: "0.25em" }}
          className="font-semibold uppercase text-[#DDB110]"
        >
          BlockRock Charter
        </p>
        <Gap h={18} />

        <h1
          style={{ fontSize: 52, lineHeight: 1.1 }}
          className="font-bold tracking-tight text-[#e8edf5]"
        >
          BlackRock on the Blockchain
        </h1>
        <Gap h={16} />

        <p
          style={{ fontSize: 22, lineHeight: "32px" }}
          className="text-[#94a3b8]"
        >
          The ownership fund helping people grow wealth with confidence
        </p>
        <Gap h={24} />

        <GoldDivider />
        <Gap h={28} />

        <p
          style={{ fontSize: 20, lineHeight: "26px" }}
          className="text-[#94a3b8]"
        >
          Asset managers (e.g. BlackRock, Vanguard, Fidelity) help people grow
          their wealth. But traditional asset managers suffer from
          structural problems that cause underperformance.
        </p>
        <Gap h={20} />

        <Card
          style={{ padding: "22px 26px", borderLeft: "4px solid #DDB110" }}
        >
          <p
            style={{ fontSize: 20, lineHeight: "26px" }}
            className="text-[#94a3b8]"
          >
            <span style={bold}>BlockRock</span> is an &ldquo;ownership
            fund&rdquo; on Solana with treasury-backed tokens, decision
            markets, and AI agents to help people grow wealth with confidence.
          </p>
        </Card>

        <Gap h={36} />

        <div className="grid grid-cols-3" style={{ gap: 16 }}>
          {[
            {
              stat: "Ownership",
              label: "Who Benefits",
              detail:
                "Full-stack governance makes tokenholders first-class beneficiaries.",
            },
            {
              stat: "Futarchy",
              label: "How Decisions Get Made",
              detail:
                "Decision markets prioritize performance. Skin-in-the-game replaces institutional politics.",
            },
            {
              stat: "AI",
              label: "How Work Gets Done",
              detail:
                "AI enhances alpha generation. Funds scale with context and compute, not headcount.",
            },
          ].map((d) => (
            <Card
              key={d.label}
              className="text-center"
              style={{ padding: "20px 16px" }}
            >
              <p
                style={{ fontSize: 24 }}
                className="font-bold text-[#DDB110] mb-1"
              >
                {d.stat}
              </p>
              <p
                style={{ fontSize: 18 }}
                className="font-semibold text-[#e8edf5] mb-1"
              >
                {d.label}
              </p>
              <p
                style={{ fontSize: 18, lineHeight: "22px" }}
                className="text-[#94a3b8]"
              >
                {d.detail}
              </p>
            </Card>
          ))}
        </div>
        </div>
      </Slide>

      {/* ════════════════════════════════════════════════════════
          SLIDE 2 — Why
          ════════════════════════════════════════════════════════ */}
      <Slide id="slide-2" padding={48}>
        <div className="flex flex-col justify-center flex-1">
        <p
          style={{ fontSize: 16, letterSpacing: "0.25em" }}
          className="font-semibold uppercase text-[#DDB110]"
        >
          Why
        </p>
        <Gap h={0} />

        <h2
          style={{ fontSize: 28, lineHeight: 1.15 }}
          className="font-bold tracking-tight text-[#e8edf5]"
        >
          The Case for a New Kind of Asset Manager
        </h2>
        <Gap h={6} />

        <p style={{ fontSize: 20, lineHeight: "22px" }} className="text-text-secondary">
          The $120T+ asset management industry is broken.
        </p>
        <Gap h={12} />

        <GoldDivider />
        <Gap h={40} />

        {/* ── Fee Misalignment ── */}
        <h3 style={sectionHead}>Fee Misalignment</h3>
        <Gap h={4} />
        <p style={body}>
          BlackRock earns ~73% of its revenue from management fees tied to AUM.
          These fees are collected regardless of fund performance. Performance
          fees account for just ~5% of revenue. This incentivizes asset accumulation over performance, consensus-driven investing, and narrative capture.
        </p>
        <Gap h={18} />

        {/* ── Regulatory Restrictions ── */}
        <h3 style={sectionHead}>Regulatory Restrictions</h3>
        <Gap h={4} />
        <p style={body}>
          Dense multi-jurisdictional regulation hinders performance. Compliance
          layers delay action, fiduciary standards push for conservative
          allocations, and cross-border restrictions fragment strategy. The gap
          between how capital <em>should</em> move and how it <em>can</em> move
          is a compounding drag on returns.
        </p>
        <Gap h={18} />

        {/* ── Organizational Complexity ── */}
        <h3 style={sectionHead}>Organizational Complexity</h3>
        <Gap h={4} />
        <p style={body}>
          Sprawling hierarchies create bureaucratic bloat. Decisions pass through
          committees, internal politics shape strategy, and huge operational
          costs reinforce the pressure to prioritize asset gathering. BlackRock has 20,000+ employees, 70+ global offices, and 1,700+ ETFs.
        </p>
        <Gap h={40} />

        {/* ── The Death Spiral ── */}
        <h3 style={sectionHead}>The Death Spiral</h3>
        <Gap h={4} />
        <p style={{ ...body, marginBottom: 4 }}>
          These problems reinforce each other in a negative cycle:
        </p>
        <Gap h={4} />
        <Card
          style={{
            padding: "12px 16px",
            borderLeft: "3px solid var(--accent-cyan)",
          }}
        >
          <p style={{ ...body, color: "var(--text-secondary)" }}>
            fee model incentivizes scale &rarr; scale demands complexity &rarr; complexity invites compliance &rarr; fee model + complexity + compliance = worse decisions &rarr; bad decisions reduce performance &rarr; fees come in anyway
          </p>
        </Card>
        <Gap h={40} />
        <p style={{ fontSize: 20, lineHeight: "22px", fontWeight: 600, color: "var(--accent-cyan)" }}>Traditional asset managers remain mediocre at the job investors hire them for. Most actively managed funds underperform their benchmarks, especially after fees.</p>
        </div>
      </Slide>

      {/* ════════════════════════════════════════════════════════
          SLIDE 3 — Why Now
          ════════════════════════════════════════════════════════ */}
      <Slide id="slide-3" padding={48}>
        <div className="flex flex-col justify-center flex-1">
        <p
          style={{ fontSize: 16, letterSpacing: "0.25em" }}
          className="font-semibold uppercase text-[#DDB110]"
        >
          Why
        </p>
        <Gap h={8} />

        <h2
          style={{ fontSize: 28, lineHeight: 1.15 }}
          className="font-bold tracking-tight text-[#e8edf5]"
        >
          Why Now
        </h2>
        <Gap h={6} />

        <p style={{ fontSize: 16, lineHeight: "18px" }} className="text-[#94a3b8]">
          Converging forces are opening a window of opportunity for a new kind of
          asset manager.
        </p>
        <Gap h={12} />

        <GoldDivider />
        <Gap h={12} />

        {/* two-column: left = Peak Uncertainty + Onchain Assets | right = Ownership Infrastructure */}
        <div className="flex" style={{ gap: 20 }}>
          {/* left column */}
          <div className="flex-1">
            <h4 style={subHead}>Peak Uncertainty</h4>
            <Gap h={3} />
            <p style={body}>
              Investment conviction is at an all-time low.
            </p>
            <Gap h={4} />
            <div
              style={{
                paddingLeft: 10,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Bullet>Stocks ranging at all-time highs</Bullet>
              <Bullet>
                Precious metals swinging more violently than ever
              </Bullet>
              <Bullet>USD reserve status being questioned</Bullet>
              <Bullet>AI threatening to displace white-collar work</Bullet>
              <Bullet>Crypto underperforming expectations</Bullet>
            </div>
            <Gap h={4} />
            <p style={body}>
              Growing (let alone preserving) wealth is more difficult, time-consuming, and
              anxiety-inducing than ever.
            </p>
            <Gap h={12} />

            <h4 style={subHead}>Onchain Assets</h4>
            <Gap h={3} />
            <p style={body}>
              The universe of investable assets on Solana is expanding rapidly.
              Spot markets, perpetual futures, lending markets, structured yield
              products, and RWAs (tokenized stocks, bonds, commodities, etc.) are
              accessible onchain with deep liquidity and composable
              infrastructure.
            </p>
            <Gap h={4} />
            <p style={body}>
              A fund operating entirely onchain is no longer limited to a handful
              of tokens. The breadth of positions available now rivals what
              traditional asset managers can access, without the friction.
            </p>
          </div>

          {/* right column */}
          <div className="flex-1">
            <h4 style={subHead}>Ownership Infrastructure</h4>
            <Gap h={3} />
            <p style={body}>
              MetaDAO&apos;s permissionless launchpad lets anyone launch an
              &ldquo;ownership coin&rdquo; whose value is tied
              to a futarchy-governed treasury. This infrastructure is
              battle-tested and soon becoming publicly available.
            </p>
            <Gap h={4} />
            <p style={body}>
              In 2025, MtnCapital launched an ownership fund on MetaDAO,
              positioned as an early-stage VC fund. But it struggled to pass proposals and
              eventually wound down.
            </p>
            <Gap h={4} />
            <p style={body}>
              Futarchy governance works by letting markets price competing outcomes, but
              private VC deals are difficult to price with asymmetric information, long timelines, and binary outcomes.
            </p>
            <Gap h={4} />
            <p style={body}>
              Liquid asset allocation for risk-adjusted returns
              gives futarchy the pricing efficiency it
              requires. Decision markets can evaluate portfolio construction,
              yield strategies, and value accrual more effectively than illiquid VC bets.
            </p>
            <Gap h={4} />
            <p style={body}>
              Proof of safety: When MtnCapital wound down, holders received their
              proportional share of the treasury through the protocol&apos;s
              built-in liquidation mechanism. The system&apos;s guarantees worked
              as intended. Even in failure, no value was lost to extraction or
              mismanagement.
            </p>
          </div>
        </div>
        </div>
      </Slide>

      {/* ════════════════════════════════════════════════════════
          SLIDE 4 — How
          ════════════════════════════════════════════════════════ */}
      <Slide id="slide-4" padding={48}>
        <div className="flex flex-col justify-center flex-1">
        <p
          style={{ fontSize: 16, letterSpacing: "0.25em" }}
          className="font-semibold uppercase text-[#DDB110]"
        >
          How
        </p>
        <Gap h={8} />

        <h2
          style={{ fontSize: 28, lineHeight: 1.15 }}
          className="font-bold tracking-tight text-[#e8edf5]"
        >
          BlockRock&apos;s Principles
        </h2>
        <Gap h={6} />

        <p style={{ fontSize: 16, lineHeight: "18px" }} className="text-[#94a3b8]">
          BlockRock manages assets with a
          new system where incentives, governance, and execution are rebuilt
          from first principles.
        </p>
        <Gap h={12} />

        <GoldDivider />
        <Gap h={12} />

        {/* ── Ownership ── */}
        <h3 style={sectionHead}>Ownership</h3>
        <Gap h={2} />
        <p style={{ ...body, fontWeight: 600, color: "var(--accent-cyan)" }}>
          Who benefits
        </p>
        <Gap h={3} />
        <p style={body}>
          Tokenholders are the primary beneficiaries of fund performance via
          treasury backing. Minimal management fees are funded transparently from
          the treasury and adjustable via governance. No percentage-based skimming.
          Tokens also enable borderless access. Anyone with a
          wallet can hold the token, bypassing the geographic and accreditation
          barriers of traditional funds.
        </p>
        <Gap h={12} />

        {/* ── Futarchy ── */}
        <h3 style={sectionHead}>Futarchy</h3>
        <Gap h={2} />
        <p style={{ ...body, fontWeight: 600, color: "var(--accent-cyan)" }}>
          How decisions get made
        </p>
        <Gap h={3} />
        <p style={body}>
          Governance uses conditional decision markets. When a proposal enters,
          two markets open: one pricing the token if the proposal is adopted,
          another if rejected. At the end of the period, the condition with the
          highest time-weighted average price wins.
        </p>
        <Gap h={4} />
        <p style={body}>This mechanism:</p>
        <Gap h={4} />
        <div
          style={{
            paddingLeft: 10,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Bullet>
            <span style={bold}>Replaces committees with markets.</span> No
            boardroom politics, no career risk aversion, no consensus-seeking.
            Decisions are priced by participants with capital at stake to maximize
            risk-adjusted returns.
          </Bullet>
          <Bullet>
            <span style={bold}>Operates continuously.</span> Speed of capital movement
            matches speed of opportunity.
          </Bullet>
          <Bullet>
            <span style={bold}>Reinforces incentive alignment.</span> Because
            participants are token-holders pricing outcomes, the governance layer
            inherits the ownership layer&apos;s alignment. Self-interested pricing
            incentivizes better decision-making.
          </Bullet>
        </div>
        <Gap h={12} />

        {/* ── AI ── */}
        <h3 style={sectionHead}>AI</h3>
        <Gap h={2} />
        <p style={{ ...body, fontWeight: 600, color: "var(--accent-cyan)" }}>
          How work gets done
        </p>
        <Gap h={3} />
        <p style={body}>
          AI agents act as always-on analysts, ingesting live data, market
          signals, and macro context to generate a continuous stream of
          proposals. Critically:
        </p>
        <Gap h={4} />
        <div
          style={{
            paddingLeft: 10,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Bullet>
            <span style={bold}>They propose, never execute.</span> AI agents
            have no authority to force decisions &mdash; only to submit ideas to the
            governance layer. Their proposals compete with human submissions on
            equal footing.
          </Bullet>
          <Bullet>
            <span style={bold}>
              They are judged purely by market pricing.
            </span>{" "}
            No institutional bias filters their ideas. Good proposals win
            regardless of source.
          </Bullet>
          <Bullet>
            <span style={bold}>
              They scale with compute, not headcount.
            </span>{" "}
            As AI capabilities grow, the fund&apos;s capability grows too.
          </Bullet>
        </div>
        <Gap h={4} />
        <p style={body}>
          This eliminates the 20,000-employee apparatus and the operational costs
          that drive fee pressure. It also shrinks the compliance surface, as
          fewer humans making discretionary calls means fewer points of
          regulatory exposure.
        </p>
        <Gap h={20} />

        {/* ── Positive Flywheel ── */}
        <h3 style={sectionHead}>The Positive Flywheel</h3>
        <Gap h={3} />
        <p style={body}>
          BlockRock inverts the traditional cycle of bloat and extraction:
        </p>
        <Gap h={6} />
        <Card style={{ padding: "10px 16px", borderLeft: "3px solid #DDB110" }}>
          <p style={{ ...body, color: "var(--text-secondary)" }}>
            Token ownership &rarr; Better-incentivized market participants &rarr;
            More accurate futarchy &rarr; Better AI proposal filtering &rarr;
            Stronger performance &rarr; Higher token value &rarr; More
            sophisticated participants &rarr; Repeat
          </p>
        </Card>
        <Gap h={20} />

        {/* ── User Experience ── */}
        <h3 style={sectionHead}>The Resulting User Experience</h3>
        <Gap h={8} />
        <div className="grid grid-cols-2" style={{ gap: 12 }}>
          {[
            {
              label: "Passive Holders",
              detail:
                "Enjoy increasing treasury-backed value with secure structure, bullish decision-making, and minimal value leakage.",
            },
            {
              label: "Active Investors",
              detail:
                "Submit proposals, trade decision markets, and profit for accurate judgment.",
            },
          ].map((d) => (
            <Card key={d.label} style={{ padding: "12px 16px" }}>
              <p
                style={{ fontSize: 16, fontWeight: 600, color: "#DDB110" }}
                className="mb-1"
              >
                {d.label}
              </p>
              <p style={{ fontSize: 16, lineHeight: "18px", color: "var(--text-secondary)" }}>
                {d.detail}
              </p>
            </Card>
          ))}
        </div>
        </div>
      </Slide>

      {/* ════════════════════════════════════════════════════════
          SLIDE 5 — What
          ════════════════════════════════════════════════════════ */}
      <Slide id="slide-5" padding={48}>
        <div className="flex flex-col justify-center flex-1">
        <p
          style={{ fontSize: 16, letterSpacing: "0.25em" }}
          className="font-semibold uppercase text-[#DDB110]"
        >
          What
        </p>
        <Gap h={8} />

        <h2
          style={{ fontSize: 28, lineHeight: 1.15 }}
          className="font-bold tracking-tight text-[#e8edf5]"
        >
          BlockRock in Practice
        </h2>
        <Gap h={6} />

        <p style={{ fontSize: 16, lineHeight: "18px" }} className="text-[#94a3b8]">
          The playbook for launching, operating, and scaling BlockRock.
        </p>
        <Gap h={12} />

        <GoldDivider />
        <Gap h={12} />

        {/* ── Launch ── */}
        <h3 style={sectionHead}>Launch</h3>
        <Gap h={6} />
        <p style={body}>
          BlockRock funds launch via ICO on MetaDAO&apos;s permissionless
          launchpad, which provides full-stack futarchy governance with legal
          enforcement, so that token value is tied to treasury value.
        </p>
        <Gap h={6} />
        <p style={body}>
          BlockRock&apos;s Flagship Fund launches first with a mandate for a
          moderate risk strategy to maximize Sortino ratio (penalizing downside
          volatility) by allocating the treasury into a portfolio of onchain
          positions. 95% of tokens are distributed to ICO participants at the
          same price. The remaining 5% is allocated to the founding team, which
          unlocks at 30-day TWAPs of 2X, 4X, 8X, 16X, and 32X the ICO price. An
          $8K allowance per month is allocated to the team for supporting infrastructure.
        </p>
        <Gap h={6} />
        <p style={body}>
          BlockRock may launch additional funds in the future, each with a unique
          mandate and risk profile.
        </p>
        <Gap h={20} />

        {/* ── Operation ── */}
        <h3 style={sectionHead}>Operations</h3>
        <Gap h={4} />
        <p style={body}>
          Every fund operation follows the same decision cycle:
        </p>
        <Gap h={6} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            {
              num: "1",
              title: "Proposal enters",
              text: "An AI agent or human submits a proposal to the governance layer.",
            },
            {
              num: "2",
              title: "Conditional markets open",
              text: "Two markets price the token: one if the proposal passes, one if it fails.",
            },
            {
              num: "3",
              title: "Markets resolve",
              text: "After the voting period, the outcome with the higher time-weighted average price wins and is automatically executed. Traders who priced the winning outcome correctly profit.",
            },
          ].map((step) => (
            <Card
              key={step.num}
              className="flex items-start"
              style={{ padding: "10px 16px", gap: 12 }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontFamily: "var(--font-geist-mono), monospace",
                  lineHeight: 1,
                  color: "var(--accent-cyan)",
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {step.num}
              </span>
              <div>
                <span
                  style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}
                >
                  {step.title}
                </span>
                <span style={{ ...body, marginLeft: 6 }}> &mdash; {step.text}</span>
              </div>
            </Card>
          ))}
        </div>
        <Gap h={20} />

        {/* ── Distribution ── */}
        <h3 style={sectionHead}>Distributions</h3>
        <Gap h={4} />
        <p style={body}>
          Any token holder can submit a proposal to distribute value to holders via buybacks, dividends, or liquidation. If the decision market resolves in favor of a distribution, the treasury is automatically distributed according to the proposal.
        </p>
        <Gap h={20} />

        {/* ── Communications ── */}
        <h3 style={sectionHead}>Communications</h3>
        <Gap h={4} />
        <p style={body}>
          BlockRock is a spectator sport. Everyday, anyone interested in financial markets can check BlockRock to see strategists proposing investment theses, traders battling to approve or reject proposals, and the fund&apos;s portfolio growing in lockstep with the token. Every decision market resolution is an official verdict, automatically executed by smart contracts. Updates are shared on X (Twitter) via @blockrockfund.
        </p>
        <Gap h={20} />

        {/* ── Scaling AUM ── */}
        <h3 style={sectionHead}>Scaling</h3>
        <Gap h={4} />
        <p style={body}>
          BlockRock is designed to scale to trillions in assets under management. The token&apos;s mint authority is governed by futarchy. So decision markets can approve additional fundraises with new token mints, while avoiding unfair dilution. BlockRock funds expand when governance deems it bullish.
        </p>
        <Gap h={20} />

        {/* ── Disclaimer ── */}
        <div
          style={{
            borderTop: "1px solid rgba(221,177,16,0.08)",
            paddingTop: 8,
          }}
        >
          <p
            style={{
              fontSize: 14,
              lineHeight: "16px",
              color: "#94a3b8",
              fontStyle: "italic",
            }}
          >
            This charter is for informational purposes only. It
            does not constitute investment advice, a recommendation, or an offer
            to buy or sell any security or token. Cryptocurrency investments are
            highly volatile and carry significant risk. Consult a qualified
            financial advisor before making investment decisions.
          </p>
        </div>
        </div>
      </Slide>
    </div>
  );
}
