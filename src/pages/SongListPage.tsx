import { useRef, useLayoutEffect, type RefObject } from 'react'
import { type Song } from '../data/songs'
import { type LoadStatus } from '../App'

interface Props {
  songs: Song[]
  status: LoadStatus
  onSelect: (path: string) => void
  filter: string
  onFilterChange: (filter: string) => void
  initialScrollYRef: RefObject<number>
}

export default function SongListPage({ songs, status, onSelect, filter, onFilterChange, initialScrollYRef }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    if (initialScrollYRef.current > 0) {
      window.scrollTo(0, initialScrollYRef.current)
    } else {
      inputRef.current?.focus()
    }
  }, [initialScrollYRef])

  const f = filter.trim().toLowerCase()
  const rows = songs.filter(s => {
    if (!f) return true
    return s.title.toLowerCase().includes(f) || s.artist.toLowerCase().includes(f)
  }).sort((a, b) => a.title.localeCompare(b.title))

  return (
    <main className="max-w-[760px] mx-auto px-4 pt-6 pb-20 wide:px-8 wide:pt-14 wide:pb-[120px]">
      <header className="flex items-baseline justify-between mb-8 wide:mb-12">
        <h1 className="type-brand m-0">
          Lyrics
          <span className="inline-block w-1.5 h-1.5 bg-ink rounded-full ml-[1px] mr-[2px] mb-[2px] align-middle" aria-hidden="true" />
        </h1>
      </header>

      <div className="relative mb-2">
        <span className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none text-muted" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25" />
            <line x1="12.2" y1="12.2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </span>
        <input
          ref={inputRef}
          id="q"
          type="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-label="Search by song or artist"
          placeholder="Search by song or artist"
          value={filter}
          onChange={e => onFilterChange(e.target.value)}
          className="w-full border-0 border-b border-ink rounded-none bg-transparent type-search py-4 pl-9 pr-0 text-ink outline-none placeholder:text-muted placeholder:font-light focus-visible:border-b-2 focus-visible:pb-[15px] wide:py-[14px] wide:focus-visible:pb-[13px]"
        />
      </div>

      <div className="type-label text-muted mt-[18px] mb-2 min-h-[1lh]" aria-live="polite">
        {rows.length === 0
          ? ''
          : f
            ? `${rows.length} of ${songs.length} songs`
            : `${songs.length} songs`}
      </div>

      <ul className="list-none m-0 p-0">
        {rows.map(s => (
          <li className="border-b border-hairline" key={s.path}>
            <a
              href={`?path=${encodeURIComponent(s.path)}`}
              onClick={e => { e.preventDefault(); onSelect(s.path) }}
              className="grid grid-cols-1 gap-1 py-[22px] pl-0 pr-3 [transition:background-color_120ms_ease,padding_120ms_ease] cursor-pointer active:bg-hover hover:bg-hover hover:pl-3 hover:pr-6 wide:grid-cols-[1fr_auto] wide:items-baseline wide:gap-6 wide:py-[18px]"
            >
              <span className="type-title">{s.title}</span>
              <span className="type-meta text-muted wide:text-right wide:whitespace-nowrap">{s.artist}</span>
            </a>
          </li>
        ))}
      </ul>

      {status === 'error' && (
        <div className="py-16 text-center text-muted type-meta">
          Couldn’t load the song list. Check your connection and reload.
        </div>
      )}

      {status === 'ready' && rows.length === 0 && f && (
        <div className="py-16 text-center text-muted type-meta">No songs match that.</div>
      )}
    </main>
  )
}
