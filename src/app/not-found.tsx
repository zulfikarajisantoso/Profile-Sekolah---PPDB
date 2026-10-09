import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { navLinks } from '@/lib/site-config'

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="konten" className="flex-1">
        <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <p className="font-display text-6xl font-semibold text-brand-800">404</p>
          <h1 className="mt-4 text-2xl sm:text-3xl">Halaman tidak ditemukan</h1>
          <p className="mt-3 max-w-md text-sm text-slate-600">
            Alamat yang Anda buka tidak tersedia atau sudah dipindahkan. Gunakan menu di bawah untuk kembali ke halaman
            yang benar.
          </p>

          <nav aria-label="Halaman lain" className="mt-8 flex flex-wrap justify-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="btn-ghost btn-sm">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </main>
      <Footer />
    </>
  )
}
