"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function NavLink({ href, children, className = "" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-base font-medium transition-colors duration-200 ${
        isActive
          ? "text-accent-cyan"
          : "text-text-secondary hover:text-text-primary"
      } ${className}`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-cyan rounded-full" />
      )}
    </Link>
  );
}
