import fs from 'node:fs'
import path from 'node:path'
import knexFactory from 'knex'

const BASE = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'

type Check = { name: string; ok: boolean; detail: string }
const checks: Check[] = []

function record(name: string, ok: boolean, detail = ''): void {
  checks.push({ name, ok, detail })
  console.log(`${ok ? 'OK  ' : 'GAGAL'} ${name}${detail ? ` - ${detail}` : ''}`)
}

const db = knexFactory({
  client: 'better-sqlite3',
  connection: { filename: path.join(process.cwd(), 'data', 'sekolah.sqlite') },
  useNullAsDefault: true,
})

type NewsRow = { id: number; title: string; slug: string; is_published: number; content: string }

type ActionRef = { refName: string; bound: string; stateName: string; key: string }

let sessionCookie = ''

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return { Cookie: sessionCookie, ...extra }
}

function decodeAttr(value: string): string {
  return value.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

async function loadAction(url: string): Promise<ActionRef> {
  const html = await (await fetch(`${BASE}${url}`, { headers: authHeaders() })).text()
  const ref = html.match(/name="(\$ACTION_REF_\d+)"/)
  if (!ref) throw new Error(`Referensi server action tidak ditemukan di ${url}`)

  const suffix = ref[1].replace('$ACTION_REF_', '')
  const bound = html.match(new RegExp(`name="\\$ACTION_${suffix}:0" value="([^"]*)"`))
  const key = html.match(/name="\$ACTION_KEY" value="([^"]*)"/)
  if (!bound || !key) throw new Error(`Payload server action tidak lengkap di ${url}`)

  return {
    refName: ref[1],
    bound: decodeAttr(bound[1]),
    stateName: `$ACTION_${suffix}:1`,
    key: decodeAttr(key[1]),
  }
}

async function submit(url: string, form: ActionRef, fields: Record<string, string>): Promise<string> {
  const suffix = form.refName.replace('$ACTION_REF_', '')
  const body = new FormData()
  body.append(form.refName, '')
  body.append(`$ACTION_${suffix}:0`, form.bound)
  body.append(`$ACTION_${suffix}:1`, '[{"status":"idle"}]')
  body.append('$ACTION_KEY', form.key)
  for (const [name, value] of Object.entries(fields)) {
    body.append(name, value)
  }

  const response = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: authHeaders({ Origin: BASE }),
    body,
    redirect: 'manual',
  })
  const text = await response.text()
  const echoed = [...text.matchAll(/"(title|slug|content|year|level|subject)":"([^"]{0,60})"/g)].map(
    (match) => `${match[1]}=${match[2]}`,
  )
  const errorMatch = text.match(/Periksa kembali kolom yang ditandai|Berita tidak ditemukan|Unexpected Server Error/)
  console.log(
    `  [http ${response.status}] POST ${url}${errorMatch ? ` galat="${errorMatch[0]}"` : ''}${
      echoed.length > 0 ? ` echo: ${echoed.slice(0, 6).join(', ')}` : ''
    }`,
  )
  return text
}

async function main(): Promise<void> {
  sessionCookie = fs.readFileSync(path.join(process.cwd(), 'data', 'test-session-cookie.txt'), 'utf8').trim()

  console.log('== Berita ==')
  const newsForm = await loadAction('/admin/berita?aksi=baru')
  const before = await db<NewsRow[]>('news').select('id', 'title', 'slug', 'is_published', 'content')

  await submit('/admin/berita', newsForm, {
    id: '0',
    title: 'Berita Uji Otomatis Dari Smoke Test',
    slug: '',
    excerpt: 'Ringkasan uji.',
    content: 'Paragraf pertama.\n\nParagraf kedua.',
    category: 'berita',
    cover_image: '',
    published_at: '',
    is_published: 'on',
  })
  const created = await db<NewsRow[]>('news').select('id', 'title', 'slug', 'is_published', 'content').orderBy('id', 'desc')
  const newRow = created[0]
  record('Berita baru tersimpan', created.length === before.length + 1 && newRow.title.startsWith('Berita Uji Otomatis'))
  record('Slug dibuat otomatis dari judul', newRow?.slug === 'berita-uji-otomatis-dari-smoke-test', newRow?.slug ?? '-')
  record('Berita baru langsung terbit', newRow?.is_published === 1)

  const detail = await fetch(`${BASE}/berita/${newRow.slug}`)
  const detailHtml = await detail.text()
  record('Halaman detail berita dapat diakses publik', detail.status === 200 && detailHtml.includes('Paragraf kedua'))

  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
  record('Berita baru masuk sitemap', sitemap.includes(`/berita/${newRow.slug}`))

  await submit(
    `/admin/berita?aksi=edit&id=${newRow.id}`,
    await loadAction(`/admin/berita?aksi=edit&id=${newRow.id}`),
    {
      id: String(newRow.id),
      title: 'Berita Uji Otomatis Diperbarui',
      slug: newRow.slug,
      excerpt: 'Ringkasan diperbarui.',
      content: 'Isi diperbarui.',
      category: 'pengumuman',
      cover_image: '',
      published_at: '',
      is_published: 'on',
    },
  )
  const updated = await db<NewsRow>('news').where('id', newRow.id).first()
  record('Berita dapat diperbarui', updated?.title === 'Berita Uji Otomatis Diperbarui')
  record('Kategori berita dapat diubah', updated?.content === 'Isi diperbarui.')

  const dupSlug = await db<NewsRow>('news').where('slug', newRow.slug).whereNot('id', newRow.id).first()
  record('Slug tidak bentrok antar berita', dupSlug === undefined)

  await db('news').where('id', newRow.id).delete()
  const afterDelete = await fetch(`${BASE}/berita/${newRow.slug}`)
  record('Berita yang dihapus hilang dari halaman publik', afterDelete.status === 404)
  record('Jumlah berita kembali seperti semula', (await db('news')).length === before.length)

  console.log('\n== Guru ==')
  const teacherForm = await loadAction('/admin/guru?aksi=baru')
  await submit('/admin/guru', teacherForm, {
    id: '0',
    name: 'Guru Uji Otomatis, S.Pd.',
    nip: '',
    subject: 'Matematika',
    position: 'Guru Matematika',
    photo: '',
    bio: '',
    sort_order: '99',
    is_active: 'on',
  })
  const teacher = await db<{ id: number; name: string; subject: string }>('teachers')
    .select('id', 'name', 'subject')
    .where('name', 'like', 'Guru Uji Otomatis%')
    .first()
  record('Data guru baru tersimpan', Boolean(teacher), teacher?.name ?? '-')

  if (teacher) {
    const publicGuru = await (await fetch(`${BASE}/guru`)).text()
    record('Guru baru tampil di halaman publik', publicGuru.includes('Guru Uji Otomatis'))

    await submit(
      `/admin/guru`,
      await loadAction(`/admin/guru?aksi=edit&id=${teacher.id}`),
      {
        id: String(teacher.id),
        name: 'Guru Uji Otomatis Diperbarui, S.Pd.',
        nip: '',
        subject: 'IPA',
        position: 'Guru IPA',
        photo: '',
        bio: '',
        sort_order: '98',
        is_active: '',
      },
    )
    const updatedTeacher = await db<{ name: string; subject: string; is_active: number }>('teachers')
      .where('id', teacher.id)
      .first()
    record('Data guru dapat diperbarui', updatedTeacher?.subject === 'IPA')
    record('Guru dapat disembunyikan dari halaman publik', updatedTeacher?.is_active === 0)

    await db('teachers').where('id', teacher.id).delete()
    record('Data guru uji dibersihkan', (await db('teachers').where('id', teacher.id)).length === 0)
  }

  console.log('\n== Prestasi ==')
  const achievementForm = await loadAction('/admin/prestasi?aksi=baru')
  await submit('/admin/prestasi', achievementForm, {
    id: '0',
    title: 'Prestasi Uji Otomatis',
    level: 'Nasional',
    year: '2026',
    holder: 'Tim Uji',
    image: '',
    description: '',
    sort_order: '50',
  })
  const achievement = await db<{ id: number; title: string; level: string; year: number }>('achievements')
    .select('id', 'title', 'level', 'year')
    .where('title', 'Prestasi Uji Otomatis')
    .first()
  record('Data prestasi tersimpan', Boolean(achievement), achievement?.level ?? '-')

  if (achievement) {
    const publicAchievement = await (await fetch(`${BASE}/prestasi`)).text()
    record('Prestasi baru tampil di halaman publik', publicAchievement.includes('Prestasi Uji Otomatis'))

    await submit(
      '/admin/prestasi',
      await loadAction(`/admin/prestasi?aksi=edit&id=${achievement.id}`),
      {
        id: String(achievement.id),
        title: 'Prestasi Uji Otomatis',
        level: 'Nasional',
        year: 'not-a-year',
        holder: 'Tim Uji',
        image: '',
        description: '',
        sort_order: '50',
      },
    )
    const unchanged = await db<{ year: number }>('achievements').where('id', achievement.id).first()
    record('Tahun prestasi tidak valid ditolak server', unchanged?.year === 2026, `tahun tersimpan ${unchanged?.year}`)

    await db('achievements').where('id', achievement.id).delete()
  }

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
