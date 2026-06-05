import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'

const root = fileURLToPath(new URL('..', import.meta.url))
const lyricsDir = join(root, 'public', 'lyrics')
const outFile = join(root, 'public', 'data', 'songs.json')

function parse(content, filename) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)/)
  if (!match) {
    console.warn(`  skip ${filename}: no frontmatter`)
    return null
  }

  const front = match[1]

  const title = front.match(/^title:\s*"(.+)"\s*$/m)?.[1]
  const artist = front.match(/^artist:\s*"(.+)"\s*$/m)?.[1]

  if (!title || !artist) {
    console.warn(`  skip ${filename}: missing title or artist`)
    return null
  }

  return { path: basename(filename, '.md'), title, artist }
}

const files = (await readdir(lyricsDir))
  .filter(f => f.endsWith('.md'))
  .sort()

const songs = (
  await Promise.all(
    files.map(async f => parse(await readFile(join(lyricsDir, f), 'utf-8'), f))
  )
).filter(Boolean)

await mkdir(join(root, 'public', 'data'), { recursive: true })
await writeFile(outFile, JSON.stringify(songs, null, 2) + '\n')
console.log(`wrote ${songs.length} songs → data/songs.json`)
