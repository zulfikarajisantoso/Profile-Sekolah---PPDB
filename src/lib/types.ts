export type { PpdbStatus } from './ppdb'

export type NewsRow = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  category: string
  is_published: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export type TeacherRow = {
  id: number
  name: string
  nip: string | null
  subject: string
  position: string
  photo: string | null
  bio: string
  sort_order: number
  is_active: number
  created_at: string
  updated_at: string
}

export type AchievementRow = {
  id: number
  title: string
  level: string
  year: number
  holder: string
  image: string | null
  description: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type PpdbRow = {
  id: number
  registration_number: string
  student_name: string
  student_nisn: string | null
  gender: string
  birth_place: string
  birth_date: string
  religion: string
  origin_school: string
  address: string
  village: string
  district: string
  parent_name: string
  parent_phone: string
  parent_email: string
  parent_job: string
  program: string
  note: string
  documents: string
  status: import('./ppdb').PpdbStatus
  admin_note: string
  created_at: string
  updated_at: string
}

export type StoredDocument = {
  name: string
  storedAs: string
}
