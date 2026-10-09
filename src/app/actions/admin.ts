'use server'

import { redirect } from 'next/navigation'
import db from '@/db'
import { authenticate, createSession, destroySession, getCurrentAdmin } from '@/lib/auth'
import { fieldErrors, loginSchema, ppdbStatusSchema } from '@/lib/validation'
import { ppdbStatusLabels } from '@/lib/ppdb'

export type ActionState = {
  status: 'idle' | 'error' | 'success'
  message?: string
  errors?: Record<string, string>
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Lengkapi username dan password.', errors: fieldErrors(parsed.error) }
  }

  const admin = await authenticate(parsed.data.username, parsed.data.password)
  if (!admin) {
    return { status: 'error', message: 'Username atau password salah.' }
  }

  await createSession(admin.id)
  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/admin/login')
}

export async function updatePpdbStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin()
  if (!admin) return { status: 'error', message: 'Sesi berakhir, silakan login kembali.' }

  const parsed = ppdbStatusSchema.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
    admin_note: formData.get('admin_note') ?? '',
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Data status tidak valid.', errors: fieldErrors(parsed.error) }
  }

  const updated = await db('ppdb_registrations')
    .where('id', parsed.data.id)
    .update({ status: parsed.data.status, admin_note: parsed.data.admin_note ?? '' })

  if (updated === 0) {
    return { status: 'error', message: 'Data pendaftar tidak ditemukan.' }
  }

  return { status: 'success', message: `Status diperbarui menjadi ${ppdbStatusLabels[parsed.data.status]}.` }
}

export async function deletePpdbRegistrationAction(formData: FormData): Promise<void> {
  await assertAdmin()

  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return

  await db('ppdb_registrations').where('id', id).delete()
}

export async function createAdminUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await assertAdmin()

  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('full_name') ?? '').trim()

  if (username.length < 3) {
    return { status: 'error', message: 'Username minimal 3 karakter.' }
  }
  if (password.length < 8) {
    return { status: 'error', message: 'Password minimal 8 karakter.' }
  }

  const exists = await db('admin_users').where('username', username).first()
  if (exists) {
    return { status: 'error', message: 'Username sudah dipakai.' }
  }

  const bcrypt = (await import('bcryptjs')).default
  await db('admin_users').insert({
    username,
    password_hash: await bcrypt.hash(password, 12),
    full_name: fullName || username,
    role: 'editor',
  })

  return { status: 'success', message: `Admin ${username} dibuat.` }
}

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getCurrentAdmin()
  if (!admin) return { status: 'error', message: 'Sesi berakhir, silakan login kembali.' }

  const currentPassword = String(formData.get('current_password') ?? '')
  const newPassword = String(formData.get('new_password') ?? '')

  if (newPassword.length < 8) {
    return { status: 'error', message: 'Password baru minimal 8 karakter.' }
  }

  const bcrypt = (await import('bcryptjs')).default
  const row = await db<{ password_hash: string }>('admin_users').where('id', admin.id).first()
  if (!row || !(await bcrypt.compare(currentPassword, row.password_hash))) {
    return { status: 'error', message: 'Password lama tidak cocok.' }
  }

  await db('admin_users')
    .where('id', admin.id)
    .update({ password_hash: await bcrypt.hash(newPassword, 12) })

  return { status: 'success', message: 'Password berhasil diperbarui.' }
}

export async function assertAdmin(): Promise<void> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }
}
