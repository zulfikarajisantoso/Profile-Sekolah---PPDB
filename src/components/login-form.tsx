'use client'

import { useActionState, useId } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction, type ActionState } from '@/app/actions/admin'

const initialState: ActionState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? 'Memeriksa...' : 'Masuk'}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState)
  const id = useId()
  const errors = state.errors ?? {}

  return (
    <form action={formAction} className="card p-6 sm:p-8">
      <h1 className="text-2xl">Masuk panel admin</h1>
      <p className="mt-2 text-sm text-slate-600">Gunakan akun yang diberikan oleh tata usaha sekolah.</p>

      {state.status === 'error' && state.message ? (
        <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.message}
        </p>
      ) : null}

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor={`${id}-username`} className="field-label">
            Username
          </label>
          <input
            id={`${id}-username`}
            name="username"
            type="text"
            autoComplete="username"
            required
            className="field-input"
            aria-invalid={Boolean(errors.username)}
          />
          {errors.username ? <p className="field-error">{errors.username}</p> : null}
        </div>

        <div>
          <label htmlFor={`${id}-password`} className="field-label">
            Password
          </label>
          <input
            id={`${id}-password`}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="field-input"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password ? <p className="field-error">{errors.password}</p> : null}
        </div>
      </div>

      <div className="mt-6">
        <SubmitButton />
      </div>
    </form>
  )
}
