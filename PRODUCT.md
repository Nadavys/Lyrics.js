# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One primary user: the owner, singing along. They pull up lyrics on their phone mid-moment (karaoke, a party, a car ride) and need to find a song and read its words right away. The site is public at lyrics.joyfulweb.net, but it is not designed for a general audience.

## Product Purpose

A personal songbook. It goes from "I want to sing this" to the words on screen in as few steps as possible: search, tap, read. It works when the list is instant to search and the lyrics are easy to read while singing.

## Positioning

Unlike Genius, Google lyrics, or ad-funded lyrics sites:

- **Curated:** only the songs the owner cares about (about 90 at the moment, mostly 60s–80s pop and rock), so the list is short enough that finding a song takes seconds.
- **No clutter:** no ads, annotations, popups, accounts, or tracking. It opens straight to the words.
- **Offline:** an installable PWA that caches the song index and lyric files, so songs load with no signal.
- **Easy to add songs:** a terminal UI (`pnpm tui`) fetches lyrics from lyrics.ovh, shows them for review, then saves the song and rebuilds the index.

## Operating Context

- The main device is a phone, often held at arm's length or propped up, sometimes in dim light, while the user is singing.
- Songs are added from the terminal by the owner, never from the web UI.
- The site is deployed as static files to GitHub Pages (`.github/workflows/deploy.yml`, custom domain via `public/CNAME`).

## Capabilities and Constraints

- Two views: a searchable, alphabetical **song list** (filters by title or artist) and a **lyrics view** for a single song. Navigation uses `history.pushState` and a query param. There is no router library.
- Data: one markdown file per song in `public/lyrics/` (frontmatter `title` and `singer`), indexed into `public/data/songs.json` by `scripts/build-songs.js`. The app fetches the index first, then each song's `.md` file on demand.
- **Stay static:** no backend, no accounts, no server-side features.
- **Mobile-first, iOS Safari first and foremost:** the primary device and browser is an iPhone running Safari, in a tab or installed to the Home Screen. Touch targets, type sizes and spacing must work there first, and any browser trade-off favours iOS Safari.
- **Readable from afar:** lyrics must be legible at arm's length and in dim light.
- **English only:** all songs are English and left-to-right. No RTL or i18n work is needed.
- Stack: React 19 + TypeScript, Vite, Tailwind v4, vite-plugin-pwa. The TUI is a separate ink app in `tui/`.

## Brand Commitments

- The name is "Lyrics" (wordmark plus a small dot in the masthead). The PWA manifest name is "Lyrics".
- The tone is quiet and minimal. The interface stays out of the way of the words.

## Evidence on Hand

- About 90 real songs in `public/lyrics/`. The lyrics are copyrighted third-party text: show them in the app as stored, and never reproduce, sample, or invent lyric text in design work, mockups, or docs.
- There are no testimonials, metrics, or other users. Don't invent any.

## Product Principles

1. **Words first.** Every screen serves getting to the lyrics and reading them. Anything else has to justify its place.
2. **Fast to find.** Search is the main way to find a song: focused on load, instant, and forgiving.
3. **Readable mid-song.** Optimize for glancing at a phone held at arm's length while singing, not for close reading.
4. **Works anywhere.** Offline and static by design. Never add a dependency on a network service at read time.
5. **Personal, not a platform.** No social features, accounts, ads, or engagement mechanics.

## Accessibility & Inclusion

- Large, high-contrast lyric text that stays legible at a distance and in low light.
- Generous touch targets for one-handed use on a phone.
