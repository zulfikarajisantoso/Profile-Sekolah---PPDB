import Link from 'next/link'
import { navLinks, siteConfig } from '@/lib/site-config'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-slate-200 bg-brand-950 text-brand-100">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold text-white">{siteConfig.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-200">{siteConfig.tagline}</p>
          <p className="mt-5 text-xs text-brand-400">
            NPSN {siteConfig.npsn} · Akreditasi {siteConfig.accreditation}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Navigasi</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-brand-200 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Kontak</h2>
          <address className="mt-4 space-y-2.5 text-sm not-italic text-brand-200">
            <p>{siteConfig.address}</p>
            <p>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-brand-900">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-brand-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. Hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-white">
              Peta situs
            </Link>
            <Link href="/robots.txt" className="hover:text-white">
              robots.txt
            </Link>
            <Link href="/admin" className="hover:text-white">
              Panel admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
