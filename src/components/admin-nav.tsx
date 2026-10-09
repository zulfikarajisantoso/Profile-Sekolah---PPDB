'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type AdminNavLink = {
  href: string
  label: string
  exact?: boolean
}

export function AdminNav({ links }: { links: AdminNavLink[] }) {
  const pathname = usePathname()

  const isActive = (link: AdminNavLink) => (link.exact ? pathname === link.href : pathname.startsWith(link.href))

  return (
    <nav aria-label="Navigasi panel admin" className="admin-nav">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="admin-nav-link" data-active={isActive(link)}>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
