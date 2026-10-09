import type { Metadata } from 'next'
import { PageHero } from '@/components/ui'
import { RegistrationStatusChecker } from '@/components/registration-status-checker'
import { ppdbConfig, siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Cek Status Pendaftaran',
  description: `Cek status pendaftaran PPDB ${siteConfig.name} menggunakan nomor pendaftaran yang diterima setelah mengisi formulir.`,
  alternates: { canonical: '/ppdb/cek' },
  robots: { index: true, follow: true },
}

export default function PpdbCheckPage() {
  return (
    <>
      <PageHero
        eyebrow={`PPDB ${ppdbConfig.year}`}
        title="Cek status pendaftaran"
        description="Masukkan nomor pendaftaran untuk melihat status proses seleksi calon siswa."
        breadcrumb={[
          { label: 'Beranda', href: '/' },
          { label: 'PPDB', href: '/ppdb' },
          { label: 'Cek status' },
        ]}
      />

      <section className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <RegistrationStatusChecker />

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            <p>
              Belum mendaftar? Formulir pendaftaran tersedia di halaman{' '}
              <a href="/ppdb/daftar" className="font-semibold text-brand-700 hover:underline">
                formulir PPDB
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
