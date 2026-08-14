import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11.07-6.86a1 1 0 0 0 0-1.72L9.52 4.28A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <rect x="6.25" y="5" width="4.1" height="14" rx="1.2" />
      <rect x="13.65" y="5" width="4.1" height="14" rx="1.2" />
    </svg>
  );
}

export function PreviousIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M6 5.75a1 1 0 0 1 2 0v12.5a1 1 0 1 1-2 0V5.75Z" />
      <path d="M19.18 5.29a1 1 0 0 0-1.55-.84l-8.94 6.25a1 1 0 0 0 0 1.68l8.94 6.26a1 1 0 0 0 1.55-.84V5.29Z" />
    </svg>
  );
}

export function NextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M16 5.75a1 1 0 0 1 2 0v12.5a1 1 0 1 1-2 0V5.75Z" />
      <path d="M4.82 5.29a1 1 0 0 1 1.55-.84l8.94 6.25a1 1 0 0 1 0 1.68L6.37 18.64a1 1 0 0 1-1.55-.84V5.29Z" />
    </svg>
  );
}

export function RewindIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M11.1 8.4 5.8 12l5.3 3.6v-7.2Z" />
      <path d="M18.8 8.4 13.5 12l5.3 3.6v-7.2Z" />
    </svg>
  );
}

export function ForwardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12.9 8.4 18.2 12l-5.3 3.6v-7.2Z" />
      <path d="M5.2 8.4 10.5 12l-5.3 3.6v-7.2Z" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m6.5 9 5.5 5.5L17.5 9" />
    </svg>
  );
}

export function ChevronUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m6.5 15 5.5-5.5 5.5 5.5" />
    </svg>
  );
}

export function RoadTripCarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} viewBox="0 0 32 20" strokeWidth={1.65} {...props}>
      <path d="M3.5 13.5v-3.1c0-.9.55-1.7 1.38-2.03l3.02-1.2 2.08-3.27c.42-.66 1.15-1.06 1.94-1.06h6.95c.91 0 1.74.5 2.16 1.3l1.55 2.94 3.87.84c1.19.26 2.05 1.31 2.05 2.53v3.05c0 .88-.72 1.6-1.6 1.6H5.1c-.88 0-1.6-.72-1.6-1.6Z" fill="currentColor" stroke="currentColor" />
      <path d="m10.25 7.07 1.54-2.42h6.62l1.27 2.42h-9.43Z" fill="#241B14" stroke="none" opacity=".78" />
      <circle cx="9.2" cy="14.55" r="2.15" fill="#241B14" stroke="currentColor" />
      <circle cx="24.1" cy="14.55" r="2.15" fill="#241B14" stroke="currentColor" />
      <circle cx="9.2" cy="14.55" r=".7" fill="currentColor" stroke="none" />
      <circle cx="24.1" cy="14.55" r=".7" fill="currentColor" stroke="none" />
      <path d="M4.3 10.8h2.3M25.9 10.8h1.5" stroke="#f3e4c8" strokeWidth="1.1" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="16.8" cy="7.2" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VinylIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.8" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 12.7a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4Z" fill="currentColor" />
    </svg>
  );
}
