'use client'

import { useActionState, useId, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { saveNewsAction, type SaveNewsResult } from '@/app/actions/content'
import type { NewsRow } from '@/lib/types'

const emptyForm: SaveNewsResult = { status: 'idle' }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
      {pending ? 'Menyimpan...' : label}
    </button>
  )
}

function toLocalInput(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function NewsForm({ item, defaultOpen = false }: { item: NewsRow | null; defaultOpen?: boolean }) {
  const [state, formAction] = useActionState(saveNewsAction, emptyForm)
  const [open, setOpen] = useState(item !== null || defaultOpen)
  const id = useId()
  const errors = state.errors ?? {}

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg">{item ? 'Ubah berita' : 'Tambah berita baru'}</h2>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          {open ? 'Tutup formulir' : 'Buka formulir'}
        </button>
      </div>

      {open ? (
        <form action={formAction} className="mt-5 admin-form-grid">
          <input type="hidden" name="id" value={item?.id ?? 0} />

          {state.status === 'error' && state.message ? (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {state.message}
            </p>
          ) : null}

          <div>
            <label htmlFor={`${id}-title`} className="field-label">
              Judul
            </label>
            <input
              id={`${id}-title`}
              name="title"
              type="text"
              required
              maxLength={200}
              defaultValue={item?.title ?? ''}
              className="field-input"
            />
            {errors.title ? <p className="field-error">{errors.title}</p> : null}
          </div>

          <div>
            <label htmlFor={`${id}-slug`} className="field-label">
              Slug (opsional)
            </label>
            <input
              id={`${id}-slug`}
              name="slug"
              type="text"
              maxLength={220}
              defaultValue={item?.slug ?? ''}
              className="field-input"
              placeholder="dibuat otomatis dari judul"
            />
            {errors.slug ? <p className="field-error">{errors.slug}</p> : null}
          </div>

          <div>
            <label htmlFor={`${id}-excerpt`} className="field-label">
              Ringkasan
            </label>
            <textarea
              id={`${id}-excerpt`}
              name="excerpt"
              rows={2}
              maxLength={400}
              defaultValue={item?.excerpt ?? ''}
              className="field-input resize-y"
            />
            {errors.excerpt ? <p className="field-error">{errors.excerpt}</p> : null}
          </div>

          <div>
            <label htmlFor={`${id}-content`} className="field-label">
              Isi berita
            </label>
            <textarea
              id={`${id}-content`}
              name="content"
              rows={10}
              required
              defaultValue={item?.content ?? ''}
              className="field-input resize-y font-mono text-[0.85rem]"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Pisahkan paragraf dengan baris kosong. Baris yang diawali tanda hubung menjadi daftar poin.
            </p>
            {errors.content ? <p className="field-error">{errors.content}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-category`} className="field-label">
                Kategori
              </label>
              <select
                id={`${id}-category`}
                name="category"
                defaultValue={item?.category ?? 'berita'}
                className="field-input"
              >
                <option value="berita">Berita</option>
                <option value="pengumuman">Pengumuman</option>
              </select>
            </div>

            <div>
              <label htmlFor={`${id}-cover_image`} className="field-label">
                URL gambar sampul
              </label>
              <input
                id={`${id}-cover_image`}
                name="cover_image"
                type="text"
                defaultValue={item?.cover_image ?? ''}
                className="field-input"
                placeholder="/uploads/contoh.svg"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Letakkan berkas di folder <code>public/uploads</code> lalu isi jalurnya di sini.
              </p>
            </div>

            <div>
              <label htmlFor={`${id}-published_at`} className="field-label">
                Waktu terbit
              </label>
              <input
                id={`${id}-published_at`}
                name="published_at"
                type="datetime-local"
                defaultValue={toLocalInput(item?.published_at ?? null)}
                className="field-input"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={item ? Boolean(item.is_published) : true}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Publikasikan berita
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <SubmitButton label={item ? 'Simpan perubahan' : 'Simpan berita'} />
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Batal
            </button>
          </div>
        </form>
      ) : null}
    </section>
  )
}
