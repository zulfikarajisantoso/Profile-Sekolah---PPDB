import Link from 'next/link'
import { getFeaturedNews, getTeachers, getAchievements } from '@/lib/queries'
import { ppdbConfig, siteConfig } from '@/lib/site-config'
import { NewsCard } from '@/components/news-card'
import { SectionHeading, StatCard } from '@/components/ui'

export default async function HomePage() {
  const [news, teachers, achievements] = await Promise.all([getFeaturedNews(3), getTeachers(), getAchievements()])

  const stats = [
    { value: `${teachers.length}+`, label: 'Guru dan tenaga pendidik' },
    { value: `${achievements.length}`, label: 'Prestasi tercatat' },
    { value: '480', label: 'Siswa aktif' },
    { value: 'A', label: 'Akreditasi sekolah' },
  ]

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="eyebrow">PPDB Tahun Ajaran {ppdbConfig.year} Telah Dibuka</p>
            <h1 className="mt-4 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
              Sekolah yang membangun <span className="text-brand-700">karakter, ilmu,</span> dan kreativitas.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">{siteConfig.tagline}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ppdb/daftar" className="btn-accent">
                Daftar Murid Baru
              </Link>
              <Link href="/profil" className="btn-outline">
                Pelajari sekolah kami
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-semibold text-brand-800">{stat.value}</span>
                    <span className="mt-1 block text-xs leading-snug text-slate-500">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src="/hero-gedung.svg"
              alt="Gedung sekolah SMP Nusantara Bandung dengan halaman depan dan taman sekolah"
              width={640}
              height={720}
              className="w-full rounded-2xl border border-slate-200 shadow-lift"
            />
            <div className="grid gap-4">
              <img
                src="/hero-kelas.svg"
                alt="Suasana pembelajaran di kelas bersama guru dan siswa"
                width={640}
                height={360}
                className="w-full rounded-2xl border border-slate-200 shadow-soft"
              />
              <img
                src="/hero-perpustakaan.svg"
                alt="Perpustakaan sekolah dengan koleksi buku dan ruang baca"
                width={640}
                height={360}
                className="w-full rounded-2xl border border-slate-200 shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Kenapa memilih kami"
          title="Pendidikan yang utuh: akademik, karakter, dan keterampilan"
          description="Kurikulum nasional diperkaya dengan pembelajaran berbasis proyek, penguatan literasi, serta pendampingan konseling untuk setiap siswa."
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Kelas kecil',
              body: 'Rata-rata 24 siswa per kelas agar guru dapat mendampingi setiap siswa secara personal.',
            },
            {
              title: 'Asesmen bukan peringkat',
              body: 'Penilaian berbasis kompetensi dengan umpan balik berkala, bukan sekadar peringkat kelas.',
            },
            {
              title: 'Program minat',
              body: 'Pilihan bidang studi eksploratif dari kelas 7: sains, sosial, bahasa, seni, dan teknologi.',
            },
            {
              title: 'Dukungan belajar',
              body: 'Konseling sekolah dan bimbingan belajar untuk memastikan setiap siswa berkembang optimal.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <h3 className="text-lg">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Informasi resmi"
            title="Profil singkat sekolah"
            action={
              <Link href="/profil" className="btn-ghost btn-sm">
                Halaman profil lengkap
              </Link>
            }
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Visi</h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-slate-700">
                Menjadi sekolah rujukan nasional yang mencetak lulusan berkarakter, berkarya, dan berdaya saing global.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Misi</h3>
              <ul className="mt-3 space-y-2.5 text-[0.975rem] leading-relaxed text-slate-700">
                <li>Menyelenggarakan pembelajaran aktif yang relevan dengan perkembangan zaman.</li>
                <li>Menanamkan nilai keimanan, ketakwaan, dan akhlak mulia dalam keseharian.</li>
                <li>Mengembangkan literasi, numerasi, dan literasi digital sejak kelas 7.</li>
                <li>Membangun lingkungan sekolah yang aman, inklusif, dan ramah anak.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Legalitas</h3>
              <dl className="mt-3 space-y-2.5 text-sm text-slate-700">
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2.5">
                  <dt className="text-slate-500">NPSN</dt>
                  <dd className="font-semibold">{siteConfig.npsn}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2.5">
                  <dt className="text-slate-500">Izin operasional</dt>
                  <dd className="font-semibold">421.2/0234/VI/2019</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2.5">
                  <dt className="text-slate-500">Akreditasi</dt>
                  <dd className="font-semibold">{siteConfig.accreditation}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Tahun berdiri</dt>
                  <dd className="font-semibold">1998</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Penerimaan murid baru"
          title={`PPDB Tahun Ajaran ${ppdbConfig.year}`}
          description="Pendaftaran dilakukan sepenuhnya online. Isi formulir, unggah dokumen, dan dapatkan nomor pendaftaran Anda dalam beberapa menit."
          action={
            <Link href="/ppdb" className="btn-outline btn-sm">
              Detail PPDB
            </Link>
          }
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card divide-y divide-slate-100">
            {ppdbConfig.schedules.map((schedule) => (
              <div key={schedule.wave} className="flex flex-wrap items-baseline justify-between gap-3 px-6 py-5">
                <div>
                  <p className="font-display text-base font-semibold text-slate-900">{schedule.wave}</p>
                  <p className="mt-1 text-sm text-slate-600">{schedule.note}</p>
                </div>
                <p className="text-sm font-medium text-brand-800">{schedule.period}</p>
              </div>
            ))}
            <div className="flex flex-wrap items-baseline justify-between gap-3 px-6 py-5">
              <div>
                <p className="font-display text-base font-semibold text-slate-900">Total kuota</p>
                <p className="mt-1 text-sm text-slate-600">Kelas 1, 4, dan 5</p>
              </div>
              <p className="text-sm font-medium text-brand-800">
                {ppdbConfig.quotas.reduce((total, item) => total + item.slots, 0)} kursi
              </p>
            </div>
          </div>

          <div className="card flex flex-col justify-between gap-6 bg-brand-800 p-6 text-brand-50">
            <div>
              <h3 className="font-display text-xl font-semibold text-white">Siap mendaftar?</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-brand-100">
                Pengisian formulir memakan waktu sekitar 5 menit. Siapkan data calon siswa, data orang tua, dan scan
                dokumen (KK serta akta kelahiran).
              </p>
            </div>
            <Link href="/ppdb/daftar" className="btn-accent w-full">
              Mulai pengisian formulir
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Kabar terbaru"
            title="Berita & pengumuman sekolah"
            action={
              <Link href="/berita" className="btn-ghost btn-sm">
                Semua berita
              </Link>
            }
          />

          {news.length === 0 ? (
            <p className="mt-8 text-sm text-slate-600">Belum ada berita yang dipublikasikan.</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard value={siteConfig.accreditation} label="Status akreditasi sekolah" />
            <StatCard value={`${ppdbConfig.quotas.length} jenjang`} label="Kelas yang dibuka pada PPDB" />
            <StatCard value="15 Jan 2027" label="Batas akhir pendaftaran gelombang 2" />
            <StatCard value="Gratis" label="Biaya pendaftaran online" />
          </div>
        </div>
      </section>
    </>
  )
}
