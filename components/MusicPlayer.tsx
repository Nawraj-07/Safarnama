"use client";

import { useState } from "react";

import { SeekBar } from "./SeekBar";
import { YouTubePlayer } from "./YouTubePlayer";
import {
  ForwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PreviousIcon,
  RewindIcon,
} from "./icons";
import { formatTime } from "@/lib/format";
import type { Track } from "@/lib/types";

export type MusicPlayerState = {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  currentTrack: Track | null;
  errorMessage: string | null;
  playlistLabel: string;
  playerReady: boolean;
};

type MusicPlayerProps = MusicPlayerState & {
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onSeekBy: (delta: number) => void;
  onYouTubeReady: (player: YouTubePlayer) => void;
  onYouTubeStateChange: (
    state: YouTubePlayerState,
    player: YouTubePlayer
  ) => void;
  onYouTubeError: (errorCode: number, player: YouTubePlayer) => void;
  playlistId: string;
};

function ControlButton({
  label,
  onClick,
  children,
  primary = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`focus-ring inline-flex items-center justify-center rounded-full transition active:scale-95 ${
        primary
          ? "h-12 w-12 bg-gradient-to-b from-memory-amber-soft to-memory-terracotta text-memory-brown ring-1 ring-white/25 drop-shadow-[0_10px_25px_rgba(217,154,69,0.42)] hover:brightness-110"
          : "h-11 w-11 text-memory-cream/80 hover:bg-white/10 hover:text-memory-cream sm:h-10 sm:w-10"
      }`}
    >
      {children}
    </button>
  );
}

export function MusicPlayer({
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  currentTrack,
  errorMessage,
  playlistLabel,
  playerReady,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  onSeekBy,
  onYouTubeReady,
  onYouTubeStateChange,
  onYouTubeError,
  playlistId,
}: MusicPlayerProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <section
      aria-label="Music player"
      className={`glass-panel relative z-20 mx-auto w-full max-w-[760px] overflow-hidden rounded-[22px] transition-[max-width] duration-300 ${
        isMinimized ? "sm:max-w-[560px]" : ""
      }`}
    >
      <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
        <button
          type="button"
          aria-label={isMinimized ? "Expand player" : "Minimize player"}
          aria-expanded={!isMinimized}
          title={isMinimized ? "Expand player" : "Minimize player"}
          onClick={() => setIsMinimized((minimized) => !minimized)}
          className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-memory-cream/80 transition hover:bg-white/15 hover:text-memory-cream active:scale-95"
        >
          {isMinimized ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="small-caps text-[9px] text-memory-amber-soft">
            {isMinimized ? "Now playing" : "Playback controls"}
          </div>
          <div className="truncate text-sm font-medium text-memory-cream/90">
            {currentTrack?.title ?? "Select a journey and press play"}
          </div>
        </div>

        {isMinimized && (
          <ControlButton
            label={isPlaying ? "Pause" : "Play"}
            onClick={onPlayPause}
            primary
          >
            {isPlaying ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="ml-0.5 h-4 w-4" />
            )}
          </ControlButton>
        )}
      </div>

      <div
        aria-hidden={isMinimized}
        className={`grid overflow-hidden border-t border-white/10 bg-[#17120f]/85 transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isMinimized
            ? "pointer-events-none grid-rows-[0fr] opacity-0"
            : "grid-rows-[1fr] opacity-100"
        }`}
      >
        <div className="min-h-0">
          <div className="grid sm:grid-cols-[230px_minmax(0,1fr)]">
        <div className="relative aspect-video w-full overflow-hidden bg-black shadow-[0_18px_60px_-28px_rgba(0,0,0,0.95)] sm:aspect-auto sm:min-h-[178px]">
          <YouTubePlayer
            key={playlistId}
            playlistId={playlistId}
            onReady={onYouTubeReady}
            onStateChange={onYouTubeStateChange}
            onError={onYouTubeError}
          />

          {!playerReady && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-memory-cream/75">
                <span className="loading-bar h-1 w-32 rounded-full" />
              </div>
          )}

          {isBuffering && playerReady && (
              <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-memory-cream/80 backdrop-blur">
                Tuning in…
              </div>
          )}

          {errorMessage && (
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/72 px-4 py-3 text-center text-xs leading-5 text-memory-cream backdrop-blur-md sm:text-sm">
                {errorMessage}
              </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center px-4 py-4 sm:px-5">
          <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="small-caps mb-1 text-[10px] text-memory-amber-soft">
                  Now playing
                </div>
                <div className="truncate text-[15px] font-semibold leading-tight text-memory-cream sm:text-base">
                  {currentTrack?.title ?? "Select a journey and press play"}
                </div>
                <div className="truncate text-[12.5px] text-memory-cream/70">
                  {currentTrack?.artist ?? playlistLabel}
                </div>
                <div className="mt-1 truncate text-[11px] text-memory-cream/42">
                  {currentTrack?.film ?? "YouTube playlist"}
                  {currentTrack?.year ? ` • ${currentTrack.year}` : ""}
                </div>
              </div>
              <div className="hidden shrink-0 text-right md:block">
                <div className="small-caps text-[10px] text-memory-cream/42">
                  Journey
                </div>
                <div className="text-sm italic text-memory-cream/70">
                  {playlistLabel}
                </div>
              </div>
            </div>

            <SeekBar
              currentTime={currentTime}
              duration={duration}
              onSeek={onSeek}
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] tabular-nums text-memory-cream/55">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="mt-3 flex items-center gap-1 sm:gap-2">
              <ControlButton label="Back 10 seconds" onClick={() => onSeekBy(-10)}>
                <RewindIcon className="h-4 w-4" />
              </ControlButton>
              <ControlButton label="Previous song" onClick={onPrevious}>
                <PreviousIcon className="h-4 w-4" />
              </ControlButton>
              <ControlButton
                label={isPlaying ? "Pause" : "Play"}
                onClick={onPlayPause}
                primary
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5" />
                ) : (
                  <PlayIcon className="ml-0.5 h-5 w-5" />
                )}
              </ControlButton>
              <ControlButton label="Next song" onClick={onNext}>
                <NextIcon className="h-4 w-4" />
              </ControlButton>
              <ControlButton label="Forward 10 seconds" onClick={() => onSeekBy(10)}>
                <ForwardIcon className="h-4 w-4" />
              </ControlButton>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
