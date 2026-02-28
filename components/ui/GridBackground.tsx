export default function GridBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Gold spotlight top-left */}
      <div
        className="absolute -top-[20%] left-[10%] w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(221,177,16,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Amber spotlight top-right */}
      <div
        className="absolute top-[5%] right-[5%] w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(180,140,10,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Navy spotlight bottom */}
      <div
        className="absolute bottom-0 left-[40%] w-[400px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(30,63,153,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
