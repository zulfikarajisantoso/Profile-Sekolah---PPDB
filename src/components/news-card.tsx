import Link from 'next/link'
import type { NewsRow } from '@/lib/queries'

const formatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

export function formatDate(value: string | null | undefined): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return formatter.format(date)
}

export function formatDateShort(value: string | null | undefined): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

export function categoryLabel(category: string): string {
  return category === 'pengumuman' ? 'Pengumuman' : 'Berita'
}

export function NewsCard({ item }: { item: NewsRow }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lift">
      <Link href={`/berita/${item.slug}`} className="block overflow-hidden bg-slate-100" tabIndex={-1} aria-hidden="true">
        <img
          src={item.cover_image ?? '/placeholder.svg'}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-800">
            {categoryLabel(item.category)}
          </span>
          <time dateTime={item.published_at ?? undefined} className="text-slate-500">
            {formatDate(item.published_at)}
          </time>
        </div>
        <h3 className="mt-3 text-lg leading-snug">
          <Link href={`/berita/${item.slug}`} className="hover:text-brand-700">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">{item.excerpt}</p>
        <Link
          href={`/berita/${item.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          Baca selengkapnya
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
