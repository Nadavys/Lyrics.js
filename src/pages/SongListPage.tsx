import { useState, useRef, useEffect } from 'react'
import { type Song } from '../data/songs'

interface Props {
  songs: Song[]
  onSelect: (path: string) => void
}

export default function SongListPage({ songs, onSelect }: Props) {
  const [filter, setFilter] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const f = filter.trim().toLowerCase()
  const rows = songs.filter(s => {
    if (!f) return true
    return s.title.toLowerCase().includes(f) || s.singer.toLowerCase().includes(f)
  }).sort((a, b) => a.title.localeCompare(b.title))

  return (
    <main className="max-w-[760px] mx-auto px-8 pt-14 pb-[120px] max-[540px]:px-4 max-[540px]:pt-6 max-[540px]:pb-20">
      <header className="flex items-baseline justify-between mb-12 max-[540px]:mb-8">
        <div className="text-[22px] font-medium tracking-[-0.02em] max-[540px]:text-[26px]">
          Lyrics
          <span className="inline-block w-1.5 h-1.5 bg-ink rounded-full ml-[1px] mr-[2px] mb-[2px] align-middle" />
        </div>
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
          placeholder="Search by song or singer"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full border-0 border-b border-ink bg-transparent text-[28px] tracking-[-0.01em] py-[14px] pl-9 pr-0 text-ink outline-none placeholder:text-muted placeholder:font-light max-[540px]:text-[30px] max-[540px]:py-4"
        />
      </div>

      <div className="text-[12px] text-muted mt-[18px] mb-2 tracking-[0.06em] uppercase">
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
              className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-[18px] pl-0 pr-3 [transition:background-color_120ms_ease,padding_120ms_ease] cursor-pointer hover:bg-hover hover:pl-3 hover:pr-6 max-[540px]:grid-cols-1 max-[540px]:gap-1 max-[540px]:py-[22px]"
            >
              <span className="text-[19px] font-medium tracking-[-0.01em] max-[540px]:text-[22px]">{s.title}</span>
              <span className="text-[14px] text-muted text-right whitespace-nowrap max-[540px]:text-[16px] max-[540px]:text-left">{s.singer}</span>
            </a>
          </li>
        ))}
      </ul>

      {rows.length === 0 && f && (
        <div className="py-16 text-center text-muted text-[14px]">No songs match that.</div>
      )}
    </main>
  )
}
