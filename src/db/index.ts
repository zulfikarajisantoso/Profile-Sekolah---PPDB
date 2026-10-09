import path from 'node:path'
import fs from 'node:fs'
import knexFactory from 'knex'
import type { Knex } from 'knex'

const isTest = process.env.NODE_ENV === 'test'
const filename = isTest
  ? ':memory:'
  : (process.env.DATABASE_FILENAME ?? path.join(process.cwd(), 'data', 'sekolah.sqlite'))

if (!isTest && filename !== ':memory:') {
  fs.mkdirSync(path.dirname(filename), { recursive: true })
}

declare global {
  var __knexInstance: Knex | undefined
}

function createConnection(): Knex {
  return knexFactory({
    client: 'better-sqlite3',
    connection: { filename },
    useNullAsDefault: true,
    pool: {
      min: 1,
      max: 1,
      afterCreate: (conn: { pragma: (statement: string) => void }, done: (err?: unknown) => void) => {
        conn.pragma('journal_mode = WAL')
        conn.pragma('foreign_keys = ON')
        done()
      },
    },
  })
}

export const db: Knex = globalThis.__knexInstance ?? createConnection()

if (!isTest) {
  globalThis.__knexInstance = db
}

export default db
