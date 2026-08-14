export type TimeOfDay = "morning" | "day" | "evening" | "night";

const IST_TIME_ZONE = "Asia/Kolkata";

export function getIstMinutes(date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function getTimeOfDayFromMinutes(minutes: number): TimeOfDay {
  const time = ((minutes % 1440) + 1440) % 1440;

  if (time >= 5 * 60 && time < 9 * 60) return "morning";
  if (time >= 9 * 60 && time < 17 * 60) return "day";
  if (time >= 17 * 60 && time < 19 * 60) return "evening";
  return "night";
}

export function getTimeOfDay(date = new Date()): TimeOfDay {
  return getTimeOfDayFromMinutes(getIstMinutes(date));
}
