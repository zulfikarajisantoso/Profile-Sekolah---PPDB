import path from 'node:path'
import knexFactory from 'knex'

const db = knexFactory({
  client: 'better-sqlite3',
  connection: { filename: path.join(process.cwd(), 'data', 'sekolah.sqlite') },
  useNullAsDefault: true,
})

const [newsCount] = await db('news').count<{ total: number }[]>('* as total')
const [teacherCount] = await db('teachers').count<{ total: number }[]>('* as total')
const [achievementCount] = await db('achievements').count<{ total: number }[]>('* as total')
const [adminCount] = await db('admin_users').count<{ total: number }[]>('* as total')
const [ppdbCount] = await db('ppdb_registrations').count<{ total: number }[]>('* as total')

console.log('Isi database saat ini:')
console.log(`  berita      : ${newsCount?.total}`)
console.log(`  guru        : ${teacherCount?.total}`)
console.log(`  prestasi    : ${achievementCount?.total}`)
console.log(`  admin       : ${adminCount?.total}`)
console.log(`  pendaftar   : ${ppdbCount?.total}`)

await db.destroy()
