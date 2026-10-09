'use client'

import { useMemo, useState } from 'react'
import type { TeacherRow } from '@/lib/types'

export type TeacherCardData = {
  id: number
  name: string
  subject: string
  position: string
  nip: string | null
  photo: string | null
  bio: string
}

export function TeacherDirectory({ teachers }: { teachers: TeacherRow[] }) {
  const [active, setActive] = useState('Semua')

  const cards: TeacherCardData[] = useMemo(
    () =>
      teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
        position: teacher.position,
        nip: teacher.nip,
        photo: teacher.photo,
        bio: teacher.bio,
      })),
    [teachers],
  )

  const subjects = useMemo(
    () => ['Semua', ...Array.from(new Set(cards.map((teacher) => teacher.subject))).sort()],
    [cards],
  )

  const visible = active === 'Semua' ? cards : cards.filter((teacher) => teacher.subject === active)

  return (
    <>
      {subjects.length > 2 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter mata pelajaran" className="flex flex-wrap gap-2">
            {subjects.map((subject) => {
              const isActive = subject === active
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setActive(subject)}
                  aria-pressed={isActive}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-800 text-white'
                      : 'border border-slate-300 text-slate-700 hover:border-brand-400 hover:text-brand-800'
                  }`}
                >
                  {subject}
                </button>
              )
            })}
          </div>
          <p className="text-sm text-slate-500" role="status">
            Menampilkan {visible.length} dari {cards.length} orang
          </p>
        </div>
      ) : null}

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((teacher) => (
          <li key={teacher.id} className="card overflow-hidden">
            <img
              src={teacher.photo ?? '/placeholder.svg'}
              alt={`Foto ${teacher.name}, guru ${teacher.subject}`}
              width={640}
              height={480}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="p-5">
              <h2 className="text-lg leading-snug">{teacher.name}</h2>
              <p className="mt-1.5 text-sm font-medium text-brand-700">{teacher.subject}</p>
              {teacher.position ? <p className="mt-1 text-sm text-slate-600">{teacher.position}</p> : null}
              {teacher.nip ? <p className="mt-2 text-xs text-slate-500">NIP {teacher.nip}</p> : null}
              {teacher.bio ? <p className="mt-3 text-sm leading-relaxed text-slate-600">{teacher.bio}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
