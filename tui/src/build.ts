import { spawnSync } from 'node:child_process'
import { BUILD_SCRIPT } from './songs.ts'

export function rebuildIndex(): void {
  spawnSync('node', [BUILD_SCRIPT], { stdio: 'inherit' })
}
