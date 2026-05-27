import React, { useState, useEffect } from 'react'
import { Box, Text, useInput, useApp } from 'ink'
import { listSongs, type SongFile } from '../songs.ts'

interface Props {
  onAdd: () => void
  onEdit: (slug: string) => void
  onDelete: (slug: string) => void
}

export function SongList({ onAdd, onEdit, onDelete }: Props) {
  const { exit } = useApp()
  const [songs, setSongs] = useState<SongFile[]>([])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    setSongs(listSongs())
  }, [])

  useInput((input, key) => {
    if (songs.length === 0) {
      if (input === 'a') onAdd()
      if (input === 'q') exit()
      return
    }

    if (key.upArrow || input === 'k') {
      setCursor(c => Math.max(0, c - 1))
    } else if (key.downArrow || input === 'j') {
      setCursor(c => Math.min(songs.length - 1, c + 1))
    } else if (input === 'a') {
      onAdd()
    } else if (input === 'e') {
      onEdit(songs[cursor]!.slug)
    } else if (input === 'd') {
      onDelete(songs[cursor]!.slug)
    } else if (input === 'q') {
      exit()
    }
  })

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">lyrics</Text>
        <Text> — {songs.length} song{songs.length !== 1 ? 's' : ''}</Text>
      </Box>

      {songs.length === 0 ? (
        <Text dimColor>No songs found.</Text>
      ) : (
        songs.map((song, i) => (
          <Box key={song.slug}>
            <Text color={i === cursor ? 'cyan' : undefined} bold={i === cursor}>
              {i === cursor ? '▶ ' : '  '}
            </Text>
            <Text color={i === cursor ? 'cyan' : undefined} bold={i === cursor}>
              {song.title}
            </Text>
            <Text dimColor>{'  '}{song.singer}</Text>
          </Box>
        ))
      )}

      <Box marginTop={1}>
        <Text dimColor>↑/k ↓/j move  a add  e edit  d delete  q quit</Text>
      </Box>
    </Box>
  )
}
