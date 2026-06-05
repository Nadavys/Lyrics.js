# Lyrics

A minimal, mobile-first song lyrics browser with a terminal UI for managing the song library.

The web app (React + Vite) lets you browse and read lyrics on any device. The TUI (ink + Node) lets you add songs from the terminal — just enter an artist and title and lyrics are fetched automatically.

## How it works

### Web app

Songs are stored as markdown files in `public/lyrics/`. Each file has a frontmatter header with `title` and `singer`, followed by the lyrics body.

A build script reads all those files and generates a slim `public/data/songs.json` (path, title, singer — no lyrics content). At runtime the app fetches this index to populate the song list, then fetches the individual `.md` file when a song is selected.

Navigation is handled with `history.pushState` and a `?path=` query param — no router library.

### TUI

A terminal song manager (`tui/`) built with [ink](https://github.com/vadimdemedes/ink). Run `pnpm tui` to open it.

- Browse the song list with arrow keys or `j`/`k`
- Press `a` to add a song — enter artist and title, lyrics are fetched from [lyrics.ovh](https://lyricsovh.docs.apiary.io/) automatically
- Review the full lyrics, then approve (`1`) to save or reject (`2`) to try again
- The song index rebuilds automatically after every change

## Adding songs

The easiest way is the TUI:

```bash
pnpm tui   # open the song manager
```

Press `a`, enter an artist and title — lyrics are fetched automatically from lyrics.ovh.
Approve to save, or reject to try a different song. The index rebuilds automatically.

You can also add songs manually:

1. Add a markdown file to `public/lyrics/`:
   ```
   ---
   title: "Song Title"
   artist: "Artist Name"
   ---
   
   [Verse 1]
   lyrics here...
   ```
2. Run `pnpm build:songs` to regenerate the index.

## Commands

```bash
pnpm dev          # start dev server
pnpm build:songs  # regenerate public/data/songs.json from lyrics files
pnpm build        # type-check + production build
pnpm preview      # preview production build locally
pnpm tui          # terminal UI for managing songs
```
