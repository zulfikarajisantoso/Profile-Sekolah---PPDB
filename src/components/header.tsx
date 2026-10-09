'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navLinks, siteConfig } from '@/lib/site-config'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        scrolled ? 'border-slate-200 bg-white/95 backdrop-blur' : 'border-transparent bg-white'
      }`}
    >
      <div className="hidden bg-brand-900 text-brand-100 md:block">
        <div className="container-page flex items-center justify-between py-2 text-xs">
          <p className="flex items-center gap-4">
            <span>{siteConfig.phone}</span>
            <span className="text-brand-400">|</span>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-white hover:underline">
              {siteConfig.email}
            </a>
          </p>
          <p className="flex items-center gap-4">
            <span>NPSN {siteConfig.npsn}</span>
            <span className="text-brand-400">|</span>
            <span>Akreditasi {siteConfig.accreditation}</span>
          </p>
        </div>
      </div>

      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 font-display text-base font-bold text-white"
          >
            SN
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-slate-900">{siteConfig.name}</span>
            <span className="block text-[0.7rem] font-medium uppercase tracking-wider text-slate-500">
              SMP Negeri · Bandung
            </span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href) ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/ppdb/daftar" className="btn-accent btn-sm hidden sm:inline-flex">
            Daftar PPDB
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="menu-mobile" aria-label="Navigasi seluler" className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page grid gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive(link.href) ? 'bg-brand-50 text-brand-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/ppdb/daftar" onClick={() => setOpen(false)} className="btn-accent mt-2 w-full">
              Daftar PPDB
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
