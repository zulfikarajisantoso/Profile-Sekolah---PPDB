'use server'

import { revalidatePath } from 'next/cache'
import db from '@/db'
import { ppdbSchema, fieldErrors } from '@/lib/validation'
import { storeUpload } from '@/lib/upload'
import { ppdbStatusLabels } from '@/lib/ppdb'
import type { PpdbRow } from '@/lib/types'

export type PpdbActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Record<string, string>
  registrationNumber?: string
  values?: Record<string, string>
}

export async function submitPpdbRegistration(
  _prev: PpdbActionState,
  formData: FormData,
): Promise<PpdbActionState> {
  const raw: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string' && key !== 'website') {
      raw[key] = value
    }
  }

  // Honeypot terisi berarti submission came from bot. Balas seperti sukses supaya
  // bot tidak belajar, tanpa menyimpan apa pun ke database.
  if (typeof formData.get('website') === 'string' && (formData.get('website') as string).length > 0) {
    return { status: 'success', message: 'Pendaftaran diterima.' }
  }

  const parsed = ppdbSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Periksa kembali data yang Anda isi.',
      errors: fieldErrors(parsed.error),
      values: raw,
    }
  }

  const files = formData.getAll('documents').filter((item): item is File => item instanceof File && item.size > 0)

  if (files.length > 4) {
    return {
      status: 'error',
      message: 'Maksimal 4 dokumen per pendaftaran.',
      values: raw,
    }
  }

  const uploaded: { name: string; storedAs: string }[] = []
  try {
    for (const file of files) {
      uploaded.push(await storeUpload(file, 'ppdb'))
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Gagal mengunggah dokumen.',
      values: raw,
    }
  }

  const data = parsed.data
  const registrationNumber = await generateRegistrationNumber()

  try {
    await db('ppdb_registrations').insert({
      registration_number: registrationNumber,
      student_name: data.student_name,
      student_nisn: data.student_nisn || null,
      gender: data.gender,
      birth_place: data.birth_place,
      birth_date: data.birth_date,
      religion: data.religion,
      origin_school: data.origin_school ?? '',
      address: data.address,
      village: data.village ?? '',
      district: data.district ?? '',
      parent_name: data.parent_name,
      parent_phone: data.parent_phone,
      parent_email: data.parent_email ?? '',
      parent_job: data.parent_job ?? '',
      program: data.program,
      note: data.note ?? '',
      documents: JSON.stringify(uploaded),
      status: 'baru',
    })
  } catch {
    return {
      status: 'error',
      message: 'Pendaftaran gagal disimpan. Silakan coba beberapa saat lagi.',
      values: raw,
    }
  }

  revalidatePath('/admin/ppdb')

  return {
    status: 'success',
    registrationNumber,
    message: 'Pendaftaran berhasil disimpan.',
  }
}

async function generateRegistrationNumber(): Promise<string> {
  const year = new Date().getFullYear() + 1
  const prefix = `PPDB-${year}-`

  const countRow = await db('ppdb_registrations')
    .where('registration_number', 'like', `${prefix}%`)
    .count<{ total: number }>('* as total')
    .first()

  let sequence = Number(countRow?.total ?? 0) + 1
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `${prefix}${String(sequence).padStart(4, '0')}`
    const existing = await db('ppdb_registrations').where('registration_number', candidate).first()
    if (!existing) return candidate
    sequence += 1
  }

  return `${prefix}${Date.now()}`
}

export type StatusCheckState = {
  status: 'idle' | 'found' | 'error'
  message?: string
  registrationNumber?: string
  studentName?: string
  program?: string
  statusLabel?: string
  submittedAt?: string
}

export async function checkRegistrationStatusAction(
  _prev: StatusCheckState,
  formData: FormData,
): Promise<StatusCheckState> {
  const number = String(formData.get('registration_number') ?? '').trim().toUpperCase()

  if (!number) {
    return { status: 'error', message: 'Masukkan nomor pendaftaran terlebih dahulu.' }
  }

  const row = await db<Pick<
    PpdbRow,
    'registration_number' | 'student_name' | 'program' | 'status' | 'created_at'
  >>('ppdb_registrations')
    .select('registration_number', 'student_name', 'program', 'status', 'created_at')
    .where('registration_number', number)
    .first()

  if (!row) {
    return {
      status: 'error',
      message: 'Nomor pendaftaran tidak ditemukan. Periksa kembali nomor yang Anda terima saat mendaftar.',
    }
  }

  return {
    status: 'found',
    registrationNumber: row.registration_number,
    studentName: row.student_name,
    program: row.program,
    statusLabel: ppdbStatusLabels[row.status] ?? row.status,
    submittedAt: row.created_at,
  }
}
