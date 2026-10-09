import fs from 'node:fs'
import path from 'node:path'
import db from './index.js'

const RETRY_DELAYS_MS = [0, 250, 500, 1000, 2000]

function removeWithRetry(target: string): boolean {
  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay)
    }
    try {
      if (!fs.existsSync(target)) return true
      fs.rmSync(target)
      return true
    } catch {
      // Berkas masih dipakai proses lain, coba lagi.
    }
  }
  return !fs.existsSync(target)
}

async function reset(): Promise<void> {
  const file = process.env.DATABASE_FILENAME ?? path.join(process.cwd(), 'data', 'sekolah.sqlite')
  await db.destroy()

  const leftovers: string[] = []

  for (const suffix of ['', '-wal', '-shm']) {
    const target = `${file}${suffix}`
    if (!fs.existsSync(target)) continue

    if (removeWithRetry(target)) {
      console.log(`[reset] hapus ${path.basename(target)}`)
    } else {
      leftovers.push(target)
    }
  }

  if (leftovers.length > 0) {
    console.error('[reset] gagal menghapus:')
    for (const leftover of leftovers) console.error(`  ${leftover}`)
    console.error('[reset] tutup proses server yang sedang berjalan, lalu jalankan ulang perintah ini.')
    process.exit(1)
  }
}

reset()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
