import { NextResponse } from 'next/server'
import db from '@/db'
import { getCurrentAdmin } from '@/lib/auth'
import { ppdbStatusLabels, isPpdbStatus } from '@/lib/ppdb'
import type { PpdbRow } from '@/lib/types'

export const dynamic = 'force-dynamic'

const COLUMNS: { header: string; value: (row: PpdbRow) => string }[] = [
  { header: 'Nomor Pendaftaran', value: (row) => row.registration_number },
  { header: 'Tanggal Daftar', value: (row) => row.created_at },
  { header: 'Status', value: (row) => ppdbStatusLabels[row.status] ?? row.status },
  { header: 'Nama Calon Siswa', value: (row) => row.student_name },
  { header: 'NISN', value: (row) => row.student_nisn ?? '' },
  { header: 'Jenis Kelamin', value: (row) => (row.gender === 'L' ? 'Laki-laki' : 'Perempuan') },
  { header: 'Tempat Lahir', value: (row) => row.birth_place },
  { header: 'Tanggal Lahir', value: (row) => row.birth_date },
  { header: 'Agama', value: (row) => row.religion },
  { header: 'Asal Sekolah', value: (row) => row.origin_school },
  { header: 'Alamat', value: (row) => row.address },
  { header: 'Kelurahan', value: (row) => row.village },
  { header: 'Kecamatan', value: (row) => row.district },
  { header: 'Nama Orang Tua', value: (row) => row.parent_name },
  { header: 'Telepon', value: (row) => row.parent_phone },
  { header: 'Email', value: (row) => row.parent_email },
  { header: 'Pekerjaan Orang Tua', value: (row) => row.parent_job },
  { header: 'Program', value: (row) => row.program },
  { header: 'Catatan Pendaftar', value: (row) => row.note },
  { header: 'Catatan Panitia', value: (row) => row.admin_note },
]

function toCsvCell(value: string): string {
  const normalized = value.replace(/\r?\n/g, ' ')
  if (/[",;]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`
  }
  return normalized
}

export async function GET(request: Request) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const statusParam = url.searchParams.get('status')
  const search = (url.searchParams.get('q') ?? '').trim()

  const query = db<PpdbRow>('ppdb_registrations').select('*').orderBy('created_at', 'desc')
  if (statusParam && isPpdbStatus(statusParam)) {
    query.where('status', statusParam)
  }
  if (search.length > 0) {
    query.andWhere((builder) => {
      builder
        .whereILike('student_name', `%${search}%`)
        .orWhereILike('parent_name', `%${search}%`)
        .orWhere('registration_number', search.toUpperCase())
        .orWhereILike('parent_phone', `%${search}%`)
    })
  }

  const rows = await query

  const lines = [
    COLUMNS.map((column) => toCsvCell(column.header)).join(','),
    ...rows.map((row) => COLUMNS.map((column) => toCsvCell(column.value(row))).join(',')),
  ]

  const filename = `ppdb-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(`\uFEFF${lines.join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
