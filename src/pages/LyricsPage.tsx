import { useState, useEffect } from 'react'
import { type Song } from '../data/songs'

interface Props {
  song: Song | null
  onBack: () => void
}

function stripFrontmatter(text: string) {
  return text.replace(/^---[\s\S]*?---\n?/, '').trim()
}

export default function LyricsPage({ song, onBack }: Props) {
  const [lyrics, setLyrics] = useState<string | null>(null)

  useEffect(() => {
    document.title = song ? `${song.title} — Lyrics` : 'Lyrics — not found'
    return () => { document.title = 'Lyrics' }
  }, [song])

  useEffect(() => {
    if (!song) return
    setLyrics(null)
    fetch(`/lyrics/${song.path}.md`)
      .then(r => r.text())
      .then(text => setLyrics(stripFrontmatter(text)))
  }, [song])

  return (
    <main className="wrap">
      <div className="sticky-bar">
        <button className="back" onClick={onBack}>
          <span className="arrow" aria-hidden="true" />
          <span>All songs</span>
        </button>
      </div>

      {song ? (
        <>
          <header className="lyrics-header">
            <h1 className="lyrics-title">{song.title}</h1>
            <div className="lyrics-meta">
              <span className="field">
                <span className="label">Singer</span>
                <span className="value">{song.singer}</span>
              </span>
            </div>
          </header>

          <div className="lyrics-body">
            {lyrics === null
              ? <p className="loading">Loading…</p>
              : <p style={{ whiteSpace: 'pre-line' }}>{lyrics}</p>
            }
          </div>
        </>
      ) : (
        <header className="lyrics-header">
          <h1 className="lyrics-title">Song not found</h1>
          <div className="lyrics-meta">
            <span>Try going back to the list.</span>
          </div>
        </header>
      )}

      <div className="footer-note">lyrics</div>
    </main>
  )
}
