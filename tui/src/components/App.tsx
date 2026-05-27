import React, { useState } from 'react'
import { SongList } from './SongList.tsx'
import { AddForm } from './AddForm.tsx'

type Mode =
  | { type: 'list' }
  | { type: 'add' }
  | { type: 'edit'; slug: string }
  | { type: 'delete'; slug: string }

export function App() {
  const [mode, setMode] = useState<Mode>({ type: 'list' })
  const [listKey, setListKey] = useState(0)

  const goToList = () => {
    setListKey(k => k + 1)
    setMode({ type: 'list' })
  }

  if (mode.type === 'list') {
    return (
      <SongList
        key={listKey}
        onAdd={() => setMode({ type: 'add' })}
        onEdit={slug => setMode({ type: 'edit', slug })}
        onDelete={slug => setMode({ type: 'delete', slug })}
      />
    )
  }

  if (mode.type === 'add') {
    return <AddForm onDone={goToList} />
  }

  return null
}
