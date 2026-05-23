# Lyrics

A minimal, mobile-first song lyrics browser built with React + Vite.

## How it works

Songs are stored as markdown files in `public/lyrics/`. Each file has a frontmatter header with `title` and `singer`, followed by the lyrics body.

A build script reads all those files and generates a slim `public/data/songs.json` (path, title, singer — no lyrics content). At runtime the app fetches this index to populate the song list, then fetches the individual `.md` file when a song is selected.

Navigation is handled with `history.pushState` and a `?path=` query param — no router library.

## Adding songs

1. Add a markdown file to `public/lyrics/`:
   ```
   ---
   title: "Song Title"
   singer: "Artist Name"
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
```
