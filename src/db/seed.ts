import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import type { Knex } from 'knex'
import db from './index.js'
import { slugify } from '../lib/slug.js'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function placeholderSvg(name: string, label: string): string {
  const initials = initialsOf(name)
  const hue = [...name].reduce((acc, ch) => (acc + ch.charCodeAt(0)) % 360, 0)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue},42%,34%)"/>
      <stop offset="100%" stop-color="hsl(${(hue + 40) % 360},38%,18%)"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#g)"/>
  <circle cx="320" cy="205" r="68" fill="rgba(255,255,255,0.88)"/>
  <text x="320" y="226" font-family="Segoe UI, Arial, sans-serif" font-size="60" font-weight="700" fill="hsl(${hue},42%,22%)" text-anchor="middle">${escapeXml(initials)}</text>
  <text x="320" y="395" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.94)" text-anchor="middle">${escapeXml(label)}</text>
</svg>
`
}

function writeAsset(file: string, content: string): string {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  fs.writeFileSync(path.join(UPLOAD_DIR, file), content, 'utf8')
  return `/uploads/${file}`
}

const teachers = [
  { name: 'Drs. Bambang Suryanto, M.Pd.', subject: 'Matematika', position: 'Kepala Sekolah', sort_order: 1 },
  { name: 'Siti Aminah, S.Pd.', subject: 'Bahasa Indonesia', position: 'Wali Kelas & Guru Bahasa Indonesia', sort_order: 2 },
  { name: 'Ahmad Fauzi, S.Pd.', subject: 'Fisika', position: 'Guru Fisika', sort_order: 3 },
  { name: 'Dewi Lestari, S.Pd.I.', subject: 'Pendidikan Agama Islam', position: 'Guru PAI', sort_order: 4 },
  { name: 'Rudi Hartono, S.Kom.', subject: 'Informatika', position: 'Guru TIK & Kepala Komite Sekolah', sort_order: 5 },
  { name: 'Nurul Hidayah, S.Pd.', subject: 'Bahasa Inggris', position: 'Guru Bahasa Inggris', sort_order: 6 },
  { name: 'Yusuf Maulana, S.Pd.', subject: 'IPA', position: 'Guru IPA', sort_order: 7 },
  { name: 'Ratna Kumala, S.Pd.', subject: 'Seni Budaya', position: 'Guru Seni Budaya', sort_order: 8 },
  { name: 'Hendra Gunawan, S.Pd.', subject: 'PJOK', position: 'Guru PJOK', sort_order: 9 },
  { name: 'Maya Puspitasari, S.E.', subject: 'Ekonomi', position: 'Guru Ekonomi', sort_order: 10 },
  { name: 'Fajar Pratama, S.Pd.', subject: 'Matematika', position: 'Guru Matematika', sort_order: 11 },
  { name: 'Lina Marlina, S.Pd.', subject: 'Bahasa Indonesia', position: 'Guru Bahasa Indonesia', sort_order: 12 },
]

const achievements = [
  { title: 'Juara 1 Lomba Creative Cooking tingkat Kabupaten', level: 'Kabupaten', year: 2025, holder: 'Tim Memasak Sekolah', sort_order: 1 },
  { title: 'Juara 2 Olimpiade Sains Nasional bidang Matematika', level: 'Nasional', year: 2025, holder: 'Rafi Pratama, Kelas IX', sort_order: 2 },
  { title: 'Juara 1 Lomba Robotika tingkat Nasional', level: 'Nasional', year: 2024, holder: 'Tim Robotik Sekolah', sort_order: 3 },
  { title: 'Juara 3 Pencak Silat tingkat Provinsi', level: 'Provinsi', year: 2024, holder: 'Siti Nurhaliza, Kelas VIII', sort_order: 4 },
  { title: 'Juara 1 Lomba Sepak Bola tingkat Kabupaten', level: 'Kabupaten', year: 2024, holder: 'Tim Sepak Bola Sekolah', sort_order: 5 },
  { title: 'Juara 2 Lomba Pentas Seni tingkat Provinsi', level: 'Provinsi', year: 2023, holder: 'Kelas VII', sort_order: 6 },
  { title: 'Juara 1 Lomba Tahfidz Al-Qur\u2019an tingkat Kabupaten', level: 'Kabupaten', year: 2023, holder: 'KSM Al-Huda, Kelas X', sort_order: 7 },
  { title: 'Juara 1 Lomba Seni Rupa tingkat Nasional', level: 'Nasional', year: 2023, holder: 'Ruang Seni Sekolah', sort_order: 8 },
]

const news = [
  {
    title: 'PPDB Tahun Ajaran 2026/2027 Resmi Dibuka',
    category: 'pengumuman',
    excerpt:
      'Pendaftaran murid baru tahun ajaran 2026/2027 resmi dibuka mulai 1 November 2026 dengan kuota terbatas untuk tiga jenjang.',
    content: `Pendaftaran Murid Baru (PPDB) Tahun Ajaran 2026/2027 telah resmi dibuka. Pendaftaran dilakukan secara online melalui formulir pada halaman PPDB di website ini, sehingga calon orang tua tidak perlu datang langsung ke sekolah.

Jadwal Pendaftaran

Gelombang 1: 1 November sampai 20 Desember 2026
Gelombang 2: 21 Desember 2026 sampai 15 Januari 2027
Pengumuman hasil seleksi gelombang 1: 5 Januari 2027

Kuota yang tersedia

Kelas 1: 40 siswa
Kelas 4: 24 siswa
Kelas 5: 16 siswa

Calon orang tua disarankan menyiapkan akta kelahiran, kartu keluarga, dan pas foto karena akan diminta saat verifikasi berkas di sekolah. Proses pendaftaran tidak dipungut biaya apa pun.

Silakan isi formulir di halaman PPDB untuk mendapatkan nomor pendaftaran.`,
    published_at: '2026-10-01T08:00:00.000Z',
  },
  {
    title: 'Siswa SMP Raih Juara 1 Olimpiade Matematika Tingkat Kabupaten',
    category: 'berita',
    excerpt:
      'Tim matematika sekolah meraih juara 1 tingkat kabupaten dalam seleksi Olimpiade Sains Nasional bidang matematika yang berlangsung pada Oktober lalu.',
    content: `Tim matematika sekolah berhasil meraih juara 1 tingkat kabupaten dalam seleksi Olimpiade Sains Nasional bidang matematika.

Empat siswa dari kelas IX mengikuti seleksi tahap kabupaten yang berlangsung pada Oktober lalu. Setelah melalui seleksi tertulis dan presentasi lisan, tim ini berhasil mengalahkan sekolah-sekolah lain di kabupaten.

Pelatih tim, Budi Setiawan, S.Pd., menyatakan bahwa keberhasilan ini merupakan hasil latihan rutin setiap Sabtu pagi.

Kami berburu tidak hanya juara, tetapi kebiasaan berpikir logis dan teliti di mata anak-anak.`,
    published_at: '2026-09-18T09:30:00.000Z',
  },
  {
    title: 'Penataan Ruang Perpustakaan Sekolah dengan Sistem Digital',
    category: 'berita',
    excerpt:
      'Perpustakaan sekolah kini memakai katalog digital sehingga siswa dapat mencari buku yang sedang dipinjam sebelum datang ke lokasi.',
    content: `Perpustakaan sekolah resmi ditata ulang dengan penataan koleksi dan digitalisasi katalog.

Melalui katalog daring, siswa dan orang tua dapat mencari buku yang sedang dipinjam sebelum datang ke Perpustakaan.

Kegiatan ini merupakan bagian dari program peningkatan literasi sekolah yang berjalan sejak Agustus lalu.

Anak-anak jauh lebih tertarik ketika proses peminjaman terasa ringan dan cepat.`,
    published_at: '2026-09-05T07:15:00.000Z',
  },
  {
    title: 'Kegiatan Class Meeting Semester Genap Digelar Serentak',
    category: 'pengumuman',
    excerpt:
      'Lomba antar kelas futsal, voli, dan cerdas cermat merupakan agenda tahunan yang ditunggu siswa setiap akhir semester.',
    content: `Kegiatan Class Meeting semester genap digelar serentak di lapangan sekolah pada Sabtu, 29 Agustus 2026.

Lomba yang dipertahankan meliputi futsal, voli, tarik tambang, dan cerdas cermat antarkelas.

Juara pada setiap cabang menerima piala dan hadiah berupa voucher buku.`,
    published_at: '2026-08-30T10:00:00.000Z',
  },
  {
    title: 'Pemeriksaan Kesehatan Gratis untuk Seluruh Siswa',
    category: 'pengumuman',
    excerpt:
      'Bekerja sama dengan Puskesmas setempat, sekolah menyelenggarakan pemeriksaan kesehatan gratis bagi seluruh siswa.',
    content: `Sekolah bekerja sama dengan Puskesmas setempat menyelenggarakan program pemeriksaan kesehatan gratis bagi seluruh siswa.

Kegiatan meliputi pengukuran tinggi dan berat badan, pemeriksaan gigi, serta pemeriksaan mata dan pendengaran.

Orang tua diharapkan mendampingi anak pada jadwal yang telah diumumkan per kelas.`,
    published_at: '2026-08-12T08:45:00.000Z',
  },
]

export async function seed(knex: Knex = db): Promise<void> {
  const [adminRow] = await knex('admin_users').count<{ total: number | string }[]>('* as total')
  if (Number(adminRow?.total ?? 0) === 0) {
    const username = process.env.ADMIN_USERNAME ?? 'admin'
    const password = process.env.ADMIN_PASSWORD ?? 'sekolah123'

    await knex('admin_users').insert({
      username,
      password_hash: bcrypt.hashSync(password, 12),
      full_name: 'Administrator Sekolah',
      role: 'admin',
    })
    console.log(`[seed] admin dibuat -> username: ${username} / password: ${password}`)
  }

  const [teacherRow] = await knex('teachers').count<{ total: number | string }[]>('* as total')
  if (Number(teacherRow?.total ?? 0) === 0) {
    const rows = teachers.map((teacher, index) => ({
      ...teacher,
      photo: writeAsset(`teacher-${index + 1}.svg`, placeholderSvg(teacher.name, teacher.subject)),
    }))
    await knex('teachers').insert(rows)
    console.log(`[seed] ${rows.length} data guru`)
  }

  const [achievementRow] = await knex('achievements').count<{ total: number | string }[]>('* as total')
  if (Number(achievementRow?.total ?? 0) === 0) {
    const rows = achievements.map((item, index) => ({
      ...item,
      image: writeAsset(
        `achievement-${index + 1}.svg`,
        placeholderSvg(item.title, `${item.year} - ${item.level}`),
      ),
    }))
    await knex('achievements').insert(rows)
    console.log(`[seed] ${rows.length} data prestasi`)
  }

  const [newsRow] = await knex('news').count<{ total: number | string }[]>('* as total')
  if (Number(newsRow?.total ?? 0) === 0) {
    const rows = news.map((item) => {
      const slug = slugify(item.title)
      return {
        ...item,
        slug,
        is_published: true,
        cover_image: writeAsset(`${slug}.svg`, placeholderSvg(item.title, 'Berita Sekolah')),
      }
    })
    await knex('news').insert(rows)
    console.log(`[seed] ${rows.length} berita`)
  }

  const [ppdbRow] = await knex('ppdb_registrations').count<{ total: number | string }[]>('* as total')
  if (Number(ppdbRow?.total ?? 0) === 0) {
    await knex('ppdb_registrations').insert([
      {
        registration_number: 'PPDB-2027-0001',
        student_name: 'Ahmad Fauzan Ramadhan',
        student_nisn: '0123456789',
        gender: 'L',
        birth_place: 'Bandung',
        birth_date: '2017-04-12',
        religion: 'Islam',
        origin_school: 'SD Negeri 3 Cibaduyut',
        address: 'Jl. Melati No. 24, RT 04 / RW 09',
        village: 'Cibaduyut',
        district: 'Buahbatu',
        parent_name: 'Rahmat Hidayat',
        parent_phone: '081234567890',
        parent_email: 'rahmat.hidayat@example.com',
        parent_job: 'Wiraswasta',
        program: 'Reguler Pagi',
        status: 'diverifikasi',
      },
      {
        registration_number: 'PPDB-2027-0002',
        student_name: 'Salsabila Ramadhani',
        student_nisn: '0123456790',
        gender: 'P',
        birth_place: 'Bandung',
        birth_date: '2017-08-30',
        religion: 'Islam',
        origin_school: 'SD Terasana Nusantara',
        address: 'Jl. Kenanga No. 7, RT 02 / RW 05',
        village: 'Turangga',
        district: 'Lengkong',
        parent_name: 'Dewi Anggraini',
        parent_phone: '081298765432',
        parent_email: 'dewi.anggraini@example.com',
        parent_job: 'Guru',
        program: 'Reguler Pagi',
        status: 'baru',
      },
      {
        registration_number: 'PPDB-2027-0003',
        student_name: 'Bagas Wicaksono',
        student_nisn: '0123456791',
        gender: 'L',
        birth_place: 'Sumedang',
        birth_date: '2016-11-05',
        religion: 'Islam',
        origin_school: 'SD Negeri 1 Ujungberung',
        address: 'Jl. Cikutra Baru No. 88, RT 06 / RW 03',
        village: 'Cikutra',
        district: 'Arcamanik',
        parent_name: 'Supardi',
        parent_phone: '081211223344',
        parent_email: 'supardi@example.com',
        parent_job: 'Pedagang',
        program: 'Reguler Siang',
        status: 'diterima',
      },
    ])
    console.log('[seed] 3 data pendaftar PPDB')
  }
}

const invokedDirectly = process.argv[1] !== undefined && path.basename(process.argv[1]).startsWith('seed')

if (invokedDirectly) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
