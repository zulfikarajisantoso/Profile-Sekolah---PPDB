import 'server-only'
import { cache } from 'react'
import db from '@/db'

export type { AchievementRow, NewsRow, PpdbRow, PpdbStatus, StoredDocument, TeacherRow } from './types'
export { ppdbStatusLabels, ppdbStatuses } from './ppdb'

import type { AchievementRow, NewsRow, PpdbRow, TeacherRow } from './types'

export const PAGE_SIZE = 6

export const getPublishedNews = cache(async (limit?: number, offset = 0) => {
  const query = db<NewsRow>('news')
    .select('*')
    .where('is_published', 1)
    .whereNotNull('published_at')
    .orderBy('published_at', 'desc')

  if (limit !== undefined) query.limit(limit).offset(offset)

  return query
})

export const getFeaturedNews = cache(async (limit: number) => {
  return db<NewsRow>('news')
    .select('*')
    .where('is_published', 1)
    .whereNotNull('published_at')
    .orderBy('published_at', 'desc')
    .limit(limit)
})

export const countPublishedNews = cache(async () => {
  const row = await db<{ total: number }>('news')
    .where('is_published', 1)
    .whereNotNull('published_at')
    .count<{ total: number }>('* as total')
    .first()
  return Number(row?.total ?? 0)
})

export const getNewsBySlug = cache(async (slug: string) => {
  return db<NewsRow>('news').select('*').where('slug', slug).first()
})

export const getRelatedNews = cache(async (slug: string, category: string, limit: number) => {
  return db<NewsRow>('news')
    .select('*')
    .where('is_published', 1)
    .whereNot('slug', slug)
    .orderByRaw('case when category = ? then 0 else 1 end', [category])
    .orderBy('published_at', 'desc')
    .limit(limit)
})

export const getTeachers = cache(async (onlyActive = true) => {
  const query = db<TeacherRow>('teachers').select('*').orderBy('sort_order', 'asc').orderBy('name', 'asc')
  if (onlyActive) query.where('is_active', 1)
  return query
})

export const getTeacherSubjects = cache(async () => {
  const rows = await db<{ subject: string }>('teachers').select('subject').distinct().orderBy('subject', 'asc')
  return rows.map((row) => row.subject).filter(Boolean)
})

export const getAchievements = cache(async () => {
  return db<AchievementRow>('achievements').select('*').orderBy('year', 'desc').orderBy('sort_order', 'asc')
})

export const getAchievementYears = cache(async () => {
  const rows = await db<{ year: number }>('achievements').select('year').distinct().orderBy('year', 'desc')
  return rows.map((row) => row.year)
})

export const getPpdbRegistrationByNumber = cache(async (registrationNumber: string) => {
  const number = registrationNumber.trim().toUpperCase()
  return db<PpdbRow>('ppdb_registrations').select('*').where('registration_number', number).first()
})
