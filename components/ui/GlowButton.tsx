import Link from "next/link";

type GlowButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

export default function GlowButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: GlowButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const base = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 cursor-pointer ${sizeClasses[size]}`;

  const variants = {
    primary:
      "bg-accent-cyan text-bg-primary hover:bg-yellow-300 glow-cyan glow-cyan-hover",
    secondary:
      "border border-accent-cyan/30 text-accent-cyan hover:border-accent-cyan/60 hover:bg-accent-cyan/5",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
