import Link from "next/link";

const links = [
  { label: "Docs", href: "#" },
  { label: "Support", href: "#" },
  { label: "Community", href: "#" },
];

export default function TopBar() {
  return (
    <div className="w-full bg-bg-secondary border-b border-white/5">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 h-9 text-xs">
        <div className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
            Launch App
          </button>
          <span className="text-white/10">|</span>
          <button className="text-accent-cyan hover:text-yellow-300 transition-colors font-medium cursor-pointer">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
