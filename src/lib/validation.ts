import { z } from 'zod'

const trimmed = (max: number) => z.string().trim().max(max, `Maksimal ${max} karakter`)
const requiredText = (label: string, max: number) =>
  trimmed(max).min(1, `${label} wajib diisi`)

export const loginSchema = z.object({
  username: requiredText('Username', 64),
  password: z.string().min(1, 'Password wajib diisi').max(200),
})

export type LoginInput = z.infer<typeof loginSchema>

export const newsSchema = z.object({
  title: requiredText('Judul', 200),
  slug: trimmed(220).optional(),
  excerpt: trimmed(400).optional().default(''),
  content: z.string().trim().min(1, 'Isi berita wajib diisi').max(20000, 'Isi berita terlalu panjang'),
  category: z.enum(['berita', 'pengumuman']).default('berita'),
  cover_image: trimmed(255).optional(),
  is_published: z.coerce.boolean().default(false),
  published_at: trimmed(40).optional(),
})

export type NewsInput = z.infer<typeof newsSchema>

export const teacherSchema = z.object({
  name: requiredText('Nama', 120),
  nip: trimmed(40).optional(),
  subject: requiredText('Mata pelajaran', 120),
  position: trimmed(120).optional().default(''),
  photo: trimmed(255).optional(),
  bio: trimmed(1000).optional().default(''),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
  is_active: z.coerce.boolean().default(true),
})

export type TeacherInput = z.infer<typeof teacherSchema>

export const achievementSchema = z.object({
  title: requiredText('Nama prestasi', 200),
  level: requiredText('Tingkat', 64),
  year: z.coerce.number().int().min(1990).max(2100),
  holder: trimmed(160).optional().default(''),
  image: trimmed(255).optional(),
  description: trimmed(1000).optional().default(''),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
})

export type AchievementInput = z.infer<typeof achievementSchema>

const phoneRegex = /^[0-9+][0-9\s-]{7,19}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const ppdbSchema = z.object({
  student_name: requiredText('Nama calon siswa', 120),
  student_nisn: trimmed(32).optional(),
  gender: z.enum(['L', 'P'], { message: 'Pilih jenis kelamin' }),
  birth_place: requiredText('Tempat lahir', 80),
  birth_date: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Tanggal lahir tidak valid'),
  religion: requiredText('Agama', 40),
  origin_school: trimmed(160).optional().default(''),
  address: requiredText('Alamat', 255),
  village: trimmed(80).optional().default(''),
  district: trimmed(80).optional().default(''),
  parent_name: requiredText('Nama orang tua/wali', 120),
  parent_phone: trimmed(32)
    .refine((value) => phoneRegex.test(value), 'Nomor telepon tidak valid')
    .refine((value) => value.replace(/\D/g, '').length >= 9, 'Nomor telepon minimal 9 digit'),
  parent_email: trimmed(160)
    .refine((value) => value.length === 0 || emailRegex.test(value), 'Format email tidak valid')
    .default(''),
  parent_job: trimmed(100).optional().default(''),
  program: requiredText('Program', 80),
  note: trimmed(1000).optional().default(''),
  website: trimmed(200).optional().default(''),
})

export type PpdbInput = z.infer<typeof ppdbSchema>

export const ppdbStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(['baru', 'diverifikasi', 'diterima', 'ditolak']),
  admin_note: trimmed(1000).optional().default(''),
})

export type PpdbStatusUpdateInput = z.infer<typeof ppdbStatusSchema>

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (key && !result[key]) result[key] = issue.message
  }
  return result
}
