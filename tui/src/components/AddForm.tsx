import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import TextInput from 'ink-text-input'
import { writeSong, toSlug, type SongFile } from '../songs.ts'
import { rebuildIndex } from '../build.ts'

interface Props {
  onDone: () => void
}

type FormState =
  | { step: 'artist' }
  | { step: 'title'; artist: string }
  | { step: 'fetching'; artist: string; title: string }
  | { step: 'found'; artist: string; title: string; lyrics: string }
  | { step: 'not_found'; artist: string; title: string }
  | { step: 'error'; message: string }

function makeSlug(title: string, artist: string): string {
  return toSlug(`${title}-${artist}`)
}

export function AddForm({ onDone }: Props) {
  const [form, setForm] = useState<FormState>({ step: 'artist' })
  const [artistDraft, setArtistDraft] = useState('')
  const [titleDraft, setTitleDraft] = useState('')

  // Fetch lyrics when we enter the fetching step
  useEffect(() => {
    if (form.step !== 'fetching') return
    const { artist, title } = form
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`

    fetch(url)
      .then(async res => {
        if (res.status === 404) {
          setForm({ step: 'not_found', artist, title })
          return
        }
        if (!res.ok) {
          setForm({ step: 'error', message: `HTTP ${res.status}` })
          return
        }
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

  // Keyboard for found / not_found / error steps
  useInput((input, key) => {
    if (form.step === 'found') {
      if (input === '1') {
        const song: SongFile = {
          slug: makeSlug(form.title, form.artist),
          title: form.title,
          singer: form.artist,
          lyrics: '\n' + form.lyrics,
        }
        writeSong(song)
        rebuildIndex()
        onDone()
      } else if (input === '2') {
        setArtistDraft('')
        setTitleDraft('')
        setForm({ step: 'artist' })
      }
    } else if (form.step === 'not_found' || form.step === 'error') {
      if (key.return || key.escape || input === 'q') {
        onDone()
      }
    }
  })

  // Artist input step
  if (form.step === 'artist') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Add song</Text>
        </Box>
        <Box>
          <Text>Artist: </Text>
          <TextInput
            value={artistDraft}
            onChange={setArtistDraft}
            onSubmit={v => {
              if (v.trim()) setForm({ step: 'title', artist: v.trim() })
            }}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Enter to confirm  Ctrl+C quit</Text>
        </Box>
      </Box>
    )
  }

  // Title input step
  if (form.step === 'title') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Add song</Text>
          <Text dimColor>  {form.artist}</Text>
        </Box>
        <Box>
          <Text>Title:  </Text>
          <TextInput
            value={titleDraft}
            onChange={setTitleDraft}
            onSubmit={v => {
              if (v.trim()) setForm({ step: 'fetching', artist: form.artist, title: v.trim() })
            }}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Enter to search  Ctrl+C quit</Text>
        </Box>
      </Box>
    )
  }

  // Fetching
  if (form.step === 'fetching') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Add song</Text>
        </Box>
        <Text>Searching for lyrics…</Text>
      </Box>
    )
  }

  // Found — full lyrics + approve/reject
  if (form.step === 'found') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">Found</Text>
        </Box>
        <Text bold>{form.title}</Text>
        <Text dimColor>{form.artist}</Text>
        <Box marginTop={1} flexDirection="column">
          {form.lyrics.split('\n').map((line, i) => (
            <Text key={i}>{line}</Text>
          ))}
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Box>
            <Text color="cyan">1</Text>
            <Text>  Add to list</Text>
          </Box>
          <Box>
            <Text color="cyan">2</Text>
            <Text>  Try again</Text>
          </Box>
        </Box>
      </Box>
    )
  }

  // Not found
  if (form.step === 'not_found') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="yellow">Not found</Text>
        </Box>
        <Text>No lyrics found for <Text bold>{form.artist}</Text> — <Text bold>{form.title}</Text></Text>
        <Text dimColor>Check for typos and try again.</Text>
        <Box marginTop={1}>
          <Text dimColor>Enter/Esc to go back</Text>
        </Box>
      </Box>
    )
  }

  // Error
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
