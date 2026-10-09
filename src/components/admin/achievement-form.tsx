'use client'

import { useActionState, useId, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { saveAchievementAction } from '@/app/actions/content'
import type { SaveAchievementResult } from '@/app/actions/content'
import type { AchievementRow } from '@/lib/types'

const initialState: SaveAchievementResult = { status: 'idle' }
const currentYear = new Date().getFullYear()

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

export function AchievementForm({ item, defaultOpen = false }: { item: AchievementRow | null; defaultOpen?: boolean }) {
  const [state, formAction] = useActionState(saveAchievementAction, initialState)
  const [open, setOpen] = useState(item !== null || defaultOpen)
  const id = useId()
  const errors = state.errors ?? {}

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg">{item ? 'Ubah data prestasi' : 'Tambah prestasi'}</h2>
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
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-title`} className="field-label">
                Nama prestasi
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
              <label htmlFor={`${id}-level`} className="field-label">
                Tingkat
              </label>
              <select
                id={`${id}-level`}
                name="level"
                defaultValue={item?.level ?? 'Kabupaten'}
                className="field-input"
              >
                <option value="Sekolah">Sekolah</option>
                <option value="Kabupaten">Kabupaten</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Nasional">Nasional</option>
              </select>
              {errors.level ? <p className="field-error">{errors.level}</p> : null}
            </div>

            <div>
              <label htmlFor={`${id}-year`} className="field-label">
                Tahun
              </label>
              <input
                id={`${id}-year`}
                name="year"
                type="number"
                min={1990}
                max={2100}
                required
                defaultValue={item?.year ?? currentYear}
                className="field-input"
              />
              {errors.year ? <p className="field-error">{errors.year}</p> : null}
            </div>

            <div>
              <label htmlFor={`${id}-holder`} className="field-label">
                Nama pemenang
              </label>
              <input
                id={`${id}-holder`}
                name="holder"
                type="text"
                maxLength={160}
                defaultValue={item?.holder ?? ''}
                placeholder="Nama siswa atau tim"
              />
            </div>

            <div>
              <label htmlFor={`${id}-image`} className="field-label">
                URL foto atau piagam
              </label>
              <input
                id={`${id}-image`}
                name="image"
                type="text"
                maxLength={255}
                defaultValue={item?.image ?? ''}
                className="field-input"
                placeholder="/uploads/piagam.svg"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${id}-description`} className="field-label">
                Keterangan (opsional)
              </label>
              <textarea
                id={`${id}-description`}
                name="description"
                rows={3}
                maxLength={1000}
                defaultValue={item?.description ?? ''}
                className="field-input resize-y"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <SubmitButton label={item ? 'Simpan perubahan' : 'Simpan prestasi'} />
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
