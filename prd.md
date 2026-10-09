# PRD: Website Profil Sekolah

Oct 9, 2026 · @zain abdullah

## Ringkasan & Latar Belakang

Website ini dibangun agar sekolah punya kanal resmi untuk memperkenalkan diri ke masyarakat dan calon siswa, menggantikan penyebaran informasi yang saat ini hanya lewat brosur, spanduk, atau media sosial yang terpisah-pisah. Tahap awal ini fokus pada satu tujuan: membuat calon orang tua dan siswa percaya diri untuk mendaftar, dengan menyediakan profil sekolah yang meyakinkan dan jalur pendaftaran (PPDB) yang jelas.

Ini adalah **Fase 1 (MVP)** dari produk yang kemungkinan akan berkembang (portal akademik, LMS, dsb di fase berikutnya), tapi scope dokumen ini dibatasi hanya pada website profil sekolah.

## Tujuan & Sasaran

**Goals (Fase 1):**

- Menyediakan informasi lengkap sekolah (profil, visi-misi, fasilitas) yang bisa diakses 24 jam oleh siapa saja
- Menampilkan kredibilitas sekolah lewat profil guru dan daftar prestasi
- Menjadi kanal resmi untuk berita dan pengumuman sekolah
- Mendigitalkan proses pendaftaran siswa baru (PPDB) lewat formulir online, menggantikan proses manual/kertas
- Website mudah diupdate sendiri oleh staf sekolah (admin/tata usaha) tanpa butuh developer

**Non-Goals (di luar Fase 1):**

- Portal akademik untuk siswa/orang tua (nilai, absensi, e-learning)
- Sistem pembayaran SPP online
- Forum atau fitur komunitas/komentar publik
- Aplikasi mobile terpisah

## Target Pengguna & Persona

| Persona | Kebutuhan utama di website |
| --- | --- |
| Calon orang tua / siswa | Info visi-misi, fasilitas, biaya, cara daftar (PPDB) |
| Siswa & orang tua saat ini | Baca pengumuman dan berita terbaru sekolah |
| Masyarakat umum / dinas pendidikan | Melihat profil resmi, prestasi, akreditasi sekolah |
| Staf TU / admin sekolah | Input berita, kelola data PPDB masuk, update info guru tanpa bantuan developer |

## Lingkup Fitur (Fase 1)

### 1. Profil Sekolah

- Halaman Tentang Kami: sejarah, visi, misi, nilai sekolah
- Halaman Fasilitas: daftar + foto fasilitas (lab, perpustakaan, lapangan, dll)
- Halaman akreditasi/legalitas (opsional: nomor NPSN, status akreditasi)

### 2. Guru & Prestasi

- Direktori guru: nama, foto, mata pelajaran/jabatan
- Halaman prestasi: daftar prestasi sekolah/siswa (nama prestasi, tingkat, tahun, foto piagam)

### 3. Berita & Pengumuman

- Listing berita dengan judul, tanggal, gambar sampul, ringkasan
- Halaman detail berita/pengumuman
- Admin dapat membuat, mengedit, dan menghapus berita dari panel admin

### 4. Formulir PPDB (Pendaftaran Siswa Baru)

- Form pendaftaran online: data calon siswa, data orang tua, dokumen upload (opsional: scan KK/akta)
- Konfirmasi otomatis ke pendaftar (email, atau minimal nomor pendaftaran di layar)
- Panel admin untuk melihat & mengelola daftar pendaftar (lihat, ubah status, export)

### 5. Panel Admin (pendukung semua fitur di atas)

- Login admin
- CRUD berita/pengumuman
- CRUD data guru & prestasi
- Lihat & kelola data pendaftar PPDB

## Keputusan Teknis

**Database tetap dibutuhkan.** Memang benar halaman profil, visi-misi, dan fasilitas bisa berupa konten statis (hardcode di kode). Tapi tiga fitur lain butuh data yang berubah-ubah dan harus bisa dikelola staf sekolah tanpa developer:

- **Berita & pengumuman** — perlu ditambah/diedit/dihapus kapan saja oleh admin
- **Data guru & prestasi** — berubah tiap tahun ajaran
- **PPDB** — setiap pendaftar yang mengisi form harus tersimpan, bisa dicek ulang, dan direkap oleh panitia PPDB

Tanpa database, ketiga hal ini harus diedit manual di kode setiap kali ada perubahan — tidak praktis untuk operasional sekolah sehari-hari. Jadi database tetap dipakai, tapi scope-nya kecil (beberapa tabel sederhana), sehingga **SQLite cocok**: tidak perlu server database terpisah, cukup satu file, mudah di-backup, dan ringan untuk trafik website sekolah yang tidak tinggi.

**Stack yang digunakan:**

| Layer | Pilihan | Alasan |
| --- | --- | --- |
| Bahasa | TypeScript (full-stack) | Type safety, satu bahasa untuk frontend & backend |
| Database | SQLite | Ringan, satu file, cukup untuk skala sekolah |
| Query builder | Knex.js | Migration & query builder di atas SQLite, mudah upgrade ke Postgres/MySQL nanti kalau trafik membesar |
| Frontend | Next.js (React + TypeScript) | SSR/SSG bagus untuk SEO halaman profil sekolah, satu framework untuk web publik + panel admin |
| Backend | API routes Next.js (atau Express terpisah) | Tidak perlu infra tambahan di tahap awal |
| Hosting | VPS murah / shared hosting Node.js | Sesuai budget sekolah tahap awal |

## Arsitektur & Tech Stack

&#91;embedded content: arsitektur 3 lapis · browser, Next.js server, SQLite\]

Server Next.js melayani halaman publik dan panel admin, lalu berbicara ke SQLite lewat Knex untuk baca/tulis data.

### Struktur folder (ringkas)

```
/src
  /pages (atau /app)       → halaman publik: home, profil, guru, berita, ppdb
  /pages/admin             → panel admin (dilindungi login)
  /pages/api               → API routes (news, teachers, ppdb, auth)
  /db
    /migrations            → skema tabel (dibuat lewat Knex)
    knexfile.ts
  /components
  /lib
```

### Skema tabel utama

| Tabel | Kolom penting |
| --- | --- |
| news | id, title, slug, content, cover\_image, published\_at |
| teachers | id, name, photo, subject/position |
| achievements | id, title, level, year, image |
| ppdb\_registrations | id, student\_name, parent\_name, phone, email, documents, status, created\_at |
| admin\_users | id, username, password\_hash, role |

## User Flow / Alur Pengguna Utama

**Alur calon siswa mendaftar PPDB:**

1. Buka website → baca halaman profil, fasilitas, dan prestasi untuk menilai sekolah
2. Buka halaman PPDB → baca syarat & jadwal pendaftaran
3. Isi formulir pendaftaran (data siswa, data orang tua, upload dokumen)
4. Submit → dapat nomor pendaftaran / konfirmasi
5. (Opsional) cek status pendaftaran dengan nomor pendaftaran

**Alur admin mengelola konten:**

1. Login ke panel admin
2. Tambah/edit berita atau pengumuman
3. Tambah/edit data guru & prestasi
4. Lihat daftar pendaftar PPDB, ubah status (baru → diverifikasi → diterima/ditolak), export ke Excel/CSV bila perlu

## Kebutuhan Non-Fungsional

- **Responsif** — tampil baik di HP, tablet, dan desktop (sebagian besar pengunjung akan membuka lewat HP)
- **SEO dasar** — meta title/description per halaman, agar mudah ditemukan lewat Google saat orang mencari "\[nama sekolah\] PPDB" dsb
- **Performa** — halaman utama dapat dimuat dalam < 3 detik pada koneksi normal
- **Keamanan** — password admin di-hash (bukan plain text), validasi input form PPDB di server (bukan hanya di browser), proteksi dasar dari spam submission (misal honeypot/captcha sederhana)
- **Backup** — file database SQLite di-backup berkala (karena satu file, tinggal disalin)
- **Aksesibilitas dasar** — kontras warna cukup, teks alt pada gambar

## Metrik Keberhasilan

- Jumlah pendaftar PPDB yang masuk lewat form online (dibanding target/kapasitas sekolah)
- Jumlah pengunjung unik per bulan ke halaman profil & PPDB
- Staf sekolah bisa mempublikasikan berita sendiri tanpa bantuan developer (diukur dari penggunaan panel admin)
- Waktu rata-rata memuat halaman < 3 detik

## Roadmap & Tahapan Pengembangan

| Tahap | Cakupan |
| --- | --- |
| 1. Setup & desain | Setup project Next.js + TypeScript + Knex/SQLite, desain UI (wireframe/mockup) |
| 2. Halaman statis | Profil, visi-misi, fasilitas, direktori guru, prestasi |
| 3. Berita & panel admin dasar | CRUD berita/pengumuman + login admin |
| 4. PPDB | Form pendaftaran publik + panel admin untuk kelola pendaftar |
| 5. QA & deploy | Testing responsif, SEO check, deploy ke hosting, training staf sekolah pakai panel admin |

Fase berikutnya (di luar dokumen ini, jika dibutuhkan ke depan): portal akademik, sistem pembayaran, multi-bahasa.

## Risiko & Pertanyaan Terbuka

- **Volume pendaftar PPDB belum diketahui** — jika ribuan pendaftar bersamaan saat masa PPDB puncak, perlu dicek apakah SQLite masih cukup atau perlu upgrade ke Postgres (Knex memudahkan migrasi ini)
- **Siapa yang akan mengelola panel admin sehari-hari?** — perlu kejelasan siapa PIC (guru TU, panitia PPDB) dan pelatihan singkat
- **Hosting & domain** — belum ditentukan penyedia hosting dan nama domain resmi sekolah
- **Konten awal** — foto fasilitas, data guru, teks profil perlu disiapkan sekolah sebelum development dimulai, ini sering jadi bottleneck
- **Dokumen PPDB** — apakah perlu upload dokumen (KK, akta, foto) di Fase 1, atau cukup data teks dulu?
