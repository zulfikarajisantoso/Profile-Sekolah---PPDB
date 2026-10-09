import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { LoginForm } from '@/components/login-form'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Login Panel Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin()
  if (admin) {
    redirect('/admin')
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <LoginForm />
        <p className="mt-6 text-center text-xs text-slate-500">
          {siteConfig.name} - panel pengelolaan konten sekolah
        </p>
      </div>
    </div>
  )
}
