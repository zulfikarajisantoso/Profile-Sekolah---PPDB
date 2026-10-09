import Link from 'next/link'
import db from '@/db'
import { deleteTeacherAction } from '@/app/actions/content'
import { TeacherForm } from '@/components/admin/teacher-form'
import type { TeacherRow } from '@/lib/queries'

type SearchParams = { aksi?: string; id?: string; sukses?: string }

export default async function AdminTeachersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const teachers = await db<TeacherRow>('teachers').select('*').orderBy('sort_order', 'asc').orderBy('name', 'asc')
  const subjects = Array.from(new Set(teachers.map((teacher) => teacher.subject).filter(Boolean)))

  const editId = params.aksi === 'edit' ? Number(params.id ?? 0) : 0
  const editing = editId > 0 ? (teachers.find((item) => item.id === editId) ?? null) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">Data guru</h1>
          <p className="mt-1.5 text-sm text-slate-600">Total {teachers.length} orang.</p>
        </div>
        <Link href="/guru" className="text-sm font-semibold text-brand-700 hover:underline">
          Lihat halaman publik
        </Link>
      </div>

      {params.sukses ? (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {params.sukses}
        </p>
      ) : null}

      <TeacherForm
        item={editing}
        subjects={subjects}
        defaultOpen={params.aksi === 'baru' || params.aksi === 'edit'}
        key={editing?.id ?? 'baru'}
      />

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="admin-table">
          <caption className="sr-only">Daftar data guru</caption>
          <thead>
            <tr>
              <th scope="col">Nama</th>
              <th scope="col">Mata pelajaran</th>
              <th scope="col">Jabatan</th>
              <th scope="col">Status</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="font-medium text-slate-900">{teacher.name}</td>
                <td>{teacher.subject}</td>
                <td className="text-slate-600">{teacher.position || '-'}</td>
                <td className="whitespace-nowrap">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      teacher.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {teacher.is_active ? 'Tampil' : 'Disembunyikan'}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/guru?aksi=edit&id=${teacher.id}`}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Ubah
                    </Link>
                    <form action={deleteTeacherAction}>
                      <input type="hidden" name="id" value={teacher.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
