# Emad & Alia — Wedding Invitation

**Live Production Link**: [https://abanouprefat.github.io/emad-alia/](https://abanouprefat.github.io/emad-alia/)

Built on the Da3wa platform pattern: Vite + React + GSAP + config-driven content.

## Run it
```
npm install
npm run dev
```

## Structure
- `src/config/emadAlia.js` — every piece of client-specific content (names,
  date, venue, story beats, video paths). To re-skin for a new couple,
  duplicate this file and swap the values + palette.
- `src/components/` — Gate (page-1 opening), Countdown, StoryTimeline
  (draggable), GuestBook — all reusable across clients.
- `src/pages/` — the 6 scroll-snap sections, thin wrappers around the
  components + this client's config.
- `public/media/` — the couple hero video (mp4 + webm + poster), used on
  page 6.

## Known integration points (not wired yet)
- **Guest book persistence** — messages currently live in component state
  only (`src/components/GuestBook.jsx`), so they reset on reload. Swap
  `submitMessage()` for a Supabase insert/read against a `guestbook` table
  keyed by client slug.
- **Remind me** — currently generates a downloadable `.ics` file client-side
  (zero backend needed). If you want an actual push/email reminder instead,
  that needs a backend job.
- **Map** — page 4 links out to Google Maps rather than embedding an iframe,
  to avoid needing a Maps API key. Swap in an embed if you have one.
- **Howler** — installed per the platform's stack but not yet used here;
  there's no sound cue in this client's brief. Wire it into `Gate.jsx` if
  you want a chime on open.

## Fonts
Cormorant Garamond + Jost (Latin), Amiri + IBM Plex Sans Arabic (Arabic),
loaded via Google Fonts in `index.html`.
