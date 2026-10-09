import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import db from './index.js'

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations')

export async function migrate(): Promise<void> {
  const hasTable = await db.schema.hasTable('knex_migrations')
  if (!hasTable) {
    await db.schema.createTable('knex_migrations', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.integer('batch').notNullable().defaultTo(1)
      table.timestamp('migration_time').notNullable().defaultTo(db.fn.now())
    })
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.ts'))
    .sort()

  const applied = await db<{ name: string }>('knex_migrations').select('name')
  const appliedNames = new Set(applied.map((row) => row.name))

  let batch = 1
  if (applied.length > 0) {
    const [last] = await db('knex_migrations').max<{ batch: number | null }[]>('batch as batch')
    batch = Number(last?.batch ?? 0) + 1
  }

  let count = 0
  for (const file of files) {
    if (appliedNames.has(file)) continue

    const migration = (await import(pathToFileURL(path.join(migrationsDir, file)).href)) as {
      up: (knex: typeof db) => Promise<void>
      down: (knex: typeof db) => Promise<void>
    }

    console.log(`[migrate] menjalankan ${file}`)
    await migration.up(db)
    await db('knex_migrations').insert({ name: file, batch })
    count += 1
  }

  if (count === 0) {
    console.log('[migrate] tidak ada migrasi baru')
  } else {
    console.log(`[migrate] selesai, ${count} migrasi dijalankan`)
  }
}

const invokedDirectly =
  process.argv[1] !== undefined && path.basename(process.argv[1]).startsWith('migrate')

if (invokedDirectly) {
  migrate()
    .then(async () => {
      await db.destroy()
      process.exit(0)
    })
    .catch(async (error) => {
      console.error(error)
      await db.destroy()
      process.exit(1)
    })
}
