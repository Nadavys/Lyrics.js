import { useState, useEffect, useCallback, useRef } from 'react'
import { type Song } from './data/songs'
import SongListPage from './pages/SongListPage'
import LyricsPage from './pages/LyricsPage'

export type LoadStatus = 'loading' | 'ready' | 'error'

function getPathFromUrl() {
  return new URLSearchParams(window.location.search).get('path')
}

export default function App() {
  const [songs, setSongs] = useState<Song[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [songPath, setSongPath] = useState<string | null>(getPathFromUrl)
  const [listFilter, setListFilter] = useState('')
  const listScrollRef = useRef(0)

  useEffect(() => {
    fetch('/data/songs.json')
      .then(r => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then(data => { setSongs(data); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    const onPop = () => setSongPath(getPathFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const goToLyrics = useCallback((path: string) => {
    listScrollRef.current = window.scrollY
    history.pushState({}, '', '?path=' + encodeURIComponent(path))
    setSongPath(path)
    window.scrollTo(0, 0)
  }, [])

  const goToList = useCallback(() => {
    history.pushState({}, '', '/')
    setSongPath(null)
    window.scrollTo(0, 0)
  }, [])

  if (songPath) {
    const song = songs.find(s => s.path === songPath) ?? null
    return <LyricsPage song={song} status={status} onBack={goToList} />
  }

  return (
    <SongListPage
      songs={songs}
      status={status}
      onSelect={goToLyrics}
      filter={listFilter}
      onFilterChange={setListFilter}
      initialScrollYRef={listScrollRef}
    />
  )
}
