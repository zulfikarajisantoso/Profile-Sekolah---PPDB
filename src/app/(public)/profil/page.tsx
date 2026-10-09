import type { Metadata } from 'next'
import { PageHero, SectionHeading } from '@/components/ui'
import { siteConfig } from '@/lib/site-config'
import { getAchievementYears } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Profil Sekolah: Sejarah, Visi, dan Misi',
  description: `Sejarah, visi, misi, nilai, dan legalitas ${siteConfig.name}. Informasi resmi profil sekolah termasuk NPSN dan status akreditasi.`,
  alternates: { canonical: '/profil' },
  openGraph: {
    title: `Profil ${siteConfig.name}`,
    description: 'Sejarah, visi, misi, nilai, dan legalitas sekolah.',
    url: '/profil',
  },
}

const timeline = [
  {
    year: '1998',
    title: 'Berdiri sebagai sekolah negeri',
    body: 'Berdiri dengan 3 ruang kelas dan 120 siswa, berpusat di lingkungan Cibaduyut, Bandung.',
  },
  {
    year: '2006',
    title: 'Perluasan facility dan perpustakaan',
    body: 'Dilengkapi laboratorium komputer, laboratorium IPA, serta perpustakaan dengan koleksi 4.000 buku.',
  },
  {
    year: '2013',
    title: 'Akreditasi A dan Recognizingcreativecommons',
    body: 'Mendapatkan akreditasi A dari lembaga penilaian eksternal serta resmi meluncurkan program kelas aksara.',
  },
  {
    year: '2019',
    title: 'Digitalisasi manajemen sekolah',
    body: 'Data siswa, presensi, dan rapor mulai dikelola dengan sistem digital. Website sekolah resmi diperbarui.',
  },
  {
    year: '2024',
    title: 'Kelas Aksara dan program minat',
    body: 'Memperkenalkan kelas minat bahasa dan seni. Pembelajaran berbasis proyek dimulai di kelas 9.',
  },
]

const values = [
  {
    title: 'Ketakwaan',
    body: 'Kegiatan harian dimulai dengan pembiasaan ibadah. Akhlak baik menjadi kompas belajar.',
  },
  {
    title: 'Ilmu',
    body: 'Penguasaan kompetensi dinilai dan dievaluasi secara berkelanjutan, bukan sekadar hafalan.',
  },
  {
    title: 'Kreativitas',
    body: 'Setiapcabang mata pelajaran memiliki ruang untuk proyek, karya, dan eksperimen mandiri.',
  },
  {
    title: 'Persaudaraan',
    body: 'Kami membangun budaya saling menghargai agar setiap siswa merasa diterima dan aman.',
  },
]

export default async function ProfilePage() {
  const years = await getAchievementYears()

  return (
    <>
      <PageHero
        eyebrow="Tentang kami"
        title={`Profil ${siteConfig.name}`}
        description="Sekolah menengah pertama negeri yang menekankan pendidikan karakter, akademik, dan keterampilan abad ke-21."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Profil Sekolah' }]}
      />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <SectionHeading eyebrow="Sejarah" title="Perjalanan sekolah" />

          <ol className="mt-8 space-y-8 border-l-2 border-brand-100 pl-6">
            {timeline.map((item) => (
              <li key={item.year} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-600"
                />
                <p className="font-display text-sm font-semibold text-brand-800">{item.year}</p>
                <h3 className="mt-1 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg">Legalitas &amp; akreditasi</h2>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              {[
                ['NPSN', siteConfig.npsn],
                ['Status akreditasi', siteConfig.accreditation],
                ['Izin operasional', '421.2/0234/VI/2019'],
                ['Tahun berdiri', '1998'],
                ['Jenjang', 'SMP (kelas 7, 8, 9)'],
                ['Kurikulum', 'Kurikulum Merdeka'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-semibold text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="text-lg">Kontak sekolah</h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-slate-600">
              <p>{siteConfig.address}</p>
              <p>
                Telepon:{' '}
                <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="font-medium text-brand-700 hover:underline">
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                Email:{' '}
                <a href={`mailto:${siteConfig.email}`} className="font-medium text-brand-700 hover:underline">
                  {siteConfig.email}
                </a>
              </p>
              <p>Jam layanan: Senin-Sabtu, 07.00-14.00 WIB</p>
            </address>
          </div>

          <div className="card bg-brand-800 p-6 text-brand-100">
            <h2 className="font-display text-lg font-semibold text-white">Tertarik mendaftar?</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-brand-100">
              Informasi syarat, jadwal, dan biaya pendaftaran tersedia lengkap di halaman PPDB.
            </p>
            <a href="/ppdb" className="btn-accent mt-5 w-full">
              Lihat informasi PPDB
            </a>
          </div>
        </aside>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Arah sekolah"
            title="Visi, misi, dan nilai"
            description="Visi dan misi menjadi rujukan dalam menyusun program harian, pekanan, maupun tahunan sekolah."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card bg-brand-800 p-7 text-brand-100">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Visi</p>
              <p className="mt-4 font-display text-xl leading-relaxed text-white">
                Menjadi sekolah rujukan nasional yang mencetak lulusan berkarakter, berkarya, dan berdaya saing global.
              </p>
            </div>
            <div className="card p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">Misi</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                <li>Menyelenggarakan pembelajaran aktif yang relevan dengan perkembangan zaman.</li>
                <li>Menanamkan nilai keimanan, ketakwaan, dan akhlak mulia dalam keseharian.</li>
                <li>Mengembangkan literasi, numerasi, dan literasi digital sejak kelas 7.</li>
                <li>Membangun lingkungan sekolah yang aman, inklusif, dan ramah anak.</li>
                <li>Menjalin kerja sama dengan orang tua dan komunitas sekitar.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="card p-6">
                <h3 className="text-lg">{value.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading eyebrow="Rekam jejak" title="Tahun dengan prestasi" />
        <ul className="mt-8 flex flex-wrap gap-3">
          {years.map((year) => (
            <li
              key={year}
              className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800"
            >
              {year}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-slate-600">
          Daftar prestasi lengkap tersedia di halaman{' '}
          <a href="/prestasi" className="font-semibold text-brand-700 hover:underline">
            prestasi sekolah
          </a>
          .
        </p>
      </section>
    </>
  )
}
