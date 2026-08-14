"use client";

import { useIstTime } from "./IstTimeProvider";

export function Clock() {
  const { clockParts, dateText } = useIstTime();

  return (
    <div className="leading-tight">
      <div
        className="font-mono text-sm tracking-wider text-memory-cream tabular-nums sm:text-[15px]"
        suppressHydrationWarning
      >
        {clockParts ? (
          <>
            {clockParts.hour}
            <span className="clock-colon">:</span>
            {clockParts.minute} {clockParts.dayPeriod}
          </>
        ) : (
          "--:--"
        )}
      </div>
      <div className="small-caps mt-1 text-[9px] text-memory-cream/55 sm:text-[10px]">
        {dateText || "-- --"}
      </div>
    </div>
  );
}
