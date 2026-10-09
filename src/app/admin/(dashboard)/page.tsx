import Link from 'next/link'
import db from '@/db'
import { countPublishedNews, ppdbStatusLabels, ppdbStatuses } from '@/lib/queries'

export default async function AdminDashboardPage() {
  const [draftNews, teacherCount, achievementCount] = await Promise.all([
    db<{ total: number }>('news').where('is_published', 0).count<{ total: number }>('* as total').first(),
    db<{ total: number }>('teachers').count<{ total: number }>('* as total').first(),
    db<{ total: number }>('achievements').count<{ total: number }>('* as total').first(),
  ])

  const ppdbCounts: { status: string; total: number }[] = await db('ppdb_registrations')
    .select('status')
    .count<{ total: number }>('* as total')
    .groupBy('status')

  const publishedNews = await countPublishedNews()
  const draftTotal = Number(draftNews?.total ?? 0)
  const totalPpdb = ppdbCounts.reduce((sum: number, row) => sum + Number(row.total), 0)

  const cards = [
    { label: 'Berita terbit', value: publishedNews, href: '/admin/berita' },
    { label: 'Berita draf', value: draftTotal, href: '/admin/berita?status=draf' },
    { label: 'Data guru', value: Number(teacherCount?.total ?? 0), href: '/admin/guru' },
    { label: 'Data prestasi', value: Number(achievementCount?.total ?? 0), href: '/admin/prestasi' },
    { label: 'Total pendaftar PPDB', value: totalPpdb, href: '/admin/ppdb' },
  ]

  const quickActions = [
    { label: 'Tulis berita baru', href: '/admin/berita?aksi=baru' },
    { label: 'Tambah data guru', href: '/admin/guru?aksi=baru' },
    { label: 'Tambah prestasi', href: '/admin/prestasi?aksi=baru' },
    { label: 'Kelola pendaftar', href: '/admin/ppdb' },
  ]

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl">Ringkasan</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Semua konten website dan data pendaftar dikelola dari halaman ini.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-400">
            <p className="font-display text-3xl font-semibold text-brand-800">{card.value}</p>
            <p className="mt-1 text-sm text-slate-600">{card.label}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg">Status pendaftaran PPDB</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            {ppdbStatuses.map((status) => {
              const row = ppdbCounts.find((item) => item.status === status)
              return (
                <div key={status} className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <dt className="text-slate-600">{ppdbStatusLabels[status]}</dt>
                  <dd className="font-semibold text-slate-900">{Number(row?.total ?? 0)}</dd>
                </div>
              )
            })}          </dl>
          <Link href="/admin/ppdb" className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline">
            Kelola pendaftar
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg">Aksi cepat</h2>
          <ul className="mt-4 grid gap-2.5">
            {quickActions.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="block rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-800"
                >
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
