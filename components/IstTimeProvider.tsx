"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getIstMinutes, getTimeOfDayFromMinutes, type TimeOfDay } from "@/lib/timeOfDay";

type ClockParts = {
  hour: string;
  minute: string;
  dayPeriod: string;
};

type IstTimeContextValue = {
  clockParts: ClockParts | null;
  dateText: string;
  timeOfDay: TimeOfDay;
};

const IstTimeContext = createContext<IstTimeContextValue | null>(null);

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

function getClockParts(date: Date): ClockParts {
  const parts = timeFormatter.formatToParts(date);
  return {
    hour: parts.find((part) => part.type === "hour")?.value ?? "",
    minute: parts.find((part) => part.type === "minute")?.value ?? "",
    dayPeriod: parts.find((part) => part.type === "dayPeriod")?.value ?? "",
  };
}

function getClockPartsFromMinutes(minutes: number): ClockParts {
  const totalMinutes = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const dayPeriod = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;

  return { hour: String(hour), minute: String(minute).padStart(2, "0"), dayPeriod };
}

export function IstTimeProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const tick = () => {
      setNow(new Date());
      timer = window.setTimeout(tick, 1000);
    };

    tick();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const value = useMemo<IstTimeContextValue>(() => {
    const liveMinutes = now ? getIstMinutes(now) : 0;

    return {
      clockParts: now ? getClockParts(now) : null,
      dateText: now ? dateFormatter.format(now).toUpperCase() : "",
      timeOfDay: now ? getTimeOfDayFromMinutes(liveMinutes) : "night",
    };
  }, [now]);

  return <IstTimeContext.Provider value={value}>{children}</IstTimeContext.Provider>;
}

export function useIstTime() {
  const context = useContext(IstTimeContext);
  if (!context) throw new Error("useIstTime must be used within IstTimeProvider");
  return context;
}
