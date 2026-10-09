'use client'

import { useActionState, useId } from 'react'
import { useFormStatus } from 'react-dom'
import { changePasswordAction, createAdminUserAction, type ActionState } from '@/app/actions/admin'

const initialState: ActionState = { status: 'idle' }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
    >
      {pending ? 'Memproses...' : label}
    </button>
  )
}

function Feedback({ state }: { state: ActionState }) {
  if (state.status === 'error' && state.message) {
    return (
      <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
        {state.message}
      </p>
    )
  }
  if (state.status === 'success' && state.message) {
    return (
      <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
        {state.message}
      </p>
    )
  }
  return null
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState)
  const id = useId()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg">Ubah password</h2>
      <p className="mt-1.5 text-sm text-slate-600">Gunakan password minimal 8 karakter.</p>

      <form action={formAction} className="mt-5 space-y-4">
        <Feedback state={state} />

        <div>
          <label htmlFor={`${id}-current`} className="field-label">
            Password saat ini
          </label>
          <input id={`${id}-current`} name="current_password" type="password" required autoComplete="current-password" className="field-input" />
        </div>

        <div>
          <label htmlFor={`${id}-new`} className="field-label">
            Password baru
          </label>
          <input id={`${id}-new`} name="new_password" type="password" required autoComplete="new-password" className="field-input" />
        </div>

        <SubmitButton label="Perbarui password" />
      </form>
    </section>
  )
}

export function NewAdminForm() {
  const [state, formAction] = useActionState(createAdminUserAction, initialState)
  const id = useId()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg">Tambah akun editor</h2>
      <p className="mt-1.5 text-sm text-slate-600">
        Akun editor dapat menambah dan mengubah berita, data guru, serta prestasi.
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <Feedback state={state} />

        <div>
          <label htmlFor={`${id}-username`} className="field-label">
            Username
          </label>
          <input id={`${id}-username`} name="username" type="text" required minLength={3} className="field-input" />
        </div>

        <div>
          <label htmlFor={`${id}-full_name`} className="field-label">
            Nama lengkap
          </label>
          <input id={`${id}-full_name`} name="full_name" type="text" className="field-input" />
        </div>

        <div>
          <label htmlFor={`${id}-password`} className="field-label">
            Password
          </label>
          <input id={`${id}-password`} name="password" type="password" required minLength={8} autoComplete="new-password" className="field-input" />
        </div>

        <SubmitButton label="Buat akun" />
      </form>
    </section>
  )
}
