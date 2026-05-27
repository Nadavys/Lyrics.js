import fs from 'node:fs'
import path from 'node:path'

export const LYRICS_DIR = new URL('../../public/lyrics/', import.meta.url).pathname
export const BUILD_SCRIPT = new URL('../../scripts/build-songs.js', import.meta.url).pathname

export interface SongFile {
  slug: string
  title: string
  singer: string
  lyrics: string
}

export function listSongs(): SongFile[] {
  const files = fs.readdirSync(LYRICS_DIR).filter(f => f.endsWith('.md')).sort()
  return files.flatMap(f => {
    const slug = path.basename(f, '.md')
    const song = readSong(slug)
    return song ? [song] : []
  })
}

export function readSong(slug: string): SongFile | null {
  const filepath = path.join(LYRICS_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null
  const content = fs.readFileSync(filepath, 'utf8')
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)/)
  if (!match) return null
  const front = match[1]
  const title = front.match(/^title:\s*"(.+)"\s*$/m)?.[1]
  const singer = front.match(/^singer:\s*"(.+)"\s*$/m)?.[1]
  if (!title || !singer) return null
  return { slug, title, singer, lyrics: match[2] ?? '' }
}

export function writeSong(song: SongFile): void {
  const filepath = path.join(LYRICS_DIR, `${song.slug}.md`)
  fs.writeFileSync(filepath, serialize(song), 'utf8')
}

export function deleteSong(slug: string): void {
  const filepath = path.join(LYRICS_DIR, `${slug}.md`)
  fs.unlinkSync(filepath)
}

export function toSlug(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function serialize(s: SongFile): string {
  return `---\ntitle: "${s.title}"\n\nsinger: "${s.singer}"\n\n---\n${s.lyrics}\n`
}
