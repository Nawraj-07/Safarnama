"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/format";
import { RoadTripCarIcon } from "./icons";

type SeekBarProps = {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
};

export function SeekBar({ currentTime, duration, onSeek }: SeekBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [draggingTime, setDraggingTime] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const pointerIdRef = useRef<number | null>(null);

  const safeDuration = duration > 0 ? duration : 0;
  const displayedTime =
    draggingTime ?? clamp(currentTime, 0, safeDuration || currentTime);
  const progress = safeDuration > 0 ? displayedTime / safeDuration : 0;
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const carTravelDistance = Math.max(trackWidth - 28, 0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateWidth = () => setTrackWidth(track.getBoundingClientRect().width);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const timeFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track || safeDuration <= 0) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return ratio * safeDuration;
  }, [safeDuration]);

  useEffect(() => {
    if (pointerIdRef.current === null) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerIdRef.current) return;
      const nextTime = timeFromClientX(event.clientX);
      setDraggingTime(nextTime);
      onSeek(nextTime);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerIdRef.current) return;
      pointerIdRef.current = null;
      const finalTime = timeFromClientX(event.clientX);
      setDraggingTime(null);
      onSeek(finalTime);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [onSeek, timeFromClientX]);

  const beginSeekAtPoint = useCallback(
    (clientX: number) => {
      if (safeDuration <= 0) return;
      const nextTime = timeFromClientX(clientX);
      setDraggingTime(nextTime);
      onSeek(nextTime);
    },
    [onSeek, safeDuration, timeFromClientX]
  );

  return (
    <div
      className="seek-range group relative flex h-7 cursor-pointer touch-none select-none items-center py-2"
      onPointerDown={(event) => {
        if (!trackRef.current || safeDuration <= 0) return;
        event.preventDefault();
        pointerIdRef.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        beginSeekAtPoint(event.clientX);
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role="slider"
      aria-label="Seek playback position"
      aria-valuemin={0}
      aria-valuemax={Math.round(safeDuration)}
      aria-valuenow={Math.round(displayedTime)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (safeDuration <= 0) return;

        if (event.key === "ArrowRight") {
          event.preventDefault();
          onSeek(clamp(displayedTime + 5, 0, safeDuration));
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onSeek(clamp(displayedTime - 5, 0, safeDuration));
        }
        if (event.key === "Home") {
          event.preventDefault();
          onSeek(0);
        }
        if (event.key === "End") {
          event.preventDefault();
          onSeek(safeDuration);
        }
      }}
    >
      <div ref={trackRef} className="relative h-[3px] w-full rounded-full bg-white/20">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-memory-amber to-memory-amber-soft"
          style={{ width: `${safeProgress * 100}%` }}
        />
        <div
          className={`pointer-events-none absolute left-0 top-1/2 z-10 transition-transform ${
            draggingTime === null ? "duration-500 ease-linear" : "duration-0"
          }`}
          style={{
            transform: `translateX(${safeProgress * carTravelDistance}px)`,
          }}
        >
          <RoadTripCarIcon
            className={`h-[18px] w-7 -translate-y-[58%] text-memory-amber-soft drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-transform duration-200 ${
              draggingTime !== null || hovering ? "scale-110" : "scale-100"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
