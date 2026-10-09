import type { ReactNode } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#konten" className="skip-link">
        Lewati ke konten utama
      </a>
      <Header />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
