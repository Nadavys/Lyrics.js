# TUI Plan

## Phase 3 — Add song via lyrics.ovh

### Goal

When the user presses `a` in the song list, the TUI:

1. Prompts for **artist name**, then **song title**
2. Fetches lyrics from `GET https://api.lyrics.ovh/v1/{artist}/{title}`
3. **Found** → shows a preview + confirm prompt → saves the file + rebuilds the index
4. **Not found (404)** → "No lyrics found — check for typos" → return to list
5. **Network/other error** → show error message → return to list

---

### New dependency

```
ink-text-input   # standard ink text-input component (handles cursor, backspace, submit)
```

---

### New files

#### `tui/src/build.ts`

Runs `build-songs.js` (the existing index builder) synchronously after any write.

```ts
import { spawnSync } from 'node:child_process'
import { BUILD_SCRIPT } from './songs.ts'

export function rebuildIndex(): void {
  spawnSync('node', [BUILD_SCRIPT], { stdio: 'inherit' })
}
```

#### `tui/src/components/AddForm.tsx`

Internal state machine:

```
artist   →   title   →   fetching   →   found      →  (save + back to list)
                                    ↘   not_found  →  (back to list)
                                    ↘   error      →  (back to list)
```

- **artist step** — `TextInput`, submit moves to `title`
- **title step** — `TextInput`, submit triggers API fetch
- **fetching** — shows "Searching for lyrics…", `useEffect` calls `fetch()`
- **found** — shows artist / title / first 4 lyric lines, hint bar `Enter save  Esc cancel`
- **not_found** — "No lyrics found — check for typos". Enter or Esc → back to list
- **error** — shows HTTP status / exception message. Enter or Esc → back to list

Slug: `toSlug(title)` from `songs.ts`. If slug already exists: `toSlug(title + '-' + artist)`.

---

### Modified files

#### `tui/src/components/App.tsx`

Add the `add` case:

```tsx
if (mode.type === 'add') {
  return <AddForm onDone={() => setMode({ type: 'list' })} />
}
```

`SongList` remounts on every `list` transition, so `listSongs()` re-runs automatically.

---

### Verification

1. `pnpm tui` → song list shows
2. Press `a` → "Artist:" prompt
3. Enter artist + title (known song) → "Searching…" → preview
4. Press Enter → back to list, new song visible
5. Check `public/lyrics/{slug}.md` exists with correct frontmatter
6. Check `public/data/songs.json` has the new entry
7. Repeat with typo / unknown song → "No lyrics found" → Esc returns to list
