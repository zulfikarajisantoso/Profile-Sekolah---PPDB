import db from '@/db'
import { getCurrentAdmin } from '@/lib/auth'
import { deletePpdbRegistrationAction } from '@/app/actions/admin'
import { PpdbStatusControl } from '@/components/admin/ppdb-status-control'
import { formatDate } from '@/components/news-card'
import { isPpdbStatus, ppdbStatusLabels, ppdbStatuses } from '@/lib/ppdb'
import type { PpdbRow } from '@/lib/types'
import { parseDocuments } from '@/lib/documents'

type SearchParams = { status?: string; q?: string }

const STATUS_STYLES: Record<string, string> = {
  baru: 'bg-slate-100 text-slate-700',
  diverifikasi: 'bg-amber-100 text-amber-900',
  diterima: 'bg-green-100 text-green-800',
  ditolak: 'bg-red-100 text-red-800',
}

export default async function AdminPpdbPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const admin = await getCurrentAdmin()

  const statusFilter = params.status && isPpdbStatus(params.status) ? params.status : undefined
  const search = (params.q ?? '').trim()

  const query = db<PpdbRow>('ppdb_registrations').select('*').orderBy('created_at', 'desc')
  if (statusFilter) query.where('status', statusFilter)
  if (search.length > 0) {
    query.andWhere((builder) => {
      builder
        .whereILike('student_name', `%${search}%`)
        .orWhereILike('parent_name', `%${search}%`)
        .orWhere('registration_number', search.toUpperCase())
        .orWhereILike('parent_phone', `%${search}%`)
    })
  }

  const rows = await query

  const exportQuery = new URLSearchParams()
  if (statusFilter) exportQuery.set('status', statusFilter)
  if (search.length > 0) exportQuery.set('q', search)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">Pendaftar PPDB</h1>
          <p className="mt-1.5 text-sm text-slate-600">{rows.length} data pendaftar ditampilkan.</p>
        </div>
        <a
          href={`/api/admin/ppdb/export${exportQuery.size > 0 ? `?${exportQuery.toString()}` : ''}`}
          className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Export CSV
        </a>
      </div>

      <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[12rem_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="filter-status" className="field-label">
            Status
          </label>
          <select id="filter-status" name="status" defaultValue={statusFilter ?? ''} className="field-input">
            <option value="">Semua status</option>
            {ppdbStatuses.map((status) => (
              <option key={status} value={status}>
                {ppdbStatusLabels[status]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-q" className="field-label">
            Pencarian
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={search}
            placeholder="Nama siswa, orang tua, nomor pendaftaran, atau telepon"
            className="field-input"
          />
        </div>
        <button type="submit" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Terapkan
        </button>
      </form>

      <div className="space-y-4">
        {rows.map((row) => {
          const documents = parseDocuments(row.documents)
          return (
            <article key={row.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-semibold text-slate-900">{row.student_name}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[row.status]}`}>
                      {ppdbStatusLabels[row.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {row.registration_number} &middot; {row.program} &middot; daftar {formatDate(row.created_at)}
                  </p>
                </div>
                <PpdbStatusControl
                  registrationId={row.id}
                  currentStatus={row.status}
                  currentNote={row.admin_note}
                  documents={documents}
                />
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-slate-500">Jenis kelamin / lahir</dt>
                  <dd className="mt-0.5 text-slate-800">
                    {row.gender === 'L' ? 'Laki-laki' : 'Perempuan'}, {row.birth_place}, {formatDate(row.birth_date)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Agama</dt>
                  <dd className="mt-0.5 text-slate-800">{row.religion}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">NISN</dt>
                  <dd className="mt-0.5 text-slate-800">{row.student_nisn || '-'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Asal sekolah</dt>
                  <dd className="mt-0.5 text-slate-800">{row.origin_school || '-'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Alamat</dt>
                  <dd className="mt-0.5 text-slate-800">
                    {row.address}
                    {row.village ? `, ${row.village}` : ''}
                    {row.district ? `, ${row.district}` : ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Orang tua / wali</dt>
                  <dd className="mt-0.5 text-slate-800">{row.parent_name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Telepon</dt>
                  <dd className="mt-0.5 text-slate-800">{row.parent_phone}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Email</dt>
                  <dd className="mt-0.5 break-all text-slate-800">{row.parent_email || '-'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Pekerjaan orang tua</dt>
                  <dd className="mt-0.5 text-slate-800">{row.parent_job || '-'}</dd>
                </div>
              </dl>

              {row.note ? (
                <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="font-semibold">Catatan pendaftar: </span>
                  {row.note}
                </p>
              ) : null}

              {documents.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dokumen terlampir</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {documents.map((document) => (
                      <li key={document.storedAs}>
                        <a
                          href={document.storedAs}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-slate-50"
                        >
                          {document.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <form action={deletePpdbRegistrationAction} className="mt-4 border-t border-slate-100 pt-4">
                <input type="hidden" name="id" value={row.id} />
                <button
                  type="submit"
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Hapus data pendaftar
                </button>
              </form>
            </article>
          )
        })}

        {rows.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
            Tidak ada data pendaftar yang cocok dengan filter.
          </p>
        ) : null}
      </div>

      <p className="text-xs text-slate-500">
        Masuk sebagai {admin?.username}. Penghapusan data pendaftar tidak dapat dibatalkan.
      </p>
    </div>
  )
}
