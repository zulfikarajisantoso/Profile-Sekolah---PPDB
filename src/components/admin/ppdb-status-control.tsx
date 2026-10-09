'use client'

import { useActionState, useId, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updatePpdbStatusAction } from '@/app/actions/admin'
import type { ActionState } from '@/app/actions/admin'
import { ppdbStatusLabels, ppdbStatuses } from '@/lib/ppdb'
import type { PpdbStatus, StoredDocument } from '@/lib/types'

const initialState: ActionState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
    >
      {pending ? 'Menyimpan...' : 'Perbarui status'}
    </button>
  )
}

export function PpdbStatusControl({
  registrationId,
  currentStatus,
  currentNote,
  documents,
}: {
  registrationId: number
  currentStatus: PpdbStatus
  currentNote: string
  documents: StoredDocument[]
}) {
  const [state, formAction] = useActionState(updatePpdbStatusAction, initialState)
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className="w-full max-w-xs">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        {open ? 'Tutup' : 'Ubah status'}
      </button>

      {open ? (
        <form action={formAction} className="mt-3 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <input type="hidden" name="id" value={registrationId} />

          {state.status === 'error' && state.message ? (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
              {state.message}
            </p>
          ) : null}
          {state.status === 'success' && state.message ? (
            <p role="status" className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-800">
              {state.message}
            </p>
          ) : null}

          <div>
            <label htmlFor={`${id}-status`} className="field-label">
              Status pendaftaran
            </label>
            <select id={`${id}-status`} name="status" defaultValue={currentStatus} className="field-input">
              {ppdbStatuses.map((status) => (
                <option key={status} value={status}>
                  {ppdbStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${id}-note`} className="field-label">
              Catatan panitia
            </label>
            <textarea
              id={`${id}-note`}
              name="admin_note"
              rows={2}
              maxLength={1000}
              defaultValue={currentNote}
              className="field-input resize-y"
            />
          </div>

          {documents.length > 0 ? (
            <p className="text-xs text-slate-500">{documents.length} berkas terlampir pada pendaftaran ini.</p>
          ) : null}

          <SubmitButton />
        </form>
      ) : null}
    </div>
  )
}
