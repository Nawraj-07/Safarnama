"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/format";

type SeekBarProps = {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
};

export function SeekBar({ currentTime, duration, onSeek }: SeekBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [draggingTime, setDraggingTime] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const pointerIdRef = useRef<number | null>(null);

  const safeDuration = duration > 0 ? duration : 0;
  const displayedTime =
    draggingTime ?? clamp(currentTime, 0, safeDuration || currentTime);
  const progress = safeDuration > 0 ? displayedTime / safeDuration : 0;

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
      setDraggingTime(timeFromClientX(event.clientX));
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

  return (
    <div
      className="seek-range group relative flex h-7 cursor-pointer touch-none select-none items-center py-2"
      onPointerDown={(event) => {
        if (!trackRef.current || safeDuration <= 0) return;
        pointerIdRef.current = event.pointerId;
        trackRef.current.setPointerCapture?.(event.pointerId);
        setDraggingTime(timeFromClientX(event.clientX));
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
      }}
    >
      <div ref={trackRef} className="relative h-[3px] w-full rounded-full bg-white/20">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-memory-amber to-memory-amber-soft"
          style={{ width: `${Math.min(Math.max(progress * 100, 0), 100)}%` }}
        />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-memory-cream shadow-[0_0_18px_rgba(243,228,200,0.75)] transition-transform duration-150"
          style={{
            left: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
            transform: `translate(-50%, -50%) scale(${draggingTime !== null || hovering ? 1 : 0})`,
          }}
        />
      </div>
    </div>
  );
}
