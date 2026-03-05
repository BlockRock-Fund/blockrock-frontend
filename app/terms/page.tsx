import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

/* ── page ────────────────────────────────────────────────────── */
export default function TermsPage() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        {/* ── header ──────────────────────────────────────────── */}
        <header className="mb-14">
          <p className="font-semibold uppercase tracking-[0.25em] text-accent-cyan mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-4">
            Terms of Use
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-5">
            Please read these terms carefully before using the BlockRock protocol or website.
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-accent-cyan/60 via-accent-cyan/20 to-transparent" />
        </header>

        {/* ── body ────────────────────────────────────────────── */}
        <article className="min-w-0 max-w-3xl space-y-0 text-lg [&>h2:first-child]:mt-0">

          {/* ── 1. Agreement to Terms ─────────────────────────── */}
          <MajorHeading id="agreement">1. Agreement to Terms</MajorHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            By accessing or using the BlockRock website, protocol, or any associated services, you agree to be bound by these Terms of Use. If you do not agree to these terms, do not access or use the service.
          </p>

          {/* ── 2. Description of Service ─────────────────────── */}
          <SectionHeading id="description">2. Description of Service</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            BlockRock is a futarchy-governed ownership fund built on the Solana blockchain. The protocol uses treasury-backed tokens, conditional decision markets, and AI agents to manage a portfolio of onchain assets.
          </p>

          <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
            <p className="text-text-primary leading-relaxed">
              <span className="text-accent-cyan font-bold">BlockRock is not a registered investment adviser, broker-dealer, or financial institution.</span> The protocol operates as decentralized software on a public blockchain.
            </p>
          </div>

          {/* ── 3. Eligibility ────────────────────────────────── */}
          <SectionHeading id="eligibility">3. Eligibility</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            You must be of legal age in your jurisdiction to use the service. You are solely responsible for ensuring that your use of BlockRock complies with all applicable laws and regulations in your jurisdiction. The service is not available in jurisdictions where its use would be prohibited.
          </p>

          {/* ── 4. No Investment Advice ────────────────────────── */}
          <SectionHeading id="no-advice">4. No Investment Advice</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            All content provided through the BlockRock website, protocol interface, documentation, and communications is <span className="text-accent-cyan font-semibold">for informational purposes only</span>. Nothing constitutes financial, investment, legal, or tax advice. You should consult qualified professional advisors before making any investment decisions.
          </p>

          {/* ── 5. Risk Disclosures ───────────────────────────── */}
          <MajorHeading id="risks">5. Risk Disclosures</MajorHeading>

          <div className="glass rounded-xl p-6 border-l-4 border-accent-cyan mb-8">
            <p className="text-accent-cyan font-semibold leading-relaxed">
              Participation in BlockRock involves substantial risk of loss. You should only participate with funds you can afford to lose entirely.
            </p>
          </div>

          <ul className="list-disc pl-5 space-y-3 text-text-secondary leading-relaxed mb-8">
            <li><strong className="text-text-primary">Market volatility.</strong> Cryptocurrency markets are highly volatile. Token values can fluctuate dramatically and may decline to zero.</li>
            <li><strong className="text-text-primary">Smart contract risk.</strong> The protocol relies on smart contracts that may contain bugs, vulnerabilities, or exploits despite auditing efforts.</li>
            <li><strong className="text-text-primary">Governance risk.</strong> Futarchy decision markets may resolve in ways that negatively impact fund performance. Governance outcomes are determined by market participants and are not guaranteed to be optimal.</li>
            <li><strong className="text-text-primary">Loss of funds.</strong> You may lose some or all of your investment. There is no insurance, guarantee, or recourse mechanism beyond the protocol&apos;s built-in treasury backing.</li>
            <li><strong className="text-text-primary">No guarantee of returns.</strong> Past performance does not indicate future results. Treasury growth is not guaranteed.</li>
            <li><strong className="text-text-primary">Regulatory risk.</strong> Changes in laws or regulations may adversely affect the protocol, its tokens, or your ability to participate.</li>
          </ul>

          {/* ── 6. Token Disclaimers ──────────────────────────── */}
          <SectionHeading id="tokens">6. Token Disclaimers</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            BlockRock tokens are <span className="text-accent-cyan font-semibold">governance and utility tokens</span> used to participate in the protocol&apos;s futarchy governance system. Tokens do not represent equity, shares, ownership interests, or rights to dividends or profits in any legal entity.
          </p>

          <p className="text-text-secondary leading-relaxed mb-6">
            Treasury backing provides a mechanism for value accrual but does not guarantee that token prices will track or exceed treasury value per token. Market prices are determined by supply and demand on open markets.
          </p>

          {/* ── 7. Intellectual Property ──────────────────────── */}
          <SectionHeading id="ip">7. Intellectual Property</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            The BlockRock name, logo, website content, and associated materials are the intellectual property of BlockRock and its contributors. Open-source protocol code is governed by its respective license terms.
          </p>

          {/* ── 8. Limitation of Liability ────────────────────── */}
          <SectionHeading id="liability">8. Limitation of Liability</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            To the maximum extent permitted by applicable law, BlockRock, its contributors, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of the protocol, including but not limited to losses resulting from:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-text-secondary leading-relaxed mb-8">
            <li>Market conditions or price fluctuations</li>
            <li>Smart contract failures or exploits</li>
            <li>Governance decisions or market resolutions</li>
            <li>Third-party actions, hacks, or protocol integrations</li>
            <li>Regulatory actions or changes in law</li>
          </ul>

          {/* ── 9. Governing Law ──────────────────────────────── */}
          <SectionHeading id="governing-law">9. Governing Law</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            These terms shall be governed by and construed in accordance with applicable law. Any disputes arising from or related to these terms or the use of BlockRock shall be resolved through binding arbitration.
          </p>

          {/* ── 10. Changes to Terms ──────────────────────────── */}
          <SectionHeading id="changes">10. Changes to Terms</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            BlockRock reserves the right to modify these terms at any time. Changes will be posted on this page. Your continued use of the service after changes are posted constitutes acceptance of the revised terms.
          </p>

          {/* ── 11. Contact ───────────────────────────────────── */}
          <SectionHeading id="contact">11. Contact</SectionHeading>

          <p className="text-text-secondary leading-relaxed mb-6">
            For questions about these terms, reach out on X (Twitter) at{" "}
            <a
              href="https://x.com/blockrockfund"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan hover:underline"
            >
              @blockrockfund
            </a>.
          </p>

          {/* ── Disclaimer footer ─────────────────────────────── */}
          <div className="border-t border-glass-border pt-6">
            <p className="text-text-secondary text-sm leading-relaxed italic">
              This page is for informational purposes only and does not constitute legal advice. Cryptocurrency investments are highly volatile and carry significant risk. Consult a qualified financial advisor before making investment decisions.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
