'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import db from '@/db'
import { achievementSchema, fieldErrors, newsSchema, teacherSchema } from '@/lib/validation'
import { slugify } from '@/lib/slug'
import { assertAdmin } from './admin'
import type { ActionState } from './admin'

export type SaveNewsResult = ActionState
export type SaveTeacherResult = ActionState
export type SaveAchievementResult = ActionState

export async function saveNewsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await assertAdmin()

  const id = Number(formData.get('id') ?? 0)
  const parsed = newsSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug') ?? undefined,
    excerpt: formData.get('excerpt') ?? '',
    content: formData.get('content'),
    category: formData.get('category') ?? 'berita',
    cover_image: formData.get('cover_image') ?? '',
    is_published: formData.get('is_published') === 'on',
    published_at: formData.get('published_at') ?? '',
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Periksa kembali kolom yang ditandai.', errors: fieldErrors(parsed.error) }
  }

  const data = parsed.data
  const baseSlug = data.slug && data.slug.length > 0 ? slugify(data.slug) : slugify(data.title)
  const slug = await uniqueSlug(baseSlug, id)
  const publishedAt = resolvePublishedAt(data.published_at, data.is_published)

  const payload = {
    title: data.title,
    slug,
    excerpt: data.excerpt ?? '',
    content: data.content,
    category: data.category,
    cover_image: data.cover_image || null,
    is_published: data.is_published ? 1 : 0,
    published_at: publishedAt,
    updated_at: db.fn.now(),
  }

  if (id > 0) {
    const previous = await db<{ slug: string }>('news').where('id', id).first()
    const affected = await db('news').where('id', id).update(payload)
    if (affected === 0) return { status: 'error', message: 'Berita tidak ditemukan.' }
    if (previous && previous.slug !== slug) {
      revalidatePath(`/berita/${previous.slug}`)
    }
  } else {
    await db('news').insert({ ...payload, created_at: db.fn.now() })
  }

  revalidatePath(`/berita/${slug}`)
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath('/sitemap.xml')
  revalidatePath('/')

  redirect(`/admin/berita?sukses=${encodeURIComponent(id > 0 ? 'Berita diperbarui.' : 'Berita ditambahkan.')}`)
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
  await assertAdmin()

  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return

  const existing = await db<{ slug: string }>('news').where('id', id).first()
  await db('news').where('id', id).delete()

  if (existing) {
    revalidatePath(`/berita/${existing.slug}`)
  }
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath('/sitemap.xml')
  revalidatePath('/')
}

export async function toggleNewsPublishedAction(formData: FormData): Promise<void> {
  await assertAdmin()

  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return

  const row = await db<{ is_published: number; slug: string }>('news').where('id', id).first()
  if (!row) return

  await db('news')
    .where('id', id)
    .update({ is_published: row.is_published ? 0 : 1, updated_at: db.fn.now() })

  revalidatePath(`/berita/${row.slug}`)
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath('/sitemap.xml')
  revalidatePath('/')
}

export async function saveTeacherAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await assertAdmin()

  const id = Number(formData.get('id') ?? 0)
  const parsed = teacherSchema.safeParse({
    name: formData.get('name'),
    nip: formData.get('nip') ?? '',
    subject: formData.get('subject'),
    position: formData.get('position') ?? '',
    photo: formData.get('photo') ?? '',
    bio: formData.get('bio') ?? '',
    sort_order: formData.get('sort_order') ?? 0,
    is_active: formData.get('is_active') === 'on',
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Periksa kembali kolom yang ditandai.', errors: fieldErrors(parsed.error) }
  }

  const data = parsed.data
  const payload = {
    name: data.name,
    nip: data.nip || null,
    subject: data.subject,
    position: data.position ?? '',
    photo: data.photo || null,
    bio: data.bio ?? '',
    sort_order: data.sort_order,
    is_active: data.is_active ? 1 : 0,
    updated_at: db.fn.now(),
  }

  if (id > 0) {
    const affected = await db('teachers').where('id', id).update(payload)
    if (affected === 0) return { status: 'error', message: 'Data guru tidak ditemukan.' }
  } else {
    await db('teachers').insert({ ...payload, created_at: db.fn.now() })
  }

  revalidatePath('/admin/guru')
  revalidatePath('/guru')
  revalidatePath('/sitemap.xml')
  revalidatePath('/')

  redirect(`/admin/guru?sukses=${encodeURIComponent(id > 0 ? 'Data guru diperbarui.' : 'Guru ditambahkan.')}`)
}

export async function deleteTeacherAction(formData: FormData): Promise<void> {
  await assertAdmin()

  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return

  await db('teachers').where('id', id).delete()
  revalidatePath('/admin/guru')
  revalidatePath('/guru')
  revalidatePath('/sitemap.xml')
  revalidatePath('/')
}

export async function saveAchievementAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await assertAdmin()

  const id = Number(formData.get('id') ?? 0)
  const parsed = achievementSchema.safeParse({
    title: formData.get('title'),
    level: formData.get('level'),
    year: formData.get('year'),
    holder: formData.get('holder') ?? '',
    image: formData.get('image') ?? '',
    description: formData.get('description') ?? '',
    sort_order: formData.get('sort_order') ?? 0,
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Periksa kembali kolom yang ditandai.', errors: fieldErrors(parsed.error) }
  }

  const data = parsed.data
  const payload = {
    title: data.title,
    level: data.level,
    year: data.year,
    holder: data.holder ?? '',
    image: data.image || null,
    description: data.description ?? '',
    sort_order: data.sort_order,
    updated_at: db.fn.now(),
  }

  if (id > 0) {
    const affected = await db('achievements').where('id', id).update(payload)
    if (affected === 0) return { status: 'error', message: 'Data prestasi tidak ditemukan.' }
  } else {
    await db('achievements').insert({ ...payload, created_at: db.fn.now() })
  }

  revalidatePath('/admin/prestasi')
  revalidatePath('/prestasi')
  revalidatePath('/profil')
  revalidatePath('/sitemap.xml')
  revalidatePath('/')

  redirect(
    `/admin/prestasi?sukses=${encodeURIComponent(id > 0 ? 'Data prestasi diperbarui.' : 'Prestasi ditambahkan.')}`,
  )
}

export async function deleteAchievementAction(formData: FormData): Promise<void> {
  await assertAdmin()

  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return

  await db('achievements').where('id', id).delete()
  revalidatePath('/admin/prestasi')
  revalidatePath('/prestasi')
  revalidatePath('/profil')
  revalidatePath('/sitemap.xml')
  revalidatePath('/')
}

function resolvePublishedAt(value: string | undefined, isPublished: boolean): string | null {
  if (!isPublished) return null
  if (value && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString()
  }
  return new Date().toISOString()
}

async function uniqueSlug(base: string, currentId: number): Promise<string> {
  const root = base.length > 0 ? base : 'berita'
  let candidate = root
  let suffix = 2

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const existing = await db<{ id: number }>('news').where('slug', candidate).first()
    if (!existing || existing.id === currentId) return candidate
    candidate = `${root}-${suffix}`
    suffix += 1
  }

  return `${root}-${Date.now()}`
}
