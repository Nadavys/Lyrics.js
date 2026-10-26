import { useState, useEffect } from 'react'
import { type Song } from '../data/songs'
import { type LoadStatus } from '../App'

interface Props {
  song: Song | null
  status: LoadStatus
  onBack: () => void
}

function stripFrontmatter(text: string) {
  return text.replace(/^---[\s\S]*?---\n?/, '').trim()
}

// Stanzas are separated by blank lines; a whole-line `[Chorus]` is a section marker.
function toStanzas(lyrics: string) {
  return lyrics.split(/\n[ \t]*\n+/).map(stanza => stanza.split('\n'))
}

const MARKER = /^\[(.+)\]\s*$/

export default function LyricsPage({ song, status, onBack }: Props) {
  // Keyed by path so a result for the previous song is never shown for this one.
  const [result, setResult] = useState<{ path: string, text: string | null } | null>(null)
  const current = song && result?.path === song.path ? result : null
  const lyrics = current?.text ?? null
  const failed = current !== null && current.text === null

  useEffect(() => {
    if (status === 'loading') return
    document.title = song ? `${song.title} — Lyrics` : 'Lyrics — not found'
    return () => { document.title = 'Lyrics' }
  }, [song, status])

  useEffect(() => {
    if (!song) return
    const { path } = song
    fetch(`/lyrics/${path}.md`)
      .then(r => {
        if (!r.ok) throw new Error(String(r.status))
        return r.text()
      })
      .then(text => setResult({ path, text: stripFrontmatter(text) }))
      .catch(() => setResult({ path, text: null }))
  }, [song])

  return (
    <main className="max-w-[760px] mx-auto px-4 pt-6 pb-20 wide:px-8 wide:pt-14 wide:pb-[120px]">
      <div className="sticky top-0 z-10 bg-bg -mx-4 mb-8 border-b border-hairline wide:mx-0 wide:py-[14px] wide:mb-[42px] wide:border-b-0">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2.5 w-full min-h-[52px] px-4 type-nav text-muted transition-colors duration-[120ms] cursor-pointer bg-transparent border-none font-[inherit] hover:text-ink active:text-ink wide:w-auto wide:min-h-[44px] wide:px-0 wide:gap-2"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true" className="flex-shrink-0 w-[18px] h-[13px] wide:w-[14px] wide:h-[10px]">
            <path d="M5 1L1 5L5 9M1 5H13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>All songs</span>
        </button>
      </div>

      {song ? (
        <>
          <header className="mb-10 wide:mb-12">
            <h1 className="type-display m-0 mb-[18px]">{song.title}</h1>
            <div className="flex flex-wrap gap-5 type-meta text-muted">
              <span className="inline-flex items-baseline gap-2">
                <span className="type-label">Artist</span>
                <span className="text-ink">{song.artist}</span>
              </span>
            </div>
          </header>

          <div className="type-lyrics wide:max-w-[580px]">
            {failed
              ? <p className="m-0 text-muted type-meta">Couldn’t load these lyrics. Check your connection and try again.</p>
              : lyrics === null
                ? <p className="m-0 text-muted">Loading…</p>
                : toStanzas(lyrics).map((lines, i) => (
                    <p key={i} className="m-0 mb-[0.9em] last:mb-0">
                      {lines.map((line, j) => {
                        const marker = line.match(MARKER)
                        return marker
                          ? <span key={j} className="lyric-line type-label text-muted pb-1">{marker[1]}</span>
                          : <span key={j} className="lyric-line">{line}</span>
                      })}
                    </p>
                  ))
            }
          </div>
        </>
      ) : status === 'loading' ? (
        <p className="m-0 text-muted type-meta">Loading…</p>
      ) : (
        <header className="mb-12">
          <h1 className="type-display m-0 mb-[18px]">
            {status === 'error' ? 'Couldn’t load songs' : 'Song not found'}
          </h1>
          <div className="type-meta text-muted">
            {status === 'error' ? 'Check your connection and reload.' : 'Try going back to the list.'}
          </div>
        </header>
      )}

      <div className="mt-20 pt-6 border-t border-hairline type-label normal-case tracking-[0.02em] text-muted">lyrics</div>
    </main>
  )
}
