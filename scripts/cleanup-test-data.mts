import path from 'node:path'
import knexFactory from 'knex'

const db = knexFactory({
  client: 'better-sqlite3',
  connection: { filename: path.join(process.cwd(), 'data', 'sekolah.sqlite') },
  useNullAsDefault: true,
})

const removed = await db('admin_users').where('username', 'smokeadmin').delete()
console.log(`[cleanup] ${removed} akun smokeadmin dihapus`)
await db.destroy()
