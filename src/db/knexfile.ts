import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Knex } from 'knex'

const currentDir = dirname(fileURLToPath(import.meta.url))

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DATABASE_FILENAME ?? `${currentDir}/../../data/sekolah.sqlite`,
    },
    useNullAsDefault: true,
    migrations: {
      directory: `${currentDir}/migrations`,
      tableName: 'knex_migrations',
    },
    pool: {
      afterCreate: (conn: { pragma: (s: string) => void }, done: (err?: unknown) => void) => {
        conn.pragma('journal_mode = WAL')
        conn.pragma('foreign_keys = ON')
        done()
      },
    },
  },
  test: {
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
    migrations: {
      directory: `${currentDir}/migrations`,
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DATABASE_FILENAME ?? `${currentDir}/../../data/sekolah.sqlite`,
    },
    useNullAsDefault: true,
    migrations: {
      directory: `${currentDir}/migrations`,
      tableName: 'knex_migrations',
    },
    pool: {
      afterCreate: (conn: { pragma: (s: string) => void }, done: (err?: unknown) => void) => {
        conn.pragma('journal_mode = WAL')
        conn.pragma('foreign_keys = ON')
        done()
      },
    },
  },
}

export default config
