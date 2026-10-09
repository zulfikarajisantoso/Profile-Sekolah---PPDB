import Link from 'next/link'
import type { ReactNode } from 'react'

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  breadcrumb?: { label: string; href?: string }[]
  children?: ReactNode
}) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
      <div className="container-page py-12 sm:py-16">
        {breadcrumb ? (
          <nav aria-label="Remah roti" className="mb-5 text-xs text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              {breadcrumb.map((item, index) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  {item.href ? (
                    <Link href={item.href} className="hover:text-brand-700 hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-slate-700">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">{description}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold text-slate-800">{title}</p>
      {description ? <p className="max-w-md text-sm text-slate-600">{description}</p> : null}
    </div>
  )
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="card px-5 py-6">
      <p className="font-display text-3xl font-semibold text-brand-800">{value}</p>
      <p className="mt-1.5 text-sm text-slate-600">{label}</p>
    </div>
  )
}
