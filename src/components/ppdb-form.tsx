'use client'

import { useActionState, useId } from 'react'
import { useFormStatus } from 'react-dom'
import { submitPpdbRegistration, type PpdbActionState } from '@/app/actions/ppdb'
import { ACCEPTED_UPLOAD_LABEL, ACCEPTED_UPLOAD_TYPES } from '@/lib/upload-constants'
import { ppdbConfig } from '@/lib/site-config'
import { religionOptions } from '@/lib/ppdb'

const initialState: PpdbActionState = { status: 'idle' }

const religions = religionOptions

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
      {pending ? 'Mengirim...' : 'Kirim pendaftaran'}
    </button>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="field-error" role="alert">
      {message}
    </p>
  )
}

type SectionProps = {
  title: string
  description: string
  children: React.ReactNode
}

function Section({ title, description, children }: SectionProps) {
  return (
    <fieldset className="card p-6">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-lg">{title}</h2>
      <p className="mt-1.5 text-sm text-slate-600">{description}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

export function PpdbForm() {
  const [state, formAction] = useActionState(submitPpdbRegistration, initialState)
  const id = useId()
  const errors = state.errors ?? {}

  if (state.status === 'success') {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl">Pendaftaran berhasil</h2>

        {state.registrationNumber ? (
          <>
            <p className="mt-2.5 text-sm text-slate-600">
              Simpan nomor pendaftaran berikut. Nomor ini dipakai untuk mengecek status pendaftaran Anda.
            </p>
            <p className="mt-6 rounded-xl border border-dashed border-brand-300 bg-brand-50 px-6 py-5 font-display text-2xl font-semibold tracking-wider text-brand-900">
              {state.registrationNumber}
            </p>
            <p className="mt-6 text-sm text-slate-600">
              Tunjukkan nomor ini kepada panitia PPDB saat Anda datang ke sekolah untuk verifikasi berkas.
            </p>
          </>
        ) : (
          <p className="mt-2.5 text-sm text-slate-600">{state.message}</p>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {state.registrationNumber ? (
            <a href="/ppdb/cek" className="btn-primary">
              Cek status pendaftaran
            </a>
          ) : null}
          <button type="button" className="btn-ghost" onClick={() => window.location.reload()}>
            Daftarkan anak lain
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Jangan diisi</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && state.message ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.message}
        </div>
      ) : null}

      <Section title="Data calon siswa" description="Isi sesuai akta kelahiran calon siswa.">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-student_name`} className="field-label">
            Nama lengkap calon siswa <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-student_name`}
            name="student_name"
            type="text"
            required
            defaultValue={state.values?.student_name}
            className="field-input"
            aria-invalid={Boolean(errors.student_name)}
          />
          <FieldError message={errors.student_name} />
        </div>

        <div>
          <label htmlFor={`${id}-student_nisn`} className="field-label">
            NISN (opsional)
          </label>
          <input
            id={`${id}-student_nisn`}
            name="student_nisn"
            type="text"
            inputMode="numeric"
            maxLength={32}
            defaultValue={state.values?.student_nisn}
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor={`${id}-gender`} className="field-label">
            Jenis kelamin <span aria-hidden="true">*</span>
          </label>
          <select
            id={`${id}-gender`}
            name="gender"
            required
            defaultValue={state.values?.gender ?? ''}
            className="field-input"
            aria-invalid={Boolean(errors.gender)}
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <FieldError message={errors.gender} />
        </div>

        <div>
          <label htmlFor={`${id}-birth_place`} className="field-label">
            Tempat lahir <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-birth_place`}
            name="birth_place"
            type="text"
            required
            defaultValue={state.values?.birth_place}
            className="field-input"
            aria-invalid={Boolean(errors.birth_place)}
          />
          <FieldError message={errors.birth_place} />
        </div>

        <div>
          <label htmlFor={`${id}-birth_date`} className="field-label">
            Tanggal lahir <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-birth_date`}
            name="birth_date"
            type="date"
            required
            defaultValue={state.values?.birth_date}
            className="field-input"
            aria-invalid={Boolean(errors.birth_date)}
          />
          <FieldError message={errors.birth_date} />
        </div>

        <div>
          <label htmlFor={`${id}-religion`} className="field-label">
            Agama <span aria-hidden="true">*</span>
          </label>
          <select
            id={`${id}-religion`}
            name="religion"
            required
            defaultValue={state.values?.religion ?? ''}
            className="field-input"
            aria-invalid={Boolean(errors.religion)}
          >
            <option value="">Pilih agama</option>
            {religions.map((religion) => (
              <option key={religion} value={religion}>
                {religion}
              </option>
            ))}
          </select>
          <FieldError message={errors.religion} />
        </div>

        <div>
          <label htmlFor={`${id}-origin_school`} className="field-label">
            Asal sekolah (kelas 4 dan 5)
          </label>
          <input
            id={`${id}-origin_school`}
            name="origin_school"
            type="text"
            maxLength={160}
            defaultValue={state.values?.origin_school}
            className="field-input"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${id}-address`} className="field-label">
            Alamat lengkap <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-address`}
            name="address"
            type="text"
            required
            maxLength={255}
            defaultValue={state.values?.address}
            className="field-input"
            aria-invalid={Boolean(errors.address)}
          />
          <FieldError message={errors.address} />
        </div>

        <div>
          <label htmlFor={`${id}-village`} className="field-label">
            Kelurahan / desa
          </label>
          <input
            id={`${id}-village`}
            name="village"
            type="text"
            maxLength={80}
            defaultValue={state.values?.village}
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor={`${id}-district`} className="field-label">
            Kecamatan
          </label>
          <input
            id={`${id}-district`}
            name="district"
            type="text"
            maxLength={80}
            defaultValue={state.values?.district}
            className="field-input"
          />
        </div>
      </Section>

      <Section title="Data orang tua atau wali" description="Dipakai panitia PPDB untuk menghubungi calon siswa.">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-parent_name`} className="field-label">
            Nama lengkap orang tua / wali <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-parent_name`}
            name="parent_name"
            type="text"
            required
            defaultValue={state.values?.parent_name}
            className="field-input"
            aria-invalid={Boolean(errors.parent_name)}
          />
          <FieldError message={errors.parent_name} />
        </div>

        <div>
          <label htmlFor={`${id}-parent_phone`} className="field-label">
            Nomor telepon / WhatsApp <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-parent_phone`}
            name="parent_phone"
            type="tel"
            required
            placeholder="08xxxxxxxxxx"
            defaultValue={state.values?.parent_phone}
            className="field-input"
            aria-invalid={Boolean(errors.parent_phone)}
          />
          <FieldError message={errors.parent_phone} />
        </div>

        <div>
          <label htmlFor={`${id}-parent_email`} className="field-label">
            Email (opsional)
          </label>
          <input
            id={`${id}-parent_email`}
            name="parent_email"
            type="email"
            defaultValue={state.values?.parent_email}
            className="field-input"
            aria-invalid={Boolean(errors.parent_email)}
          />
          <FieldError message={errors.parent_email} />
        </div>

        <div>
          <label htmlFor={`${id}-parent_job`} className="field-label">
            Pekerjaan orang tua
          </label>
          <input
            id={`${id}-parent_job`}
            name="parent_job"
            type="text"
            maxLength={100}
            defaultValue={state.values?.parent_job}
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor={`${id}-program`} className="field-label">
            Program yang dipilih <span aria-hidden="true">*</span>
          </label>
          <select
            id={`${id}-program`}
            name="program"
            required
            defaultValue={state.values?.program ?? ''}
            className="field-input"
            aria-invalid={Boolean(errors.program)}
          >
            <option value="">Pilih program</option>
            {ppdbConfig.programs.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
          <FieldError message={errors.program} />
        </div>
      </Section>

      <fieldset className="card p-6">
        <legend className="sr-only">Dokumen pendukung</legend>
        <h2 className="text-lg">Dokumen pendukung (opsional)</h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Unggah maksimal 4 berkas. {ACCEPTED_UPLOAD_LABEL}. Kalau belum punya salinan digital, berkas bisa menyusul
          saat verifikasi di sekolah.
        </p>
        <div className="mt-5">
          <label htmlFor={`${id}-documents`} className="field-label">
            Pilih berkas
          </label>
          <input
            id={`${id}-documents`}
            name="documents"
            type="file"
            multiple
            accept={ACCEPTED_UPLOAD_TYPES}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-800"
          />
        </div>
      </fieldset>

      <fieldset className="card p-6">
        <legend className="sr-only">Catatan tambahan</legend>
        <h2 className="text-lg">Catatan tambahan</h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Informasi tambahan yang perlu diketahui panitia, misalnya kebutuhan khusus atau riwayat sakit calon siswa.
        </p>
        <div className="mt-5">
          <label htmlFor={`${id}-note`} className="field-label">
            Catatan
          </label>
          <textarea
            id={`${id}-note`}
            name="note"
            rows={4}
            maxLength={1000}
            defaultValue={state.values?.note}
            className="field-input resize-y"
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-600">
          Dengan mengirim formulir ini, Anda menyatakan data yang diisi benar dan bersedia mengikuti proses seleksi PPDB.
        </p>
        <SubmitButton />
      </div>
    </form>
  )
}
