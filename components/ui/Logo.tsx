import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.jpg"
        alt="BlockRock logo"
        width={36}
        height={36}
        className="rounded"
      />
      <span className="text-xl font-bold tracking-tight text-text-primary">
        Block<span className="text-accent-cyan">Rock</span>
      </span>
    </div>
  );
}
