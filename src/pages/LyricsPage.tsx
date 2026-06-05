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
    <main className="max-w-[760px] mx-auto px-8 pt-14 pb-[120px] max-[540px]:px-4 max-[540px]:pt-6 max-[540px]:pb-20">
      <div className="sticky top-0 z-10 bg-bg py-[14px] mb-[42px] max-[540px]:py-0 max-[540px]:-mx-4 max-[540px]:mb-8 max-[540px]:border-b max-[540px]:border-hairline">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[13px] text-muted tracking-[0.01em] transition-colors duration-[120ms] cursor-pointer bg-transparent border-none p-0 font-[inherit] hover:text-ink max-[540px]:w-full max-[540px]:min-h-[52px] max-[540px]:px-4 max-[540px]:text-[17px] max-[540px]:gap-2.5"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true" className="flex-shrink-0 max-[540px]:w-[18px] max-[540px]:h-[13px]">
            <path d="M5 1L1 5L5 9M1 5H13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>All songs</span>
        </button>
      </div>

      {song ? (
        <>
          <header className="mb-12">
            <h1 className="text-[44px] font-medium tracking-[-0.025em] leading-[1.05] m-0 mb-[18px] max-[540px]:text-[42px]">{song.title}</h1>
            <div className="flex flex-wrap gap-5 text-[14px] text-muted max-[540px]:text-[16px]">
              <span className="inline-flex items-baseline gap-2">
                <span className="text-[11px] tracking-[0.08em] uppercase">Artist</span>
                <span className="text-ink">{song.artist}</span>
              </span>
            </div>
          </header>

          <div className="text-[18px] leading-[1.7] tracking-[-0.005em] max-w-[580px] max-[540px]:text-[20px] max-[540px]:leading-[1.75] max-[540px]:max-w-full">
            {lyrics === null
              ? <p className="text-muted">Loading…</p>
              : <p style={{ whiteSpace: 'pre-line' }}>{lyrics}</p>
            }
          </div>
        </>
      ) : (
        <header className="mb-12">
          <h1 className="text-[44px] font-medium tracking-[-0.025em] leading-[1.05] m-0 mb-[18px] max-[540px]:text-[42px]">Song not found</h1>
          <div className="flex flex-wrap gap-5 text-[14px] text-muted">
            <span>Try going back to the list.</span>
          </div>
        </header>
      )}

      <div className="mt-20 pt-6 border-t border-hairline text-[12px] text-muted tracking-[0.02em]">lyrics</div>
    </main>
  )
}
