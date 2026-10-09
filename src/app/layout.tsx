import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { siteConfig, siteUrl } from '@/lib/site-config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} - Profil Sekolah & PPDB ${ppdbYear()}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    `${siteConfig.name}`,
    'PPDB',
    'pendaftaran siswa baru',
    'profil sekolah',
    'akreditasi sekolah',
    'fasilitas sekolah',
    'data guru',
    'prestasi sekolah',
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Profil Sekolah & PPDB ${ppdbYear()}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Profil Sekolah & PPDB ${ppdbYear()}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

function ppdbYear(): string {
  return process.env.NEXT_PUBLIC_PPDB_YEAR ?? '2026/2027'
}

export const viewport = {
  themeColor: '#0e5a63',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  )
}
