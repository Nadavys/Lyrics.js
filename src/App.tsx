import { useState, useEffect, useCallback } from 'react'
import { type Song } from './data/songs'
import SongListPage from './pages/SongListPage'
import LyricsPage from './pages/LyricsPage'

function getPathFromUrl() {
  return new URLSearchParams(window.location.search).get('path')
}

export default function App() {
  const [songs, setSongs] = useState<Song[]>([])
  const [songPath, setSongPath] = useState<string | null>(getPathFromUrl)

  useEffect(() => {
    fetch('/data/songs.json').then(r => r.json()).then(setSongs)
  }, [])

  useEffect(() => {
    const onPop = () => setSongPath(getPathFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const goToLyrics = useCallback((path: string) => {
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
    return <LyricsPage song={song} onBack={goToList} />
  }

  return <SongListPage songs={songs} onSelect={goToLyrics} />
}
