# Nostalgia Road — Memories, Music, Miles

A cinematic, responsive Next.js single-page music player themed around an Indian road-trip memory. It streams the user-provided YouTube playlists through the official YouTube IFrame Player API.

## Tech stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.*`)
- `@vercel/analytics`
- `@vercel/speed-insights`

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Playlists

Configured in `lib/playlists.ts`:

- KK — `PLiOv1zJvJ3MPBOXkh535UxGQ1PFxt0k-n`
- Atif Aslam — `PLqyjjU4T15JBItXMBa0vlDqcfg_J8zr2m`

To add another playlist, append one object to that array.

## Copyright/content note

The app does not download, re-host, or proxy YouTube media. It embeds only the videos exposed through YouTube's official IFrame API, and skips videos that return an embedding/availability error.
