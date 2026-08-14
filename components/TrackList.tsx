"use client";

import { Equalizer } from "./Equalizer";
import { formatTime } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";
import type { Track } from "@/lib/types";

type TrackListProps = {
  tracks: Track[];
  currentTrackId: string | null;
  isPlaying: boolean;
  onSelect: (index: number) => void;
};

function inferDuration(track: Track): string {
  if (track.duration) return track.duration;
  return "--:--";
}

export function TrackList({
  tracks,
  currentTrackId,
  isPlaying,
  onSelect,
}: TrackListProps) {
  return (
    <section
      id="tracks"
      aria-label="Track list"
      className="glass-panel relative z-20 mx-auto w-full max-w-5xl rounded-[28px] p-3 sm:p-4"
    >
      <div className="mb-3 flex items-center justify-between px-2">
        <div>
          <p className="small-caps text-[10px] text-memory-amber-soft">
            Your journey
          </p>
          <h3 className="font-serif text-2xl text-memory-cream">Playlist</h3>
        </div>
        <div className="small-caps text-[10px] text-memory-cream/48">
          {tracks.length} memories
        </div>
      </div>

      <div className="max-h-[36vh] min-h-[170px] space-y-1 overflow-y-auto overscroll-contain px-1 pb-1 no-scrollbar lg:max-h-[290px]">
        {tracks.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-memory-cream/55">
            Reading the road ahead… tracks will appear as the playlist loads.
          </div>
        )}

        {tracks.map((track, index) => {
          const active = track.id === currentTrackId;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => {
                trackEvent("track_select", {
                  trackId: track.id,
                  videoId: track.videoId,
                  index,
                });
                onSelect(index);
              }}
              className={`focus-ring grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                active
                  ? "bg-memory-amber/14 ring-1 ring-memory-amber/30"
                  : "hover:bg-white/[0.065]"
              }`}
              aria-current={active ? "true" : undefined}
            >
              <div
                className={`small-caps w-7 text-center text-xs ${
                  active ? "text-memory-amber-soft" : "text-memory-cream/35"
                }`}
              >
                {active ? (
                  <Equalizer isPlaying={isPlaying} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </div>
              <div className="min-w-0">
                <div
                  className={`truncate text-sm font-medium ${
                    active ? "text-memory-cream" : "text-memory-cream/84"
                  }`}
                >
                  {track.title}
                </div>
                <div className="truncate text-xs text-memory-cream/52">
                  {track.artist}
                  {track.film ? ` • ${track.film}` : ""}
                </div>
              </div>
              <div className="font-mono text-[11px] tabular-nums text-memory-cream/48">
                {inferDuration(track)}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export { formatTime };
