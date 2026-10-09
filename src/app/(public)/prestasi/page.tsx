import type { Metadata } from 'next'
import { PageHero, EmptyState, SectionHeading } from '@/components/ui'
import { getAchievements } from '@/lib/queries'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Prestasi Sekolah',
  description: `Daftar prestasi ${siteConfig.name} pada tingkat sekolah, kabupaten, provinsi, dan nasional lengkap dengan tahun dan tingkat.`,
  alternates: { canonical: '/prestasi' },
  openGraph: { title: `Prestasi ${siteConfig.name}`, description: 'Daftar prestasi sekolah dan siswa.', url: '/prestasi' },
}

const levelOrder = ['Nasional', 'Provinsi', 'Kabupaten', 'Sekolah']

const levelStyles: Record<string, string> = {
  Nasional: 'bg-amber-100 text-amber-900 border-amber-200',
  Provinsi: 'bg-brand-100 text-brand-900 border-brand-200',
  Kabupaten: 'bg-slate-100 text-slate-700 border-slate-200',
  Sekolah: 'bg-slate-50 text-slate-600 border-slate-200',
}

export default async function AchievementsPage() {
  const achievements = await getAchievements()

  const counts = levelOrder
    .map((level) => ({ level, total: achievements.filter((item) => item.level === level).length }))
    .filter((item) => item.total > 0)

  return (
    <>
      <PageHero
        eyebrow="Rekam jejak"
        title="Prestasi sekolah dan siswa"
        description="Prestasi dicatat sejak tahun 2023 dan dapat ditambah setiap tahun melalui panel admin sekolah."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Prestasi' }]}
      />

      <section className="container-page py-16 lg:py-20">
        {achievements.length === 0 ? (
          <EmptyState
            title="Belum ada data prestasi"
            description="Data prestasi akan tampil setelah ditambahkan melalui panel admin."
          />
        ) : (
          <>
            {counts.length > 0 ? (
              <div className="mb-10 flex flex-wrap gap-3">
                {counts.map((item) => (
                  <span
                    key={item.level}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${levelStyles[item.level] ?? levelStyles.Sekolah}`}
                  >
                    {item.level}: {item.total} prestasi
                  </span>
                ))}
              </div>
            ) : null}

            <SectionHeading eyebrow="Daftar lengkap" title="Prestasi menurut tahun" />

            <ul className="mt-8 space-y-4">
              {achievements.map((item) => (
                <li key={item.id} className="card flex flex-col gap-5 p-5 sm:flex-row">
                  <img
                    src={item.image ?? '/placeholder.svg'}
                    alt={`Piagam prestasi: ${item.title}`}
                    width={640}
                    height={480}
                    loading="lazy"
                    className="h-36 w-full shrink-0 rounded-lg object-cover sm:w-48"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${levelStyles[item.level] ?? levelStyles.Sekolah}`}
                      >
                        {item.level}
                      </span>
                      <span className="font-display text-sm font-semibold text-brand-800">{item.year}</span>
                    </div>
                    <h3 className="mt-2.5 text-lg leading-snug">{item.title}</h3>
                    {item.holder ? <p className="mt-1.5 text-sm text-slate-600">Pemenang: {item.holder}</p> : null}
                    {item.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  )
}
