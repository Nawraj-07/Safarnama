type EqualizerProps = {
  isPlaying: boolean;
  className?: string;
};

const bars = [0.45, 0.9, 0.62, 1];

export function Equalizer({ isPlaying, className = "" }: EqualizerProps) {
  return (
    <div
      className={`flex h-4 items-end gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {bars.map((height, index) => (
        <span
          key={index}
          className="eq-bar w-[3px] rounded-full bg-memory-amber-soft"
          style={{
            height: `${height * 100}%`,
            animationDelay: `${index * 130}ms`,
            animationPlayState: isPlaying ? "running" : "paused",
            transform: isPlaying ? undefined : "scaleY(0.32)",
            opacity: isPlaying ? 1 : 0.65,
          }}
        />
      ))}
    </div>
  );
}
