# Website Profil Sekolah

Website profil sekolah untuk **SMP Nusantara Bandung** beserta formulir pendaftaran murid baru (PPDB) dan panel admin untuk staf sekolah. Dibangun dari `prd.md` (Fase 1 / MVP).

## Fitur

- **Halaman profil sekolah** — sejarah, visi, misi, nilai, legalitas, dan kontak di `/profil`
- **Fasilitas** — daftar delapan fasilitas dengan foto di `/fasilitas`
- **Direktori guru** — filter per mata pelajaran di `/guru`
- **Prestasi** — daftar prestasi per tingkat dan tahun di `/prestasi`
- **Berita & pengumuman** — daftar, paginasi, dan halaman detail dengan schema.org NewsArticle di `/berita`
- **PPDB online** — syarat, jadwal, kuota, dan biaya di `/ppdb`; formulir di `/ppdb/daftar`; cek status di `/ppdb/cek`
- **Panel admin** — CRUD berita, guru, prestasi; kelola pendaftar; export CSV; kelola akun di `/admin`

## Stack

| Layer | Pilihan |
| --- | --- |
| Bahasa | TypeScript (full-stack) |
| Framework | Next.js 16 (App Router) + React 19 |
| Database | SQLite via Knex.js + better-sqlite3 |
| Styling | Tailwind CSS 4 |
| Validasi | Zod |
| Auth | Password hash bcrypt + cookie sesi bertanda tangan HMAC |

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local      # lalu isi SESSION_SECRET
npm run db:setup                # migrasi + data contoh + akun admin
npm run dev
```

Buka http://localhost:3000. Login admin di http://localhost:3000/admin/login dengan `admin` / `sekolah123` (ubah lewat halaman Pengaturan akun).

## Perintah yang tersedia

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm start` | Menjalankan hasil build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript tanpa emit |
| `npm run db:migrate` | Menjalankan migrasi yang belum dieksekusi |
| `npm run db:seed` | Mengisi data contoh (aman diulang, melewati tabel yang sudah ada) |
| `npm run db:reset` | Hapus file database, migrasi ulang, isi data contoh |
| `npm run db:assets` | Membuat ulang gambar placeholder di `public/` |
| `npm run check:chars` | Memeriksa karakter asing yang tidak semestinya ada di teks Indonesia |
| `npm run verify` | Lint + typecheck + build + smoke test end-to-end di server produksi |
| `npm test` | Smoke test saja (butuh server sudah berjalan di `localhost:3000`) |

`npm run verify` membuat akun uji `smokeadmin` sementara, menjalankan server build produksi, mengeksekusi 36 pemeriksaan, lalu menghapus data uji. Jalankan perintah ini sebelum deploy.

## Struktur folder

```
src
  app
    (public)          halaman profil, berita, PPDB
    admin
      login           formulir login (tanpa layout panel)
      (dashboard)     panel admin terlindungi sesi
    actions           server action: auth, CRUD konten, PPDB
    api/admin/ppdb    export CSV pendaftar (butuh sesi admin)
  components          komponen UI bersama
  db                 knex instance, migrasi, seed, reset
  lib                auth, kueri, validasi, unggah, konfigurasi situs
scripts               utilitas pengembangan dan verifikasi
```

## Database

SQLite di `data/sekolah.sqlite` (bisa diubah lewat `DATABASE_FILENAME`). Tabel:

| Tabel | Isi |
| --- | --- |
| `news` | Berita dan pengumuman |
| `teachers` | Data guru |
| `achievements` | Prestasi |
| `ppdb_registrations` | Pendaftar PPDB beserta dokumen terlampir |
| `admin_users` | Akun panel admin |

Migrasi ada di `src/db/migrations` dan memakai Knex. Kalau volume pendaftar tumbuh, pindah ke Postgres cukup mengubah `client` di `src/db/index.ts` dan `src/db/knexfile.ts`.

## Keamanan

- Password admin disimpan sebagai hash bcrypt (cost 12), bukan teks biasa
- Cookie sesi memakai tanda tangan HMAC-SHA256, `httpOnly`, `sameSite=lax`, dan `secure` di production
- `SESSION_SECRET` wajib diisi di production; nilai bawaan hanya untuk pengembangan
- Semua input form divalidasi ulang di server dengan Zod
- Honeypot pada formulir PPDB menahan submission bot
- Unggah dokumen dibatasi pada JPG, PNG, WEBP, dan PDF maksimal 2 MB, maksimal 4 berkas
- Halaman admin dan endpoint export CSV menolak permintaan tanpa sesi

## Cadangan database

Karena SQLite berupa satu file, pencadangan cukup menyalin filenya:

```bash
# Linux/macOS
cp data/sekolah.sqlite backup/sekolah-$(date +%F).sqlite
```

Untuk konsistensi, jalankan `sqlite3 data/sekolah.sqlite ".backup backup/sekolah.db"` saat server sedang berjalan, atau hentikan server sementara sebelum menyalin.

## Konten awal

Gambar di `public/` masih placeholder SVG yang dibuat oleh `npm run db:assets`. Ganti foto gedung, kelas, perpustakaan, guru, dan piagam dengan foto asli sekolah sebelum website ditayangkan. Jalur gambar diisi lewat kolom URL di panel admin; berkas diletakkan di `public/uploads/`.

## Yang belum termasuk (di luar Fase 1)

Portal akademik, pembayaran SPP, komentar publik, aplikasi mobile, dan pengiriman email konfirmasi PPDB. Nomor pendaftaran saat ini ditampilkan di layar dan dapat dicek lewat `/ppdb/cek`.
