import { getCurrentAdmin } from '@/lib/auth'
import { NewAdminForm, PasswordForm } from '@/components/admin/account-forms'

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">Pengaturan akun</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Kelola akun untuk staf sekolah. Akun admin: {admin?.username}.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PasswordForm />
        <NewAdminForm />
      </div>
    </div>
  )
}
