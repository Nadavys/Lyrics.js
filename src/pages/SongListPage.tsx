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
    <main className="wrap">
      <header className="masthead">
        <div className="brand">Lyrics<span className="dot" /></div>
      </header>

      <div className="search">
        <span className="glyph" aria-hidden="true">
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
        />
      </div>

      <div className="result-count">
        {rows.length === 0
          ? ''
          : f
            ? `${rows.length} of ${songs.length} songs`
            : `${songs.length} songs`}
      </div>

      <ul className="song-list">
        {rows.map(s => (
          <li key={s.path}>
            <a
              href={`?path=${encodeURIComponent(s.path)}`}
              onClick={e => { e.preventDefault(); onSelect(s.path) }}
            >
              <span className="song-title">{s.title}</span>
              <span className="song-meta">{s.singer}</span>
            </a>
          </li>
        ))}
      </ul>

      {rows.length === 0 && f && (
        <div className="empty">No songs match that.</div>
      )}
    </main>
  )
}
