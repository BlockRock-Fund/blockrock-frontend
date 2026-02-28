import Logo from "../ui/Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-xs">
            Onchain asset management. Aligned incentives, futarchy
            markets, and AI-driven operations with zero management fees.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} BlockRock Protocol. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
