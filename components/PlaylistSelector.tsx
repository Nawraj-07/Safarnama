import type { Playlist } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

type PlaylistSelectorProps = {
  playlists: Playlist[];
  activePlaylistId: string;
  onSelect: (playlist: Playlist) => void;
};

export function PlaylistSelector({
  playlists,
  activePlaylistId,
  onSelect,
}: PlaylistSelectorProps) {
  const collectionThemes = [
    "from-[#30253d] via-[#241B14] to-[#17141f] border-[#c9b6df]/30",
    "from-[#5a3020] via-[#2d1b15] to-[#241B14] border-[#e4a16d]/35",
    "from-[#5a431d] via-[#2e2415] to-[#241B14] border-[#e7bb6d]/35",
    "from-[#25404a] via-[#18282d] to-[#241B14] border-[#9dcbd0]/30",
  ];

  return (
    <section className="relative z-20 mx-auto w-full max-w-5xl px-5 pb-6 sm:px-8">
      <div className="rounded-[30px] border border-memory-amber/25 bg-[#241B14]/88 p-4 shadow-[0_24px_70px_-26px_rgba(17,10,5,0.95)] backdrop-blur-xl sm:p-5">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-memory-amber/45" />
          <p className="small-caps text-[10px] font-semibold text-memory-amber-soft">
            Choose your journey
          </p>
          <span className="h-px w-12 bg-memory-amber/45" />
        </div>

        <p className="mb-4 text-center text-sm text-memory-cream/65">
          Pick a collection and let the road set the mood.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {playlists.map((playlist, index) => {
          const active = playlist.id === activePlaylistId;
          const theme = collectionThemes[index % collectionThemes.length];
          return (
            <button
              key={playlist.id}
              type="button"
              onClick={() => {
                trackEvent("playlist_selected", { playlistId: playlist.id });
                onSelect(playlist);
              }}
              aria-pressed={active}
              className={`focus-ring group relative overflow-hidden rounded-[22px] border p-[1px] text-left transition duration-300 ${theme} ${
                active
                  ? "scale-[1.01] shadow-[0_18px_60px_-22px_rgba(217,154,69,0.9)]"
                  : "hover:-translate-y-0.5 hover:brightness-110"
              }`}
            >
              <div
                className={`absolute inset-0 ${
                  active
                    ? "bg-gradient-to-br from-memory-amber/75 via-memory-cream/25 to-memory-terracotta/60"
                    : "bg-white/[0.06]"
                }`}
              />
              <div
                className={`relative flex h-full min-h-[118px] items-center gap-4 rounded-[21px] bg-[#241B14]/88 p-4 sm:p-5 ${
                  active
                    ? "ring-1 ring-memory-cream/15"
                    : "group-hover:bg-[#2d2119]/95"
                }`}
              >
                <div
                  className={`font-serif text-4xl leading-none ${
                    active ? "text-memory-amber-soft" : "text-memory-cream/45"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-xl leading-tight text-memory-cream sm:text-2xl">
                    {playlist.name}
                  </div>
                  <div className="mt-1 truncate text-xs italic text-memory-cream/62 sm:text-sm">
                    {playlist.subtitle}
                  </div>
                </div>
                <div
                  className={`h-2.5 w-2.5 shrink-0 rounded-full transition ${
                    active
                      ? "bg-memory-amber-soft shadow-[0_0_20px_rgba(228,181,109,0.9)]"
                      : "bg-white/20"
                  }`}
                />
              </div>
            </button>
          );
          })}
        </div>
      </div>
    </section>
  );
}
