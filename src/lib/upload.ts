import 'server-only'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { MAX_UPLOAD_BYTES } from './upload-constants'

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_BYTES = MAX_UPLOAD_BYTES

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
}

export type StoredUpload = {
  name: string
  storedAs: string
}

export async function storeUpload(file: File, prefix: string): Promise<StoredUpload> {
  const extension = ALLOWED_MIME[file.type]
  if (!extension) {
    throw new Error('Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Ukuran file melebihi 2 MB.')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const storedAs = `${slugifyFilename(prefix)}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extension}`

  await fs.mkdir(UPLOAD_ROOT, { recursive: true })
  await fs.writeFile(path.join(UPLOAD_ROOT, storedAs), buffer)

  return { name: file.name.slice(0, 120), storedAs: `/uploads/${storedAs}` }
}

function slugifyFilename(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'dokumen'
  )
}

export async function deleteUpload(storedAs: string): Promise<void> {
  if (!storedAs.startsWith('/uploads/')) return
  const filename = path.basename(storedAs)
  try {
    await fs.unlink(path.join(UPLOAD_ROOT, filename))
  } catch {
    // File sudah tidak ada, tidak perlu dipedulikan.
  }
}
