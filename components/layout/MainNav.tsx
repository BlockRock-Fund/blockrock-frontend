"use client";

import { useState } from "react";
import Logo from "../ui/Logo";
import NavLink from "../ui/NavLink";

const navItems = [
  { label: "Whitepaper", href: "/whitepaper" },
  { label: "Research", href: "/research" },
  { label: "Agents", href: "/agents" },
  { label: "Funds", href: "/funds" },
];

export default function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass-strong">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <Logo />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>


        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-bg-secondary/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} className="block py-2">
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
