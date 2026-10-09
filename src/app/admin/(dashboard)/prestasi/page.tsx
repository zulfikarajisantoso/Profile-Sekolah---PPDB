import Link from 'next/link'
import db from '@/db'
import { deleteAchievementAction } from '@/app/actions/content'
import { AchievementForm } from '@/components/admin/achievement-form'
import type { AchievementRow } from '@/lib/queries'

type SearchParams = { aksi?: string; id?: string; sukses?: string }

export default async function AdminAchievementsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const items = await db<AchievementRow>('achievements').select('*').orderBy('year', 'desc').orderBy('sort_order', 'asc')

  const editId = params.aksi === 'edit' ? Number(params.id ?? 0) : 0
  const editing = editId > 0 ? (items.find((item) => item.id === editId) ?? null) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">Prestasi</h1>
          <p className="mt-1.5 text-sm text-slate-600">Total {items.length} prestasi tercatat.</p>
        </div>
        <Link href="/prestasi" className="text-sm font-semibold text-brand-700 hover:underline">
          Lihat halaman publik
        </Link>
      </div>

      {params.sukses ? (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {params.sukses}
        </p>
      ) : null}

      <AchievementForm
        item={editing}
        defaultOpen={params.aksi === 'baru' || params.aksi === 'edit'}
        key={editing?.id ?? 'baru'}
      />

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="admin-table">
          <caption className="sr-only">Daftar prestasi</caption>
          <thead>
            <tr>
              <th scope="col">Nama prestasi</th>
              <th scope="col">Tingkat</th>
              <th scope="col">Tahun</th>
              <th scope="col">Pemenang</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="font-medium text-slate-900">{item.title}</td>
                <td className="whitespace-nowrap">{item.level}</td>
                <td className="whitespace-nowrap">{item.year}</td>
                <td className="text-slate-600">{item.holder || '-'}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/prestasi?aksi=edit&id=${item.id}`}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Ubah
                    </Link>
                    <form action={deleteAchievementAction}>
                      <input type="hidden" name="id" value={item.id} />
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
