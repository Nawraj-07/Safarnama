type VinylProps = {
  isPlaying: boolean;
  label?: string;
};

export function Vinyl({ isPlaying, label = "N" }: VinylProps) {
  return (
    <div
      className="vinyl-spin pointer-events-none relative h-28 w-28 shrink-0 rounded-full border border-white/15 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),rgba(255,255,255,0.03)_18%,rgba(10,8,6,0.95)_19%,rgba(10,8,6,0.98)_62%,rgba(42,33,28,0.95)_100%)] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] sm:h-32 sm:w-32"
      style={{ animationPlayState: isPlaying ? "running" : "paused" }}
      aria-hidden="true"
    >
      <div className="absolute inset-[14%] rounded-full border border-white/5" />
      <div className="absolute inset-[27%] rounded-full border border-white/5" />
      <div className="absolute inset-[41%] rounded-full bg-gradient-to-br from-memory-amber to-memory-terracotta shadow-inner" />
      <div className="absolute inset-[46%] flex items-center justify-center rounded-full bg-black/55 text-[10px] font-semibold uppercase tracking-[0.2em] text-memory-amber-soft">
        {label}
      </div>
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,rgba(255,255,255,0.08),transparent_16%,rgba(255,255,255,0.05)_34%,transparent_54%,rgba(255,255,255,0.07)_76%,transparent)] opacity-50" />
    </div>
  );
}
