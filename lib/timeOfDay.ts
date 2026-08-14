export type TimeOfDay =
  | "early-morning"
  | "morning"
  | "afternoon"
  | "sunset"
  | "dusk"
  | "night";

export function getTimeOfDay(date = new Date()): TimeOfDay {
  const hour = date.getHours() + date.getMinutes() / 60;

  if (hour >= 5 && hour < 8) return "early-morning";
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 19) return "sunset";
  if (hour >= 19 && hour < 20) return "dusk";
  return "night";
}
