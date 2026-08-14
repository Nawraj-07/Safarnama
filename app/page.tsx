"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MusicPlayer, type MusicPlayerState } from "@/components/MusicPlayer";
import { PlaylistSelector } from "@/components/PlaylistSelector";
import { TrackList } from "@/components/TrackList";
import { LOOP_PLAYLIST, playlists as initialPlaylists } from "@/lib/playlists";
import { trackEvent } from "@/lib/analytics";
import { clamp } from "@/lib/format";
import { IstTimeProvider, useIstTime } from "@/components/IstTimeProvider";
import type { Playlist, Track } from "@/lib/types";

function mapVideoIdsToTracks(
  videoIds: string[],
  playlist: Playlist
): Track[] {
  return videoIds.map((videoId, index) => ({
    id: `${playlist.id}-${index}-${videoId}`,
    title: `Memory ${String(index + 1).padStart(2, "0")}`,
    artist: playlist.name,
    film: playlist.subtitle,
    videoId,
  }));
}

const BROKEN_TRACK_POSITIONS = new Set([36, 52, 53, 54, 55]);

function sanitizePlaylistTracks<T>(items: T[]): T[] {
  return items.filter((_, index) => !BROKEN_TRACK_POSITIONS.has(index + 1));
}

function dedupePlaylistTrackIds(videoIds: string[]): string[] {
  const seen = new Set<string>();

  return videoIds.filter((videoId) => {
    const trimmed = videoId.trim();
    if (!trimmed || seen.has(trimmed)) return false;
    seen.add(trimmed);
    return true;
  });
}

function getJourneyVideoIds(videoIds: string[], playlist: Playlist): string[] {
  const uniqueIds = dedupePlaylistTrackIds(
    sanitizePlaylistTracks(videoIds.filter((videoId) => Boolean(videoId)))
  );

  if (!playlist.featuredVideoId && !playlist.closingVideoId) return uniqueIds;

  const trackIds = [...uniqueIds];

  if (playlist.featuredVideoId) {
    const featuredVideoId = playlist.featuredVideoId.trim();
    if (featuredVideoId && !trackIds.includes(featuredVideoId)) {
      trackIds.unshift(featuredVideoId);
    }
  }

  if (playlist.closingVideoId) {
    const closingVideoId = playlist.closingVideoId.trim();
    if (closingVideoId && !trackIds.includes(closingVideoId)) {
      trackIds.push(closingVideoId);
    }
  }

  return dedupePlaylistTrackIds(trackIds);
}

function cleanVideoTitle(rawTitle: string): string {
  return rawTitle
    .split(/[|\u2022\u00b7]/)[0]
    .replace(/\s*\[.*?\]\s*/g, " ")
    .replace(/\s*\(.*?official.*?\)\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function fetchTrackTitles(tracks: Track[]): Promise<Track[]> {
  const queue = tracks.map((track, index) => ({ track, index }));
  const result = [...tracks];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) return;

      const { track, index } = item;

      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(
            track.videoId
          )}&format=json`,
          { cache: "force-cache" }
        );
        if (!response.ok) continue;

        const data = (await response.json()) as { title?: string };
        const title = data.title ? cleanVideoTitle(data.title) : undefined;

        if (title) {
          result[index] = { ...result[index], ...track, title };
        }
      } catch {
        // Missing metadata is not fatal; player metadata can still fill it.
      }
    }
  }

  await Promise.all(Array.from({ length: 5 }, worker));
  return result.map((track, index) => ({
    ...track,
    film: track.film || `Track ${index + 1}`,
  }));
}

function SafarnamaExperience() {
  const [activePlaylist, setActivePlaylist] = useState<Playlist>(initialPlaylists[0]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const { timeOfDay } = useIstTime();

  const playerRef = useRef<YouTubePlayer | null>(null);
  const activePlaylistRef = useRef(activePlaylist);
  const tracksRef = useRef<Track[]>([]);
  const currentIndexRef = useRef(0);
  const isLoadingPlaylistRef = useRef(false);
  const playlistLoadVersionRef = useRef(0);
  const lastManualActionRef = useRef(0);
  const lastPlayedVideoIdRef = useRef<string | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  useEffect(() => {
    activePlaylistRef.current = activePlaylist;
  }, [activePlaylist]);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const currentTrack = tracks[currentIndex] ?? null;

  const setTemporaryError = useCallback((message: string) => {
    setErrorMessage(message);
    if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    errorTimerRef.current = window.setTimeout(() => {
      setErrorMessage(null);
    }, 3800);
  }, []);

  const goToIndex = useCallback(
    (nextIndex: number, autoplay: boolean) => {
      const player = playerRef.current;
      const currentTracks = tracksRef.current;
      if (!player || currentTracks.length === 0) return;
      const safeIndex = clamp(nextIndex, 0, currentTracks.length - 1);
      setCurrentIndex(safeIndex);
      setCurrentTime(0);
      setDuration(0);
      if (autoplay) {
        lastManualActionRef.current = Date.now();
        player.loadVideoById(currentTracks[safeIndex].videoId, 0);
      } else {
        player.cueVideoById(currentTracks[safeIndex].videoId, 0);
      }
    },
    []
  );

  const loadPlaylistIntoPlayer = useCallback(
    (playlist: Playlist, autoplay: boolean) => {
      const player = playerRef.current;
      if (!player) return;

      const loadVersion = ++playlistLoadVersionRef.current;
      isLoadingPlaylistRef.current = true;
      setErrorMessage(null);

      if (autoplay) {
        player.loadPlaylist(playlist.youtubePlaylistId, 0, 0);
        lastManualActionRef.current = Date.now();
      } else {
        player.cuePlaylist(playlist.youtubePlaylistId, 0, 0);
      }

      // The YouTube API exposes the ordered playlist IDs once the playlist resolves.
      window.setTimeout(() => {
        if (loadVersion !== playlistLoadVersionRef.current) return;

        try {
          const ids = player.getPlaylist?.() ?? [];
          if (ids.length > 0) {
            const initialTracks = mapVideoIdsToTracks(
              getJourneyVideoIds(ids, playlist),
              playlist
            );
            setTracks(initialTracks);
            tracksRef.current = initialTracks;
            setCurrentIndex(0);
            currentIndexRef.current = 0;
            setCurrentTime(0);
            setDuration(0);
            fetchTrackTitles(initialTracks)
              .then((enrichedTracks) => {
                if (loadVersion === playlistLoadVersionRef.current) {
                  setTracks(enrichedTracks);
                  tracksRef.current = enrichedTracks;
                }
              })
              .catch(() => {});

            setIsPlaying(autoplay);
          }
        } catch {
          // Playlist list may not be available immediately; state-change can refresh it.
        } finally {
          isLoadingPlaylistRef.current = false;
        }
      }, 220);
    },
    []
  );

  const refreshTracksFromPlayer = useCallback(() => {
    const player = playerRef.current;
    if (!player || isLoadingPlaylistRef.current) return;
    try {
      const ids = player.getPlaylist?.() ?? [];
      if (ids.length === 0) return;
      const playlist = activePlaylistRef.current;
      const journeyIds = getJourneyVideoIds(ids, playlist);
      setTracks((previous) => {
        if (
          previous.length === journeyIds.length &&
          previous.every((track, index) => track.videoId === journeyIds[index])
        ) {
          return previous;
        }

        const initialTracks = mapVideoIdsToTracks(journeyIds, playlist);
        fetchTrackTitles(initialTracks)
          .then((enrichedTracks) => {
            if (!isLoadingPlaylistRef.current) setTracks(enrichedTracks);
          })
          .catch(() => {});
        return initialTracks;
      });
    } catch {
      // Ignore transient YouTube API errors.
    }
  }, []);

  const refreshCurrentTrackFromPlayer = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    try {
      const data = player.getVideoData?.();
      const playlistIds = player.getPlaylist?.() ?? [];
      const index = player.getPlaylistIndex?.();
      const knownTrackIndex = tracksRef.current.findIndex(
        (track) => track.videoId === data?.video_id
      );
      const matchedIndex =
        knownTrackIndex >= 0
          ? knownTrackIndex
          : typeof index === "number" && index >= 0
            ? index
            : playlistIds.findIndex((id) => id === data?.video_id);

      if (matchedIndex >= 0 && tracksRef.current[matchedIndex]) {
        setCurrentIndex((previous) =>
          previous === matchedIndex ? previous : matchedIndex
        );
        setTracks((previous) => {
          if (!data?.title) return previous;
          const cleanedTitle = cleanVideoTitle(data.title);
          if (previous[matchedIndex]?.title === cleanedTitle) return previous;
          const next = [...previous];
          next[matchedIndex] = {
            ...next[matchedIndex],
            title: cleanedTitle || data.title,
            artist: data.author || next[matchedIndex]?.artist || activePlaylistRef.current.name,
          };
          return next;
        });
      }
    } catch {
      // Ignore metadata refresh errors.
    }
  }, []);

  const handleReady = useCallback(
    (player: YouTubePlayer) => {
      playerRef.current = player;
      setPlayerReady(true);
      loadPlaylistIntoPlayer(activePlaylistRef.current, false);
    },
    [loadPlaylistIntoPlayer]
  );

  const skipToNext = useCallback(
    (source: "manual" | "ended" | "error") => {
      const currentTracks = tracksRef.current;
      const current = currentIndexRef.current;
      if (currentTracks.length === 0) return;

      if (current + 1 < currentTracks.length) {
        goToIndex(current + 1, true);
        trackEvent("track_next", { source, index: current + 1 });
        return;
      }

      if (LOOP_PLAYLIST) {
        goToIndex(0, true);
        trackEvent("track_next", { source, index: 0, looped: true });
        return;
      }

      setIsPlaying(false);
      setTemporaryError("That's the end of this journey.");
      trackEvent("journey_complete", { playlistId: activePlaylistRef.current.id });
    },
    [goToIndex, setTemporaryError]
  );

  const handleStateChange = useCallback(
    (state: YouTubePlayerState, player: YouTubePlayer) => {
      // Ignore terminal events from the previous journey while a new playlist loads.
      if (isLoadingPlaylistRef.current) {
        if (state === window.YT!.PlayerState.BUFFERING) setIsBuffering(true);
        return;
      }

      refreshTracksFromPlayer();

      if (state === window.YT!.PlayerState.PLAYING) {
        setIsPlaying(true);
        setIsBuffering(false);
        setErrorMessage(null);
        refreshCurrentTrackFromPlayer();
        const currentVideoId =
          player.getVideoData?.()?.video_id ||
          tracksRef.current[currentIndexRef.current]?.videoId ||
          null;
        if (currentVideoId && currentVideoId !== lastPlayedVideoIdRef.current) {
          lastPlayedVideoIdRef.current = currentVideoId;
          trackEvent("track_play", {
            videoId: currentVideoId,
            index: currentIndexRef.current,
          });
        }
        const data = player.getVideoData?.();
        if (data?.title) {
          setTracks((previous) =>
            previous.map((track, index) =>
              index === currentIndexRef.current
                ? {
                    ...track,
                    title: data.title
                      ? cleanVideoTitle(data.title) || data.title
                      : track.title,
                    artist: data.author || track.artist,
                  }
                : track
            )
          );
        }
      }

      if (state === window.YT!.PlayerState.PAUSED) {
        setIsPlaying(false);
        setIsBuffering(false);
        const data = player.getVideoData?.();
        trackEvent("track_pause", {
          videoId: data?.video_id,
          index: currentIndexRef.current,
        });
      }

      if (state === window.YT!.PlayerState.BUFFERING) {
        setIsBuffering(true);
      } else {
        setIsBuffering(false);
      }

      if (state === window.YT!.PlayerState.ENDED) {
        setIsPlaying(false);
        skipToNext("ended");
      }

      if (state === window.YT!.PlayerState.CUED) {
        refreshCurrentTrackFromPlayer();
      }
    },
    [refreshCurrentTrackFromPlayer, refreshTracksFromPlayer, skipToNext]
  );

  const handleError = useCallback(
    (errorCode: number, player: YouTubePlayer) => {
      const data = player.getVideoData?.();
      const videoId = data?.video_id || tracksRef.current[currentIndexRef.current]?.videoId || "";
      const trackId = tracksRef.current[currentIndexRef.current]?.id || "";

      trackEvent("youtube_track_error", {
        videoId,
        errorCode,
        trackId,
      });

      setTemporaryError("This memory is unavailable. Moving to the next song...");
      window.setTimeout(() => skipToNext("error"), 900);
    },
    [setTemporaryError, skipToNext]
  );

  // Progress polling — isolated timer, no effect dependency on rapidly changing values.
  useEffect(() => {
    if (!playerReady) return;

    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      try {
        const state = player.getPlayerState();
        if (
          state === window.YT?.PlayerState.PLAYING ||
          state === window.YT?.PlayerState.PAUSED ||
          state === window.YT?.PlayerState.BUFFERING
        ) {
          setCurrentTime(player.getCurrentTime() || 0);
          setDuration(player.getDuration() || 0);
        }
      } catch {
        // Polling should never throw into React.
      }
    }, 450);

    return () => window.clearInterval(timer);
  }, [playerReady]);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    };
  }, []);

  const handleSelectPlaylist = useCallback(
    (playlist: Playlist) => {
      if (playlist.id === activePlaylistRef.current.id) return;
      // Update refs synchronously so late events from the previous playlist are ignored.
      activePlaylistRef.current = playlist;
      setActivePlaylist(playlist);
      setIsPlaying(false);
      setIsBuffering(true);
      setCurrentTime(0);
      setDuration(0);
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      setTracks([]);
      tracksRef.current = [];
      lastPlayedVideoIdRef.current = null;
      loadPlaylistIntoPlayer(playlist, true);
    },
    [loadPlaylistIntoPlayer]
  );

  const handlePlayPause = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    lastManualActionRef.current = Date.now();

    if (isPlaying) {
      player.pauseVideo();
      return;
    }

    // If no track is cued, start the active playlist from track one.
    const currentTracks = tracksRef.current;
    if (currentTracks.length === 0) {
      loadPlaylistIntoPlayer(activePlaylistRef.current, true);
      return;
    }

    player.playVideo();
  }, [isPlaying, loadPlaylistIntoPlayer]);

  const handlePrevious = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const current = player.getCurrentTime?.() || 0;
    trackEvent("track_previous", {
      index: currentIndexRef.current,
      currentTime: Math.round(current),
    });

    if (current > 3) {
      player.seekTo(0, true);
      setCurrentTime(0);
      player.playVideo();
      return;
    }

    const previousIndex = currentIndexRef.current - 1;
    if (previousIndex >= 0) {
      goToIndex(previousIndex, true);
    } else {
      player.seekTo(0, true);
      setCurrentTime(0);
      player.playVideo();
    }
  }, [goToIndex]);

  const handleNext = useCallback(() => {
    skipToNext("manual");
  }, [skipToNext]);

  const handleSeek = useCallback(
    (time: number) => {
      const player = playerRef.current;
      if (!player || duration <= 0) return;
      const target = clamp(time, 0, duration);
      player.seekTo(target, true);
      setCurrentTime(target);
      trackEvent("track_seek", {
        time: Math.round(target),
        videoId: tracksRef.current[currentIndexRef.current]?.videoId,
      });
    },
    [duration]
  );

  const handleSeekBy = useCallback(
    (delta: number) => {
      const player = playerRef.current;
      if (!player) return;
      const playerDuration = player.getDuration?.() || duration || 0;
      const target = clamp((player.getCurrentTime?.() || 0) + delta, 0, playerDuration);
      player.seekTo(target, true);
      setCurrentTime(target);
      trackEvent(delta > 0 ? "track_seek_forward" : "track_seek_backward", {
        seconds: Math.abs(delta),
        time: Math.round(target),
      });
    },
    [duration]
  );

  const handleSelectTrack = useCallback(
    (index: number) => {
      goToIndex(index, true);
    },
    [goToIndex]
  );

  const playerState: MusicPlayerState = useMemo(
    () => ({
      isPlaying,
      isBuffering,
      currentTime,
      duration,
      currentTrack,
      errorMessage,
      playlistLabel: activePlaylist.subtitle,
      playerReady,
    }),
    [
      isPlaying,
      isBuffering,
      currentTime,
      duration,
      currentTrack,
      errorMessage,
      activePlaylist.subtitle,
      playerReady,
    ]
  );

  return (
    <main
      id="top"
      data-time={timeOfDay}
      className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden"
    >
      <div className="hero-bg fixed inset-0 z-0" aria-hidden="true" />
      <div className="environment-tint pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <div className="environment-horizon pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <div className="environment-mist pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <div className="environment-headlights pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <div className="environment-ambient pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <div className="grain-overlay pointer-events-none fixed inset-0 z-[2]" aria-hidden="true" />

      <Header />

      <div className="relative z-10 flex w-full flex-1 flex-col justify-center gap-8 pb-28 pt-24 sm:gap-10 lg:pb-12">
        <Hero />

        <div className="px-5 sm:px-8">
          <MusicPlayer
            {...playerState}
            playlistId={activePlaylist.youtubePlaylistId}
            onPlayPause={handlePlayPause}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSeek={handleSeek}
            onSeekBy={handleSeekBy}
            onYouTubeReady={handleReady}
            onYouTubeStateChange={handleStateChange}
            onYouTubeError={handleError}
          />
        </div>

        <div className="px-5 sm:px-8">
          <TrackList
            tracks={tracks}
            currentTrackId={currentTrack?.id ?? null}
            isPlaying={isPlaying}
            onSelect={handleSelectTrack}
          />
        </div>

        <PlaylistSelector
          playlists={initialPlaylists}
          activePlaylistId={activePlaylist.id}
          onSelect={handleSelectPlaylist}
        />

      </div>
      <Footer />
    </main>
  );
}

export default function Page() {
  return (
    <IstTimeProvider>
      <SafarnamaExperience />
    </IstTimeProvider>
  );
}
