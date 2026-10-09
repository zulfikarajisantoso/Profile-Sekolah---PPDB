import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import knexFactory from 'knex'

const db = knexFactory({
  client: 'better-sqlite3',
  connection: { filename: path.join(process.cwd(), 'data', 'sekolah.sqlite') },
  useNullAsDefault: true,
})

const username = process.argv[2] ?? 'testadmin'
const password = process.argv[3] ?? 'TestLolos123'
const secret = process.argv[4]

if (!secret) {
  console.error('Sesi<SECRET> tidak diberikan')
  process.exit(1)
}

const user = await db('admin_users').where('username', username).first()
if (!user) {
  await db('admin_users').insert({
    username,
    password_hash: bcrypt.hashSync(password, 12),
    full_name: 'Uji Otomatis',
    role: 'admin',
  })
  console.log(`[setup] admin dibuat: ${username} / ${password}`)
} else {
  await db('admin_users').where('id', user.id).update({ password_hash: bcrypt.hashSync(password, 12) })
  console.log(`[setup] password ${username} direset`)
}

const payload = Buffer.from(JSON.stringify({ userId: user?.id ?? 1, expiresAt: Date.now() + 3600_000 })).toString(
  'base64url',
)
const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url')

const cookieFile = path.join(process.cwd(), 'data', 'test-session-cookie.txt')
fs.writeFileSync(cookieFile, `sekolah_admin_session=${payload}.${signature}`, 'utf8')
console.log(`[setup] cookie ditulis ke ${cookieFile}`)

await db.destroy()
