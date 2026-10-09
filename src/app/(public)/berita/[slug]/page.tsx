import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getNewsBySlug, getPublishedNews, getRelatedNews } from '@/lib/queries'
import { categoryLabel, formatDate } from '@/components/news-card'
import { siteConfig, siteUrl } from '@/lib/site-config'

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  const items = await getPublishedNews(50)
  return items.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const item = await getNewsBySlug(slug)

  if (!item || !item.is_published) {
    return { title: 'Berita tidak ditemukan' }
  }

  return {
    title: item.title,
    description: item.excerpt || `${categoryLabel(item.category)} dari ${siteConfig.name}.`,
    alternates: { canonical: `/berita/${item.slug}` },
    openGraph: {
      type: 'article',
      title: item.title,
      description: item.excerpt,
      url: `/berita/${item.slug}`,
      publishedTime: item.published_at ?? undefined,
      images: item.cover_image ? [item.cover_image] : undefined,
    },
  }
}

function renderContent(content: string) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)

  return blocks.map((block, index) => {
    if (block.startsWith('- ')) {
      const items = block
        .split('\n')
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter((line) => line.length > 0)
      return (
        <ul key={index}>
          {items.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )
    }

    return <p key={index}>{block.replace(/\n/g, ' ')}</p>
  })
}

export default async function NewsDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const item = await getNewsBySlug(slug)

  if (!item || !item.is_published) {
    notFound()
  }

  const related = await getRelatedNews(item.slug, item.category, 3)

  return (
    <>
      <article className="container-page py-12 lg:py-16">
        <nav aria-label="Remah roti" className="mb-6 text-xs text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-brand-700 hover:underline">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/berita" className="hover:text-brand-700 hover:underline">
                Berita
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="truncate text-slate-700">
              {item.title}
            </li>
          </ol>
        </nav>

        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-800">
              {categoryLabel(item.category)}
            </span>
            <time dateTime={item.published_at ?? undefined} className="text-slate-500">
              {formatDate(item.published_at)}
            </time>
          </div>
          <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{item.title}</h1>
          {item.excerpt ? <p className="mt-4 text-lg leading-relaxed text-slate-600">{item.excerpt}</p> : null}
        </header>

        {item.cover_image ? (
          <img
            src={item.cover_image}
            alt={`Gambar sampul: ${item.title}`}
            width={1024}
            height={576}
            className="mx-auto mt-10 aspect-video w-full max-w-4xl rounded-2xl border border-slate-200 object-cover"
          />
        ) : null}

        <div className="prose-news mx-auto mt-10 max-w-3xl">{renderContent(item.content)}</div>

        <footer className="mx-auto mt-12 max-w-3xl border-t border-slate-200 pt-6">
          <Link href="/berita" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
            Kembali ke daftar berita
          </Link>
        </footer>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-slate-200 bg-slate-50 py-14">
          <div className="container-page">
            <h2 className="text-2xl">Berita terkait</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((entry) => (
                <li key={entry.id} className="card p-5">
                  <p className="text-xs text-slate-500">{formatDate(entry.published_at)}</p>
                  <h3 className="mt-2 text-base leading-snug">
                    <Link href={`/berita/${entry.slug}`} className="hover:text-brand-700">
                      {entry.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{entry.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: item.title,
            description: item.excerpt,
            image: item.cover_image ? [`${siteUrl}${item.cover_image}`] : undefined,
            datePublished: item.published_at ?? undefined,
            dateModified: item.updated_at,
            author: { '@type': 'Organization', name: siteConfig.name },
            publisher: { '@type': 'Organization', name: siteConfig.name },
            mainEntityOfPage: `${siteUrl}/berita/${item.slug}`,
          }),
        }}
      />
    </>
  )
}
