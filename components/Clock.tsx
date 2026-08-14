"use client";

import { useEffect, useState } from "react";

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "short",
});

type ClockParts = {
  hour: string;
  minute: string;
  dayPeriod: string;
};

function getClockParts(date: Date): ClockParts {
  const parts = timeFormatter.formatToParts(date);
  return {
    hour: parts.find((part) => part.type === "hour")?.value ?? "",
    minute: parts.find((part) => part.type === "minute")?.value ?? "",
    dayPeriod:
      parts.find((part) => part.type === "dayPeriod")?.value ?? "",
  };
}

function getDateString(date: Date): string {
  return dateFormatter.format(date).toUpperCase();
}

export function Clock() {
  const [parts, setParts] = useState<ClockParts | null>(null);
  const [dateText, setDateText] = useState("");

  useEffect(() => {
    let timer: number | undefined;

    const tick = () => {
      const now = new Date();
      setParts(getClockParts(now));
      setDateText(getDateString(now));
      timer = window.setTimeout(tick, 1000);
    };

    tick();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="leading-tight">
      <div
        className="font-mono text-sm tracking-wider text-memory-cream tabular-nums sm:text-[15px]"
        suppressHydrationWarning
      >
        {parts ? (
          <>
            {parts.hour}
            <span className="clock-colon">:</span>
            {parts.minute} {parts.dayPeriod}
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
