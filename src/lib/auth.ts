import 'server-only'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import db from '@/db'

const SESSION_COOKIE = 'sekolah_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 8

export type AdminUser = {
  id: number
  username: string
  full_name: string
  role: string
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (secret && secret.length >= 16) return secret

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET wajib diisi (minimal 16 karakter) di environment production')
  }

  return 'sekolah-dev-secret-ganti-di-production'
}

type SessionPayload = {
  userId: number
  expiresAt: number
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url')
}

function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

function decodeSession(token: string | undefined): SessionPayload | null {
  if (!token) return null

  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = sign(body)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
    if (typeof payload.userId !== 'number' || typeof payload.expiresAt !== 'number') return null
    if (payload.expiresAt < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function createSession(userId: number): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, encodeSession({ userId, expiresAt: Date.now() + SESSION_TTL_MS }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const store = await cookies()
  const payload = decodeSession(store.get(SESSION_COOKIE)?.value)
  if (!payload) return null

  const user = await db<AdminUser>('admin_users')
    .select('id', 'username', 'full_name', 'role')
    .where('id', payload.userId)
    .first()

  return user ?? null
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    throw new Error('UNAUTHORIZED')
  }
  return admin
}

export async function authenticate(username: string, password: string): Promise<AdminUser | null> {
  const user = await db<{ id: number; username: string; password_hash: string; full_name: string; role: string }>(
    'admin_users',
  )
    .where('username', username)
    .first()

  if (!user) {
    await bcrypt.compare(password, '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv')
    return null
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return null

  return { id: user.id, username: user.username, full_name: user.full_name, role: user.role }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
