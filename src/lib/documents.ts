import type { StoredDocument } from './types'

export function parseDocuments(value: string): StoredDocument[] {
  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is StoredDocument =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as { name?: unknown }).name === 'string' &&
        typeof (item as { storedAs?: unknown }).storedAs === 'string',
    )
  } catch {
    return []
  }
}
