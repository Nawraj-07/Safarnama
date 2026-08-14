import { PlayIcon } from "./icons";

export function Footer() {
  return (
    <footer className="relative z-10 mt-4 w-full border-t border-[#e4b56d]/15 bg-[#241B14]/92 shadow-[0_-18px_50px_rgba(0,0,0,0.18)] backdrop-blur-md">
      <div className="mx-auto grid max-w-5xl gap-9 px-5 py-12 sm:px-8 sm:py-14 md:grid-cols-[190px_minmax(0,1fr)] md:gap-14">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-memory-amber/70 bg-[#21130e] text-memory-cream shadow-[0_0_0_4px_rgba(217,154,69,0.08)]">
              <PlayIcon className="ml-0.5 h-4 w-4 text-memory-amber-soft" />
            </div>
            <div>
              <div className="font-serif text-2xl font-semibold leading-none text-memory-cream">
                Safarnama
              </div>
              <div className="small-caps mt-1 text-[9px] text-memory-amber-soft">
                Music &amp; memories
              </div>
            </div>
          </div>
          <span className="small-caps text-[9px] tracking-[0.22em] text-memory-cream/38">
            Made with love❤️
          </span>
        </div>

        <div className="max-w-3xl space-y-4 text-sm leading-6 text-memory-cream/62 sm:text-[15px]">
          <p>
            Safarnama does <strong className="font-semibold text-memory-cream/85">not claim
            ownership or copyright over any of the songs</strong>. The music is used solely
            as part of this personal/project website for{" "}
            <strong className="font-semibold text-memory-cream/85">demonstration, educational,
            and entertainment purposes</strong>.
          </p>
          <p>
            <strong className="font-semibold text-memory-cream/85">No ownership is claimed
            over third-party music. All rights remain with their respective copyright
            holders.</strong>
          </p>
          <div className="border-t border-white/10 pt-4 text-xs text-memory-cream/42">
            © 2026 Safarnama — Website design and original code are the property of
            Safarnama.
          </div>
        </div>
      </div>
    </footer>
  );
}
