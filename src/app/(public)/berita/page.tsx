import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, EmptyState } from '@/components/ui'
import { NewsCard } from '@/components/news-card'
import { countPublishedNews, getPublishedNews, PAGE_SIZE } from '@/lib/queries'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Berita & Pengumuman',
  description: `Kabar terbaru, pengumuman, dan kegiatan ${siteConfig.name}. Kanal resmi informasi sekolah untuk siswa, orang tua, dan masyarakat.`,
  alternates: { canonical: '/berita' },
  openGraph: { title: `Berita ${siteConfig.name}`, description: 'Berita dan pengumuman resmi sekolah.', url: '/berita' },
}

export default async function NewsIndexPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const currentPage = Math.max(1, Number(page) || 1)
  const total = await countPublishedNews()
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const safePage = Math.min(currentPage, totalPages)
  const items = await getPublishedNews(PAGE_SIZE, (safePage - 1) * PAGE_SIZE)

  return (
    <>
      <PageHero
        eyebrow="Informasi resmi"
        title="Berita & pengumuman"
        description="Semua pengumuman resmi sekolah diterbitkan di halaman ini."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Berita' }]}
      />

      <section className="container-page py-16 lg:py-20">
        {items.length === 0 ? (
          <EmptyState
            title="Belum ada berita"
            description="Berita akan tampil setelah diterbitkan melalui panel admin sekolah."
          />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav aria-label="Navigasi halaman" className="mt-12 flex items-center justify-center gap-2">
                {safePage > 1 ? (
                  <Link href={`/berita?page=${safePage - 1}`} className="btn-ghost btn-sm" rel="prev">
                    Sebelumnya
                  </Link>
                ) : null}
                <span className="px-3 text-sm text-slate-600">
                  Halaman {safePage} dari {totalPages}
                </span>
                {safePage < totalPages ? (
                  <Link href={`/berita?page=${safePage + 1}`} className="btn-ghost btn-sm" rel="next">
                    Berikutnya
                  </Link>
                ) : null}
              </nav>
            ) : null}

            <div className="mt-12 rounded-xl border border-brand-200 bg-brand-50 p-6">
              <h2 className="text-lg">Ingin mempublikasikan berita sekolah?</h2>
              <p className="mt-2 text-sm text-slate-600">
                Guru dan tenaga kependidikan dapat mempublikasikan berita melalui panel admin sekolah. Hubungi tata usaha
                untuk memperoleh akses akun editor.
              </p>
            </div>
          </>
        )}
      </section>
    </>
  )
}
