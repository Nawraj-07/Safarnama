"use client";

import { useEffect, useState } from "react";

import { Clock } from "./Clock";

export function Header() {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(Math.min(window.scrollY * 0.35, 28));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="pointer-events-none relative z-20 w-full px-5 pt-5 sm:px-8 sm:pt-7 md:pt-8">
      <div
        className="mx-auto flex w-full max-w-5xl justify-start pl-[clamp(0.75rem,2.8vw,2.75rem)] pt-[clamp(0.5rem,2vh,1.5rem)] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(-${scrollOffset}px)` }}
      >
        <div className="pointer-events-auto glass-soft rounded-full px-4 py-2.5">
          <Clock />
        </div>
      </div>
    </header>
  );
}
