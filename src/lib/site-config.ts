export const siteConfig = {
  name: 'SMP Nusantara Bandung',
  shortName: 'Nusantara',
  tagline: 'Sekolah unggulan yang membentuk karakter, ilmu, dan kreativitas generasi muda Indonesia.',
  description:
    'Profil resmi SMP Nusantara Bandung. Informasi sekolah, visi misi, fasilitas, data guru, prestasi, dan pendaftaran murid baru (PPDB) secara online.',
  npsn: '20219876',
  accreditation: 'A (Unggul)',
  address: 'Jl. Cendana No. 45, Cibaduyut, Bandung 40132',
  phone: '(022) 5898-1120',
  whatsapp: '+62 812-3456-7890',
  email: 'info@smpnusantarabandung.sch.id',
  social: {
    instagram: 'https://instagram.com/smpnusantarabandung',
    facebook: 'https://facebook.com/smpnusantarabandung',
    youtube: 'https://youtube.com/@smpnusantarabandung',
  },
} as const

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://smpnusantarabandung.sch.id'

export const ppdbConfig = {
  year: '2026/2027',
  openUntil: '15 Januari 2027',
  quotas: [
    { grade: 'Kelas 1', slots: 40 },
    { grade: 'Kelas 4', slots: 24 },
    { grade: 'Kelas 5', slots: 16 },
  ],
  schedules: [
    { wave: 'Gelombang 1', period: '1 November – 20 Desember 2026', note: 'Prioritas anak sekolah dalam wilayah catchment' },
    { wave: 'Gelombang 2', period: '21 Desember 2026 – 15 Januari 2027', note: 'Umum' },
  ],
  requirements: [
    'Usia calon siswa maksimal 7 tahun untuk kelas 1, 10 tahun untuk kelas 4, dan 11 tahun untuk kelas 5.',
    'Scan/foto akta kelahiran dan kartu keluarga (KK) yang jelas.',
    'Pas foto terbaru ukuran 3x4 berwarna dengan latar belakang merah.',
    'Rapor atau sertifikat dari sekolah sebelumnya (kelas 4 dan 5).',
    'Formulir diisi dengan data yang benar dan lengkap sesuai dokumen resmi.',
  ],
  fees: [
    { label: 'Uang pangkal (sekali)', amount: 750000, note: 'Dapat dicicil 2 kali' },
    { label: 'SPP bulanan', amount: 450000, note: 'Jatuh tempo tanggal 5 setiap bulan' },
    { label: 'Kegiatan tahunan', amount: 350000, note: 'Praktikum, outing, dan rangkaian kelas' },
    { label: 'Seragam dan alat tulis', amount: 500000, note: 'Perkiraan, menyesuaikan ukuran siswa' },
  ],
  programs: ['Reguler Pagi (07.00–12.00)', 'Reguler Siang (12.00–16.00)', 'Kelas Aksara (bahasa & seni)'],
} as const

export const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil Sekolah' },
  { href: '/fasilitas', label: 'Fasilitas' },
  { href: '/guru', label: 'Guru' },
  { href: '/prestasi', label: 'Prestasi' },
  { href: '/berita', label: 'Berita' },
  { href: '/ppdb', label: 'PPDB' },
] as const

export type NavLink = (typeof navLinks)[number]
