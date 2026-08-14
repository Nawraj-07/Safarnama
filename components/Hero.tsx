export function Hero() {
  return (
    <section className="relative z-10 mx-auto flex min-h-[60vh] w-full max-w-5xl -translate-y-7 flex-col items-center justify-center px-5 pt-28 text-center sm:-translate-y-9 sm:px-8 md:pt-36 lg:pt-28">
      <div className="fade-up mb-6 flex items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d65c4d] bg-[#1a1412]/85 shadow-[0_0_0_4px_rgba(214,92,77,0.12),0_18px_28px_rgba(0,0,0,0.34)]">
          <div className="absolute inset-[8px] rounded-full border border-[#f3e4c8]/30" />
          <div className="relative ml-1 h-0 w-0 border-y-[10px] border-l-[18px] border-y-transparent border-l-[#f3e4c8] drop-shadow-[0_0_14px_rgba(243,228,200,0.35)]" />
        </div>
      </div>

      <h1 className="serif-shadow fade-up font-serif text-[clamp(3.5rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-memory-cream text-balance">
        Safarnama
      </h1>
    </section>
  );
}
