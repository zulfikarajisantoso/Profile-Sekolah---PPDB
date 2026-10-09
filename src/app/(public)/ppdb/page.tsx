import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, SectionHeading } from '@/components/ui'
import { ppdbConfig, siteConfig } from '@/lib/site-config'
import { formatRupiah } from '@/components/news-card'

export const metadata: Metadata = {
  title: `PPDB ${ppdbConfig.year} - Syarat, Jadwal, dan Biaya`,
  description: `Informasi lengkap PPDB ${siteConfig.name} ${ppdbConfig.year}: syarat pendaftaran, jadwal gelombang, kuota kelas, biaya, dan langkah pendaftaran online.`,
  alternates: { canonical: '/ppdb' },
  openGraph: {
    title: `PPDB ${siteConfig.name} ${ppdbConfig.year}`,
    description: 'Syarat, jadwal, kuota, dan biaya pendaftaran murid baru.',
    url: '/ppdb',
  },
}

export default function PpdbInfoPage() {
  return (
    <>
      <PageHero
        eyebrow={`Pendaftaran Murid Baru ${ppdbConfig.year}`}
        title="Informasi PPDB"
        description="Seluruh proses pendaftaran dilakukan online. Tidak ada berkas kertas yang perlu diserahkan di awal, dan pendaftaran tidak dipungut biaya."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'PPDB' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/ppdb/daftar" className="btn-accent">
            Isi formulir pendaftaran
          </Link>
          <Link href="/ppdb/cek" className="btn-outline">
            Cek status pendaftaran
          </Link>
        </div>
      </PageHero>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Langkah pendaftaran"
          title="Lima langkah mudah mendaftar"
          description="Calon orang tua dapat menyelesaikan pendaftaran tanpa perlu datang ke sekolah."
        />

        <ol className="mt-8 grid gap-5 md:grid-cols-5">
          {[
            { title: 'Pelajari profil', body: 'Baca profil, fasilitas, dan prestasi sekolah.' },
            { title: 'Cek syarat', body: 'Pastikan dokumen dan data calon siswa siap.' },
            { title: 'Isi formulir', body: 'Lengkapi data siswa, orang tua, dan unggah dokumen.' },
            { title: 'Simpan nomor', body: 'Nomor pendaftaran tampil setelah formulir tersimpan.' },
            { title: 'Verifikasi', body: 'Panitia PPDB memverifikasi berkas dan mengabari hasilnya.' },
          ].map((step, index) => (
            <li key={step.title} className="card p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 font-display text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3 text-base">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Syarat" title="Syarat pendaftaran" />

          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {ppdbConfig.requirements.map((requirement) => (
              <li key={requirement} className="card flex gap-3 p-4">
                <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm leading-relaxed text-slate-700">{requirement}</span>
              </li>
            ))}
          </ul>

          <div className="mt-14">
            <SectionHeading eyebrow="Jadwal & kuota" title="Jadwal pendaftaran dan kuota kursi" />
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <caption className="sr-only">Jadwal PPDB Tahun Ajaran {ppdbConfig.year}</caption>
                <thead>
                  <tr className="border-b border-slate-300 text-left">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-800">
                      Gelombang
                    </th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-800">
                      Periode
                    </th>
                    <th scope="col" className="py-3 font-semibold text-slate-800">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ppdbConfig.schedules.map((schedule) => (
                    <tr key={schedule.wave}>
                      <th scope="row" className="py-3 pr-4 text-left font-medium text-slate-900">
                        {schedule.wave}
                      </th>
                      <td className="py-3 pr-4 text-slate-700">{schedule.period}</td>
                      <td className="py-3 text-slate-600">{schedule.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {ppdbConfig.quotas.map((quota) => (
                <li key={quota.grade} className="card px-5 py-4">
                  <p className="font-display text-lg font-semibold text-brand-800">{quota.slots} kursi</p>
                  <p className="mt-1 text-sm text-slate-600">{quota.grade}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Biaya" title="Rincian biaya sekolah" />
            <p className="mt-3 text-sm text-slate-600">
              Biaya di bawah ini berlaku untuk tahun ajaran {ppdbConfig.year} dan dapat berubah pada tahun ajaran
              berikutnya. Pendaftaran online tidak dipungut biaya.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-sm">
                <caption className="sr-only">Rincian biaya sekolah</caption>
                <thead>
                  <tr className="border-b border-slate-300 text-left">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-800">
                      Komponen
                    </th>
                    <th scope="col" className="py-3 pr-4 text-right font-semibold text-slate-800">
                      Jumlah
                    </th>
                    <th scope="col" className="py-3 font-semibold text-slate-800">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ppdbConfig.fees.map((fee) => (
                    <tr key={fee.label}>
                      <th scope="row" className="py-3 pr-4 text-left font-medium text-slate-900">
                        {fee.label}
                      </th>
                      <td className="py-3 pr-4 text-right font-semibold text-brand-800">{formatRupiah(fee.amount)}</td>
                      <td className="py-3 text-slate-600">{fee.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="card p-6">
              <h2 className="text-lg">Program kelas</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
                {ppdbConfig.programs.map((program) => (
                  <li key={program} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                    {program}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="text-lg">Bantuan sosial</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                Siswa dari keluarga kurang mampu dapat mengajukan keringanan biaya. Pengajuan dilakukan bersamaan dengan
                pendaftaran dan diverifikasi panitia PPDB.
              </p>
            </div>

            <div className="card bg-brand-800 p-6 text-brand-100">
              <h2 className="font-display text-lg font-semibold text-white">Butuh penjelasan?</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-brand-100">
                Panitia PPDB siap membantu pada hari Senin sampai Jumat, pukul 08.00 sampai 15.00 WIB.
              </p>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="btn-accent mt-5 w-full">
                {siteConfig.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
