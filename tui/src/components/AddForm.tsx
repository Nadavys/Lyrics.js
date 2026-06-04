import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import TextInput from 'ink-text-input'
import { writeSong, toSlug, type SongFile } from '../songs.ts'
import { rebuildIndex } from '../build.ts'

interface Props {
  onDone: () => void
}

interface Track {
  id: number
  title: string
  artist: { name: string }
}

type FormState =
  | { step: 'search' }
  | { step: 'suggesting'; query: string }
  | { step: 'pick'; query: string; results: Track[] }
  | { step: 'fetching'; artist: string; title: string }
  | { step: 'found'; artist: string; title: string; lyrics: string }
  | { step: 'not_found'; artist: string; title: string }
  | { step: 'error'; message: string }

function makeSlug(title: string, artist: string): string {
  return toSlug(`${title}-${artist}`)
}

export function AddForm({ onDone }: Props) {
  const [form, setForm] = useState<FormState>({ step: 'search' })
  const [searchDraft, setSearchDraft] = useState('')
  const [cursor, setCursor] = useState(0)

  // Suggest
  useEffect(() => {
    if (form.step !== 'suggesting') return
    const { query } = form
    fetch(`https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`)
      .then(async res => {
        if (!res.ok) {
          setForm({ step: 'error', message: `HTTP ${res.status}` })
          return
        }
        const data = await res.json() as { data?: Track[] }
        const results = (data.data ?? []).filter(t => t.title && t.artist?.name)
        if (results.length === 0) {
          setForm({ step: 'not_found', artist: '', title: query })
        } else {
          setCursor(0)
          setForm({ step: 'pick', query, results })
        }
      })
      .catch((err: unknown) => {
        setForm({ step: 'error', message: err instanceof Error ? err.message : String(err) })
      })
  }, [form.step])

  // Fetch lyrics
  useEffect(() => {
    if (form.step !== 'fetching') return
    const { artist, title } = form
    fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`)
      .then(async res => {
        if (res.status === 404) { setForm({ step: 'not_found', artist, title }); return }
        if (!res.ok) { setForm({ step: 'error', message: `HTTP ${res.status}` }); return }
        const data = await res.json() as { lyrics?: string }
        const lyrics = data.lyrics?.trim() ?? ''
        if (!lyrics) {
          setForm({ step: 'not_found', artist, title })
        } else {
          setForm({ step: 'found', artist, title, lyrics })
        }
      })
      .catch((err: unknown) => {
        setForm({ step: 'error', message: err instanceof Error ? err.message : String(err) })
      })
  }, [form.step])

  useInput((input, key) => {
    if (form.step === 'pick') {
      if (key.upArrow || input === 'k') {
        setCursor(c => Math.max(0, c - 1))
      } else if (key.downArrow || input === 'j') {
        setCursor(c => Math.min(form.results.length - 1, c + 1))
      } else if (key.return) {
        const track = form.results[cursor]
        setForm({ step: 'fetching', artist: track.artist.name, title: track.title })
      } else if (key.escape || input === 'q') {
        setSearchDraft('')
        setForm({ step: 'search' })
      }
    } else if (form.step === 'found') {
      if (key.return) {
        const song: SongFile = {
          slug: makeSlug(form.title, form.artist),
          title: form.title,
          singer: form.artist,
          lyrics: '\n' + form.lyrics,
        }
        writeSong(song)
        rebuildIndex()
        onDone()
      } else if (input === 'r') {
        setSearchDraft('')
        setForm({ step: 'search' })
      } else if (key.escape || input === 'q') {
        onDone()
      }
    } else if (form.step === 'not_found' || form.step === 'error') {
      if (key.return || key.escape || input === 'q') {
        onDone()
      }
    }
  })

  if (form.step === 'search') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Add song</Text>
        </Box>
        <Box>
          <Text>Search: </Text>
          <TextInput
            value={searchDraft}
            onChange={setSearchDraft}
            onSubmit={v => {
              if (v.trim()) setForm({ step: 'suggesting', query: v.trim() })
            }}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Enter to search  Ctrl+C quit</Text>
        </Box>
      </Box>
    )
  }

  if (form.step === 'suggesting') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Add song</Text>
        </Box>
        <Text>Searching "{form.query}"…</Text>
      </Box>
    )
  }

  if (form.step === 'pick') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Select a song</Text>
          <Text dimColor>  {form.query}</Text>
        </Box>
        {form.results.map((track, i) => (
          <Box key={track.id}>
            <Text color={i === cursor ? 'cyan' : undefined} bold={i === cursor}>
              {i === cursor ? '▶ ' : '  '}{track.title}
            </Text>
            <Text dimColor>  {track.artist.name}</Text>
          </Box>
        ))}
        <Box marginTop={1}>
          <Text dimColor>↑/↓  j/k  navigate    Enter  select    Esc/q  back</Text>
        </Box>
      </Box>
    )
  }

  if (form.step === 'fetching') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Add song</Text>
        </Box>
        <Text>Fetching lyrics for <Text bold>{form.title}</Text>…</Text>
      </Box>
    )
  }

  if (form.step === 'found') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Found</Text>
        </Box>
        <Text bold>{form.title}</Text>
        <Text dimColor>{form.artist}</Text>
        <Box marginTop={1}>
          <Text>{form.lyrics}</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Enter  save    r  search again    Esc/q  cancel</Text>
        </Box>
      </Box>
    )
  }

  if (form.step === 'not_found') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="yellow">Not found</Text>
        </Box>
        {form.artist
          ? <Text>No lyrics found for <Text bold>{form.artist}</Text> — <Text bold>{form.title}</Text></Text>
          : <Text>No results for "<Text bold>{form.title}</Text>"</Text>
        }
        <Box marginTop={1}>
          <Text dimColor>Enter/Esc to go back</Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="red">Error</Text>
      </Box>
      <Text>{(form as { step: 'error'; message: string }).message}</Text>
      <Box marginTop={1}>
        <Text dimColor>Enter/Esc to go back</Text>
      </Box>
    </Box>
  )
}
