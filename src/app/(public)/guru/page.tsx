import type { Metadata } from 'next'
import { PageHero, EmptyState } from '@/components/ui'
import { getTeachers } from '@/lib/queries'
import { siteConfig } from '@/lib/site-config'
import { TeacherDirectory } from '@/components/teacher-filter'

export const metadata: Metadata = {
  title: 'Data Guru dan Tenaga Pendidik',
  description: `Direktori guru dan tenaga pendidik ${siteConfig.name} beserta mata pelajaran, jabatan, dan foto.`,
  alternates: { canonical: '/guru' },
  openGraph: { title: `Data Guru ${siteConfig.name}`, description: 'Direktori guru sekolah.', url: '/guru' },
}

export default async function TeachersPage() {
  const teachers = await getTeachers()

  return (
    <>
      <PageHero
        eyebrow="Tenaga pendidik"
        title="Guru dan tenaga pendidik"
        description="Data guru diperbarui setiap tahun ajaran melalui panel admin sekolah, sehingga informasi di halaman ini selalu aktual."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Guru' }]}
      />

      <section className="container-page py-16 lg:py-20">
        {teachers.length === 0 ? (
          <EmptyState
            title="Belum ada data guru"
            description="Data guru akan tampil setelah ditambahkan melalui panel admin."
          />
        ) : (
          <>
            <TeacherDirectory teachers={teachers} />
            <p className="mt-8 text-sm text-slate-600">
              Data guru dapat diperbarui oleh staf sekolah setiap awal tahun ajaran melalui panel admin.
            </p>
          </>
        )}
      </section>
    </>
  )
}
