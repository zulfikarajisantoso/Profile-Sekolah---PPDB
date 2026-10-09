'use client'

import { useActionState, useId, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { saveTeacherAction } from '@/app/actions/content'
import type { SaveTeacherResult } from '@/app/actions/content'
import type { TeacherRow } from '@/lib/types'

const initialState: SaveTeacherResult = { status: 'idle' }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
    >
      {pending ? 'Menyimpan...' : label}
    </button>
  )
}

export function TeacherForm({
  item,
  subjects,
  defaultOpen = false,
}: {
  item: TeacherRow | null
  subjects: string[]
  defaultOpen?: boolean
}) {
  const [state, formAction] = useActionState(saveTeacherAction, initialState)
  const [open, setOpen] = useState(item !== null || defaultOpen)
  const id = useId()
  const errors = state.errors ?? {}

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg">{item ? 'Ubah data guru' : 'Tambah data guru'}</h2>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-name`} className="field-label">
                Nama lengkap dan gelar
              </label>
              <input
                id={`${id}-name`}
                name="name"
                type="text"
                required
                maxLength={120}
                defaultValue={item?.name ?? ''}
                className="field-input"
              />
              {errors.name ? <p className="field-error">{errors.name}</p> : null}
            </div>

            <div>
              <label htmlFor={`${id}-nip`} className="field-label">
                NIP (opsional)
              </label>
              <input
                id={`${id}-nip`}
                name="nip"
                type="text"
                maxLength={40}
                defaultValue={item?.nip ?? ''}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor={`${id}-subject`} className="field-label">
                Mata pelajaran
              </label>
              <input
                id={`${id}-subject`}
                name="subject"
                type="text"
                list={`${id}-subject-list`}
                required
                maxLength={120}
                defaultValue={item?.subject ?? ''}
                className="field-input"
              />
              <datalist id={`${id}-subject-list`}>
                {subjects.map((subject) => (
                  <option key={subject} value={subject} />
                ))}
              </datalist>
              {errors.subject ? <p className="field-error">{errors.subject}</p> : null}
              <p className="mt-1.5 text-xs text-slate-500">Pilih dari daftar atau ketik mata pelajaran baru.</p>
            </div>

            <div>
              <label htmlFor={`${id}-position`} className="field-label">
                Jabatan
              </label>
              <input
                id={`${id}-position`}
                name="position"
                type="text"
                maxLength={120}
                defaultValue={item?.position ?? ''}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor={`${id}-photo`} className="field-label">
                URL foto
              </label>
              <input
                id={`${id}-photo`}
                name="photo"
                type="text"
                maxLength={255}
                defaultValue={item?.photo ?? ''}
                className="field-input"
                placeholder="/uploads/guru-1.svg"
              />
            </div>

            <div>
              <label htmlFor={`${id}-sort_order`} className="field-label">
                Urutan tampil
              </label>
              <input
                id={`${id}-sort_order`}
                name="sort_order"
                type="number"
                min={0}
                max={999}
                defaultValue={item?.sort_order ?? 0}
                className="field-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor={`${id}-bio`} className="field-label">
              Profil singkat (opsional)
            </label>
            <textarea
              id={`${id}-bio`}
              name="bio"
              rows={3}
              maxLength={1000}
              defaultValue={item?.bio ?? ''}
              className="field-input resize-y"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={item ? Boolean(item.is_active) : true}
              className="h-4 w-4 rounded border-slate-300"
            />
            Tampilkan di halaman publik
          </label>

          <div className="flex gap-3">
            <SubmitButton label={item ? 'Simpan perubahan' : 'Simpan data'} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </form>
      ) : null}
    </section>
  )
}
