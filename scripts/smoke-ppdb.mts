import fs from 'node:fs'
import path from 'node:path'
import knexFactory from 'knex'

const BASE = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'
const DB_FILE = path.join(process.cwd(), 'data', 'sekolah.sqlite')

type Check = { name: string; ok: boolean; detail: string }
const checks: Check[] = []

function record(name: string, ok: boolean, detail = ''): void {
  checks.push({ name, ok, detail })
  console.log(`${ok ? 'OK  ' : 'GAGAL'} ${name}${detail ? ` - ${detail}` : ''}`)
}

const db = knexFactory({
  client: 'better-sqlite3',
  connection: { filename: DB_FILE },
  useNullAsDefault: true,
})

async function loadFormAction(): Promise<{ actionId: string; key: string; bound: string }> {
  const html = await (await fetch(`${BASE}/ppdb/daftar`)).text()
  const actionRef = html.match(/name="\$ACTION_1:0" value="([^"]+)"/)
  if (!actionRef) throw new Error('Tidak menemukan referensi server action pada halaman PPDB')

  const decoded = actionRef[1]
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
  const parsed = JSON.parse(decoded) as { id: string }

  const key = html.match(/name="\$ACTION_KEY" value="([^"]+)"/)?.[1] ?? ''
  return { actionId: parsed.id, key, bound: decoded }
}

async function submitForm(
  form: { actionId: string; key: string; bound: string },
  fields: Record<string, string>,
  files: { name: string; content: Buffer; type: string }[] = [],
): Promise<string> {
  const boundary = `----sekolahsmoke${Date.now()}`
  const segments: string[] = []

  segments.push(`--${boundary}\r\nContent-Disposition: form-data; name="$ACTION_REF_1"\r\n\r\n\r\n`)
  segments.push(
    `--${boundary}\r\nContent-Disposition: form-data; name="$ACTION_1:0"\r\n\r\n${form.bound}\r\n`,
  )
  segments.push(
    `--${boundary}\r\nContent-Disposition: form-data; name="$ACTION_1:1"\r\n\r\n[{"status":"idle"}]\r\n`,
  )
  segments.push(`--${boundary}\r\nContent-Disposition: form-data; name="$ACTION_KEY"\r\n\r\n${form.key}\r\n`)

  for (const [name, value] of Object.entries(fields)) {
    segments.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
    )
  }

  for (const file of files) {
    segments.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="documents"; filename="${file.name}"\r\n` +
        `Content-Type: ${file.type}\r\n\r\n`,
    )
    segments.push(file.content.toString('binary'))
    segments.push('\r\n')
  }

  segments.push(`--${boundary}--\r\n`)

  const response = await fetch(`${BASE}/ppdb/daftar`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body: Buffer.from(segments.join(''), 'binary'),
    redirect: 'manual',
  })

  return await response.text()
}

function validPayload(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    student_name: 'Ananda Uji Otomatis',
    student_nisn: '0099887766',
    gender: 'P',
    birth_place: 'Bandung',
    birth_date: '2017-03-15',
    religion: 'Islam',
    origin_school: 'SD Negeri 5 Cibeureum',
    address: 'Jl. Uji Otomatis No. 1',
    village: 'Cibaduyut',
    district: 'Buahbatu',
    parent_name: 'Wali Uji Otomatis',
    parent_phone: '081298761234',
    parent_email: 'uji.otomatis@example.com',
    parent_job: 'Guru',
    program: 'Reguler Pagi',
    note: '',
    website: '',
    ...overrides,
  }
}

async function countRegistrations(): Promise<number> {
  const [row] = await db<{ total: number }[]>('ppdb_registrations').count<{ total: number }>('* as total')
  return Number(row?.total ?? 0)
}

async function main(): Promise<void> {
  const form = await loadFormAction()
  record('Server action PPDB ditemukan di halaman formulir', form.actionId.length > 0, form.actionId.slice(0, 12))

  console.log('\n== Validasi server ==')

  const before = await countRegistrations()
  const missing = await submitForm(form, validPayload({ student_name: '', parent_phone: '' }))
  record(
    'Formulir kosong ditolak server',
    missing.includes('Periksa kembali data') || missing.includes('wajib diisi'),
    'pesan galat validasi tampil',
  )
  record('Tidak ada baris tersimpan dari formulir tidak valid', (await countRegistrations()) === before)

  const badPhone = await submitForm(form, validPayload({ parent_phone: 'bukan-nomor' }))
  record('Nomor telepon tidak valid ditolak', badPhone.includes('tidak valid'))

  const badEmail = await submitForm(form, validPayload({ parent_email: 'email@@salah' }))
  record('Email tidak valid ditolak', badEmail.includes('Format email'))

  const badDate = await submitForm(form, validPayload({ birth_date: 'bukan-tanggal' }))
  record('Tanggal lahir tidak valid ditolak', /tanggal lahir tidak valid/i.test(badDate))

  console.log('\n== Honeypot ==')
  const honeypotBefore = await countRegistrations()
  const honeypot = await submitForm(form, validPayload({ website: 'https://spam.example.com' }))
  record('Kirim dengan honeypot terisi tidak menyimpan data', (await countRegistrations()) === honeypotBefore)
  record('Honeypot tetap menampilkan konfirmasi', honeypot.includes('PPDB-') || honeypot.includes('berhasil'))

  console.log('\n== Pendaftaran valid ==')
  const validBefore = await countRegistrations()
  const response = await submitForm(form, validPayload())
  const saved = (await countRegistrations()) === validBefore + 1
  record('Pendaftaran valid tersimpan', saved)

  const match = response.match(/PPDB-\d{4}-\d+/)
  if (saved && match) {
    const row = await db<{ registration_number: string; student_name: string; status: string; parent_email: string }>(
      'ppdb_registrations',
    )
      .select('registration_number', 'student_name', 'status', 'parent_email')
      .where('registration_number', match[0])
      .first()

    record('Nomor pendaftaran tampil di layar', match[0].startsWith('PPDB-'), match[0])
    record('Data tersimpan sesuai isian form', row?.student_name === 'Ananda Uji Otomatis' && row?.parent_email === 'uji.otomatis@example.com')
    record('Status awal pendaftar adalah baru', row?.status === 'baru', row?.status ?? '-')

    const statusCheck = await (await fetch(`${BASE}/api/admin/ppdb/export`, { redirect: 'manual' })).text()
    record('Export CSV menolak tanpa login', statusCheck.includes('Unauthorized'))

    await db('ppdb_registrations').where('registration_number', match[0]).delete()
    record('Data uji dibersihkan', (await countRegistrations()) === validBefore)
  } else {
    record('Nomor pendaftaran tampil di layar', false, 'tidak ditemukan pada respons')
  }

  console.log('\n== Unggah dokumen ==')
  const png = Buffer.from(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6300010000050001' +
      '0d0a2db40000000049454e44ae426082',
    'hex',
  )
  const fileBefore = await countRegistrations()
  const withFile = await submitForm(form, validPayload(), [
    { name: 'akta-kelahiran.png', content: png, type: 'image/png' },
  ])
  const fileSaved = (await countRegistrations()) === fileBefore + 1
  record('Pendaftaran dengan dokumen tersimpan', fileSaved)

  if (fileSaved) {
    const fileMatch = withFile.match(/PPDB-\d{4}-\d+/)
    if (fileMatch) {
      const row = await db<{ documents: string }>('ppdb_registrations')
        .select('documents')
        .where('registration_number', fileMatch[0])
        .first()
      const docs = JSON.parse(row?.documents ?? '[]') as { name: string; storedAs: string }[]
      record('Dokumen tercatat di database', docs.length === 1 && docs[0].name === 'akta-kelahiran.png')
      if (docs[0]) {
        const assetPath = path.join(process.cwd(), 'public', docs[0].storedAs.replace(/^\//, ''))
        const exists = fs.existsSync(assetPath)
        record('Berkas dokumen tersimpan di public/uploads', exists, docs[0].storedAs)
        if (exists) fs.rmSync(assetPath, { force: true })
      }
      await db('ppdb_registrations').where('registration_number', fileMatch[0]).delete()
    }
  }

  const tooManyBefore = await countRegistrations()
  await submitForm(
    form,
    validPayload(),
    Array.from({ length: 5 }, (_, index) => ({ name: `dokumen-${index}.png`, content: png, type: 'image/png' })),
  )
  record('Lebih dari 4 dokumen ditolak', (await countRegistrations()) === tooManyBefore)

  console.log('\n== Ringkasan ==')
  await db.destroy()
  const failed = checks.filter((check) => !check.ok)
  console.log(`${checks.length - failed.length}/${checks.length} pemeriksaan berhasil`)
  if (failed.length > 0) {
    console.log('Gagal:')
    for (const check of failed) console.log(`- ${check.name} (${check.detail})`)
    process.exit(1)
  }
  console.log('Semua pemeriksaan lolos.')
}

main().catch(async (error) => {
  console.error(error)
  await db.destroy()
  process.exit(1)
})
