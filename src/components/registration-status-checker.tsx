'use client'

import { useActionState, useId } from 'react'
import { useFormStatus } from 'react-dom'
import { checkRegistrationStatusAction, type StatusCheckState } from '@/app/actions/ppdb'

const initialState: StatusCheckState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? 'Memeriksa...' : 'Cek status'}
    </button>
  )
}

function formatDate(value: string | undefined): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export function RegistrationStatusChecker() {
  const [state, formAction] = useActionState(checkRegistrationStatusAction, initialState)
  const id = useId()

  return (
    <div className="card p-6 sm:p-8">
      <form action={formAction} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor={`${id}-number`} className="field-label">
            Nomor pendaftaran
          </label>
          <input
            id={`${id}-number`}
            name="registration_number"
            type="text"
            required
            placeholder="PPDB-2027-0001"
            className="field-input uppercase"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Nomor pendaftaran diberikan setelah formulir berhasil dikirim, contoh PPDB-2027-0001.
          </p>
        </div>
        <SubmitButton />
      </form>

      <div aria-live="polite" className="mt-5">
        {state.status === 'error' && state.message ? (
          <p
            role="alert"
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
          >
            {state.message}
          </p>
        ) : null}

        {state.status === 'found' && state.registrationNumber ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <p className="font-display text-lg font-semibold text-green-900">{state.registrationNumber}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-green-700">Nama calon siswa</dt>
                <dd className="mt-0.5 font-medium text-green-900">{state.studentName}</dd>
              </div>
              <div>
                <dt className="text-green-700">Program</dt>
                <dd className="mt-0.5 font-medium text-green-900">{state.program}</dd>
              </div>
              <div>
                <dt className="text-green-700">Tanggal daftar</dt>
                <dd className="mt-0.5 font-medium text-green-900">{formatDate(state.submittedAt)}</dd>
              </div>
            </dl>
            <p className="mt-4 inline-flex rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
              Status: {state.statusLabel}
            </p>
            <p className="mt-3 text-sm text-green-800">
              Untuk informasi lebih lanjut, panitia PPDB dapat menghubungi Anda pada nomor telepon yang terdaftar.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
