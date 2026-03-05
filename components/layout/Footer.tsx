import Link from "next/link";
import { Twitter } from "lucide-react";
import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-xs">
            Asset management powered by ownership, futarchy, and AI.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} BlockRock. All rights reserved.
            </p>
            <Link href="/terms" className="text-xs text-text-muted hover:text-accent-cyan transition-colors">
              Terms
            </Link>
          </div>
          <a
            href="https://x.com/blockrockfund"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-accent-cyan transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
