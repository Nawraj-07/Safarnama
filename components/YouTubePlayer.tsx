"use client";

import { useEffect, useRef } from "react";

type YouTubePlayerProps = {
  playlistId: string;
  onReady: (player: YouTubePlayer) => void;
  onStateChange: (state: YouTubePlayerState, player: YouTubePlayer) => void;
  onError: (errorCode: number, player: YouTubePlayer) => void;
};

let apiPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return apiPromise;
}

export function YouTubePlayer({
  playlistId,
  onReady,
  onStateChange,
  onError,
}: YouTubePlayerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const currentPlaylistIdRef = useRef<string | null>(null);
  const callbackRef = useRef({ onReady, onStateChange, onError });

  useEffect(() => {
    callbackRef.current = { onReady, onStateChange, onError };
  }, [onReady, onStateChange, onError]);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !elementRef.current) return;

      if (!playerRef.current) {
        const player = new window.YT!.Player(elementRef.current, {
          width: "100%",
          height: "100%",
          playerVars: {
            listType: "playlist",
            list: playlistId,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            fs: 0,
            origin:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event) => callbackRef.current.onReady(event.target),
            onStateChange: (event) =>
              callbackRef.current.onStateChange(event.data, event.target),
            onError: (event) =>
              callbackRef.current.onError(event.data, event.target),
          },
        });

        playerRef.current = player;
        currentPlaylistIdRef.current = playlistId;
      } else if (currentPlaylistIdRef.current !== playlistId) {
        playerRef.current.loadPlaylist(playlistId, 0, 0);
        currentPlaylistIdRef.current = playlistId;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [playlistId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-black ring-1 ring-white/10">
      <div ref={elementRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
