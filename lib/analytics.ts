import { track as vercelTrack } from "@vercel/analytics";

type EventName =
  | "playlist_selected"
  | "track_play"
  | "track_pause"
  | "track_next"
  | "track_previous"
  | "track_seek_forward"
  | "track_seek_backward"
  | "track_seek"
  | "track_select"
  | "youtube_track_error"
  | "journey_complete";

type EventProps = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: EventName, props?: EventProps) {
  if (typeof window === "undefined") return;
  try {
    vercelTrack(name, props);
  } catch {
    // Analytics must never affect playback.
  }
}
