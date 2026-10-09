import type { Metadata } from 'next'
import { PageHero, SectionHeading } from '@/components/ui'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Fasilitas Sekolah',
  description: `Daftar fasilitas ${siteConfig.name}: laboratorium IPA, laboratorium komputer, perpustakaan, lapangan olahraga, ruang konseling, dan kantin sehat.`,
  alternates: { canonical: '/fasilitas' },
  openGraph: { title: `Fasilitas ${siteConfig.name}`, description: 'Fasilitas pendukung belajar di sekolah.', url: '/fasilitas' },
}

const facilities = [
  {
    name: 'Laboratorium IPA',
    description: 'Microskop, tabung gas, dan set praktikum biologi serta fisika untuk pembelajaran berbasis praktik.',
    capacity: '2 kelas praktikum',
  },
  {
    name: 'Laboratorium Komputer',
    description: '40 unit komputer dengan koneksi internet dan perangkat lunak praktik yang dipakai untuk mata pelajaran TIK.',
    capacity: '40 komputer',
  },
  {
    name: 'Perpustakaan',
    description: 'Koleksi 4.200 buku, pojok baca, dan katalog digital untuk peminjaman mandiri.',
    capacity: '80 tempat duduk',
  },
  {
    name: 'Lapangan Olahraga',
    description: 'Lapangan serbaguna untuk futsal, basket, dan voli. Tersedia area pemanasan untuk latihan atlet.',
    capacity: '1 lapangan',
  },
  {
    name: 'Ruang Musik & Seni Rupa',
    description: 'Alat musik ansambel dan meja lukis untuk kegiatan seni budaya sekolah.',
    capacity: '1 studio',
  },
  {
    name: 'Masjid Sekolah',
    description: 'Tempat ibadah siswa, guru, serta kegiatan keagamaan rutin sekolah.',
    capacity: '200 tempat duduk',
  },
  {
    name: 'UKS & Ruang Konseling',
    description: 'Ruang kesehatan sekolah dan ruang konseling untuk mendampingi siswa.',
    capacity: '2 ruang',
  },
  {
    name: 'Kantin Sehat',
    description: 'Kantin dengan menu bergizi dan harga terjangkau, dikelola bersama orang tua.',
    capacity: '60 tempat duduk',
  },
]

export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Sarana belajar"
        title="Fasilitas pendukung kegiatan belajar"
        description="Semua fasilitas berada dalam satu area sekolah dan dapat diakses pada jam pelajaran maupun kegiatan ekstrakurikuler."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Fasilitas' }]}
      />

      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Daftar fasilitas"
          title="Delapan fasilitas utama sekolah"
          description="Fasilitas diperbarui berkala melalui panel admin sekolah."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => (
            <article key={facility.name} className="card overflow-hidden">
              <img
                src={`/fasilitas-${facility.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`}
                alt={`${facility.name} di ${siteConfig.name}`}
                width={640}
                height={360}
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg">{facility.name}</h3>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {facility.capacity}
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{facility.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl">Ingin melihat fasilitasnya secara langsung?</h2>
            <p className="mt-2.5 text-sm text-slate-600">
              Sekolah membuka kunjungan pada hari Sabtu. Silakan hubungi TU sekolah untuk menjadwalkan kunjungan.
            </p>
          </div>
          <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="btn-primary shrink-0">
            Hubungi sekolah
          </a>
        </div>
      </section>
    </>
  )
}
