import type { Metadata } from 'next'
import { PageHero } from '@/components/ui'
import { PpdbForm } from '@/components/ppdb-form'
import { ppdbConfig, siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `Formulir Pendaftaran ${ppdbConfig.year}`,
  description: `Formulir pendaftaran murid baru ${siteConfig.name} secara online. Isi data calon siswa, data orang tua, dan unggah dokumen pendukung.`,
  alternates: { canonical: '/ppdb/daftar' },
  robots: { index: true, follow: true },
}

export default function PpdbRegisterPage() {
  return (
    <>
      <PageHero
        eyebrow={`PPDB ${ppdbConfig.year}`}
        title="Formulir pendaftaran murid baru"
        description="Isi data dengan lengkap dan benar. Pendaftaran online tidak dipungut biaya. Batas akhir pendaftaran: 15 Januari 2027."
        breadcrumb={[
          { label: 'Beranda', href: '/' },
          { label: 'PPDB', href: '/ppdb' },
          { label: 'Formulir' },
        ]}
      />

      <section className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <PpdbForm />

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <h2 className="text-base">Sebelum mengisi</h2>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                <li>Pastikan akta kelahiran dan kartu keluarga sudah disiapkan.</li>
                <li>Gunakan nomor telepon yang aktif dan mudah dihubungi.</li>
                <li>Simpan nomor pendaftaran setelah formulir terkirim.</li>
              </ul>
            </div>

            <div className="card p-5">
              <h2 className="text-base">Butuh bantuan?</h2>
              <p className="mt-2.5 text-sm text-slate-600">
                Hotline PPDB tersedia pada hari kerja, pukul 08.00 sampai 15.00 WIB.
              </p>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="mt-4 block text-sm font-semibold text-brand-700 hover:underline">
                {siteConfig.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
