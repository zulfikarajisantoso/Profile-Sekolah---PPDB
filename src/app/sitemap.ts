import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site-config'
import { getPublishedNews } from '@/lib/queries'

export const dynamic = 'force-dynamic'

const STATIC_ROUTES: { route: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }[] = [
  { route: '', changeFrequency: 'weekly', priority: 1 },
  { route: '/profil', changeFrequency: 'monthly', priority: 0.8 },
  { route: '/fasilitas', changeFrequency: 'monthly', priority: 0.7 },
  { route: '/guru', changeFrequency: 'monthly', priority: 0.7 },
  { route: '/prestasi', changeFrequency: 'monthly', priority: 0.7 },
  { route: '/berita', changeFrequency: 'daily', priority: 0.9 },
  { route: '/ppdb', changeFrequency: 'daily', priority: 0.9 },
  { route: '/ppdb/daftar', changeFrequency: 'monthly', priority: 0.8 },
  { route: '/ppdb/cek', changeFrequency: 'monthly', priority: 0.6 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getPublishedNews(500)

  return [
    ...STATIC_ROUTES.map((entry) => ({
      url: `${siteUrl}${entry.route}`,
      lastModified: new Date(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...news.map((item) => ({
      url: `${siteUrl}/berita/${item.slug}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
