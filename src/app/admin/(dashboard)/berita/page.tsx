import Link from 'next/link'
import db from '@/db'
import { getCurrentAdmin } from '@/lib/auth'
import { deleteNewsAction, toggleNewsPublishedAction } from '@/app/actions/content'
import { NewsForm } from '@/components/admin/news-form'
import { formatDate } from '@/components/news-card'
import type { NewsRow } from '@/lib/queries'

type SearchParams = { aksi?: string; id?: string; sukses?: string }

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const admin = await getCurrentAdmin()

  const items = await db<NewsRow>('news').select('*').orderBy('published_at', 'desc').orderBy('id', 'desc')
  const editId = params.aksi === 'edit' ? Number(params.id ?? 0) : 0
  const editing = editId > 0 ? (items.find((item) => item.id === editId) ?? null) : null
  const openForm = params.aksi === 'baru' || params.aksi === 'edit'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">Berita & pengumuman</h1>
          <p className="mt-1.5 text-sm text-slate-600">Total {items.length} berita tersimpan.</p>
        </div>
        <Link href="/berita" className="text-sm font-semibold text-brand-700 hover:underline">
          Lihat halaman publik
        </Link>
      </div>

      {params.sukses ? (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {params.sukses}
        </p>
      ) : null}

      <NewsForm item={editing} defaultOpen={openForm} key={editing?.id ?? 'baru'} />

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="admin-table">
          <caption className="sr-only">Daftar berita</caption>
          <thead>
            <tr>
              <th scope="col">Judul</th>
              <th scope="col">Kategori</th>
              <th scope="col">Status</th>
              <th scope="col">Terbit</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="font-medium text-slate-900">{item.title}</span>
                  <span className="block text-xs text-slate-500">/berita/{item.slug}</span>
                </td>
                <td className="whitespace-nowrap">{item.category === 'pengumuman' ? 'Pengumuman' : 'Berita'}</td>
                <td className="whitespace-nowrap">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.is_published ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.is_published ? 'Terbit' : 'Draf'}
                  </span>
                </td>
                <td className="whitespace-nowrap text-slate-600">{formatDate(item.published_at)}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/berita?aksi=edit&id=${item.id}`}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Ubah
                    </Link>
                    <form action={toggleNewsPublishedAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {item.is_published ? 'Jadikan draf' : 'Terbitkan'}
                      </button>
                    </form>
                    <form action={deleteNewsAction} className="inline-flex items-center">
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

      <p className="text-xs text-slate-500">
        Masuk sebagai {admin?.username}. Perubahan langsung tampil di website publik.
      </p>
    </div>
  )
}
