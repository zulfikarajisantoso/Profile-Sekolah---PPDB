import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { logoutAction } from '@/app/actions/admin'
import { AdminNav } from '@/components/admin-nav'
import '../admin.css'

const sidebarLinks = [
  { href: '/admin', label: 'Ringkasan', exact: true },
  { href: '/admin/berita', label: 'Berita & pengumuman' },
  { href: '/admin/guru', label: 'Data guru' },
  { href: '/admin/prestasi', label: 'Prestasi' },
  { href: '/admin/ppdb', label: 'Pendaftar PPDB' },
  { href: '/admin/pengaturan', label: 'Pengaturan akun' },
]

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark" aria-hidden="true">
            SN
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-white">Panel Admin</span>
            <span className="block text-xs text-cyan-200">SMP Nusantara Bandung</span>
          </span>
        </div>

        <AdminNav links={sidebarLinks} />

        <form action={logoutAction} className="mt-auto pt-6">
          <button
            type="submit"
            className="w-full rounded-md border border-white/25 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-white/10"
          >
            Keluar
          </button>
        </form>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <p className="text-sm text-slate-500">Masuk sebagai</p>
            <p className="font-display text-lg font-semibold text-slate-900">{admin.full_name || admin.username}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-900">
              {admin.role}
            </span>
            <Link
              href="/"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            >
              Lihat website
            </Link>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
