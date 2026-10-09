import fs from 'node:fs'
import path from 'node:path'

const publicDir = path.join(process.cwd(), 'public')

function write(name: string, content: string): void {
  fs.mkdirSync(publicDir, { recursive: true })
  fs.writeFileSync(path.join(publicDir, name), content, 'utf8')
  console.log(`[assets] ${name}`)
}

function frame(inner: string, label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360" role="img" aria-label="${label}">
  <rect width="640" height="360" fill="#0f4c5c"/>
  ${inner}
</svg>
`
}

function grid(): string {
  let marks = ''
  for (let x = 0; x <= 640; x += 40) marks += `<line x1="${x}" y1="0" x2="${x}" y2="360" stroke="#ffffff" stroke-opacity="0.05"/>`
  for (let y = 0; y <= 360; y += 40) marks += `<line x1="0" y1="${y}" x2="640" y2="${y}" stroke="#ffffff" stroke-opacity="0.05"/>`
  return marks
}

write(
  'placeholder.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480" role="img" aria-label="Gambar belum tersedia">
  <rect width="640" height="480" fill="#e2e8f0"/>
  <path d="M240 300l60-70 45 50 40-40 55 60z" fill="#cbd5e1"/>
  <circle cx="240" cy="200" r="34" fill="#cbd5e1"/>
  <text x="320" y="410" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#64748b" text-anchor="middle">Gambar belum tersedia</text>
</svg>
`,
)

write(
  'hero-gedung.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 720" width="640" height="720" role="img" aria-label="Gedung sekolah">
  ${grid()}
  <rect width="640" height="720" fill="url(#sky)"/>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e4f5c"/>
      <stop offset="100%" stop-color="#0b3b45"/>
    </linearGradient>
  </defs>
  <circle cx="500" cy="120" r="58" fill="#fbbf24" fill-opacity="0.85"/>
  <rect x="120" y="300" width="400" height="260" fill="#f1f5f9"/>
  <rect x="120" y="270" width="400" height="40" fill="#fbbf24"/>
  <rect x="300" y="430" width="90" height="130" fill="#0e7490"/>
  ${[180, 260, 420, 500].map((x) => `<rect x="${x}" y="350" width="46" height="52" fill="#67e8f9"/>`).join('')}
  ${[180, 260, 420, 500].map((x) => `<rect x="${x}" y="440" width="46" height="52" fill="#67e8f9"/>`).join('')}
  <rect x="60" y="560" width="520" height="160" fill="#134e5a"/>
  <path d="M40 560 h560" stroke="#fbbf24" stroke-width="6"/>
  ${[100, 200, 300, 400, 500].map((x) => `<circle cx="${x}" cy="640" r="26" fill="#22c55e" fill-opacity="0.7"/>`).join('')}
</svg>
`,
)

write(
  'hero-kelas.svg',
  frame(
    `${grid()}
  <rect x="0" y="250" width="640" height="110" fill="#0b3b45"/>
  <rect x="70" y="60" width="220" height="130" fill="#0d9488"/>
  <path d="M80 180 L170 100 L260 180 Z" fill="#facc15"/>
  <rect x="380" y="70" width="190" height="120" rx="6" fill="#155e75"/>
  <path d="M400 170 L440 110 L490 165 L530 125 L560 170 Z" fill="#5eead4"/>
  <circle cx="150" cy="272" r="22" fill="#fbbf24"/>
  <rect x="120" y="300" width="60" height="60" fill="#fbbf24" fill-opacity="0.8"/>
  <circle cx="330" cy="272" r="22" fill="#f472b6"/>
  <rect x="300" y="300" width="60" height="60" fill="#f472b6" fill-opacity="0.8"/>`,
    'Suasana kelas',
  ),
)

write(
  'hero-perpustakaan.svg',
  frame(
    `${grid()}
  <rect x="0" y="240" width="640" height="120" fill="#0b3b45"/>
  ${[40, 130, 220, 310, 400, 490]
    .map(
      (x, index) =>
        `<rect x="${x}" y="${180 + (index % 2) * 12}" width="16" height="60" fill="#f59e0b"/>` +
        `<rect x="${x + 20}" y="${192 + (index % 2) * 12}" width="16" height="48" fill="#fbbf24"/>` +
        `<rect x="${x + 40}" y="${168 + (index % 2) * 12}" width="16" height="72" fill="#ef4444"/>`,
    )
    .join('')}
  <rect x="40" y="120" width="560" height="12" fill="#fbbf24"/>
  <rect x="40" y="240" width="560" height="12" fill="#fbbf24"/>
  <rect x="250" y="270" width="140" height="90" rx="8" fill="#0e7490"/>`,
    'Perpustakaan sekolah',
  ),
)

const facilities = [
  { file: 'fasilitas-laboratorium-ipa.svg', label: 'Laboratorium IPA', hue: 168 },
  { file: 'fasilitas-laboratorium-komputer.svg', label: 'Laboratorium Komputer', hue: 198 },
  { file: 'fasilitas-perpustakaan.svg', label: 'Perpustakaan', hue: 24 },
  { file: 'fasilitas-lapangan-olahraga.svg', label: 'Lapangan Olahraga', hue: 140 },
  { file: 'fasilitas-ruang-musik-seni-rupa.svg', label: 'Ruang Musik dan Seni Rupa', hue: 320 },
  { file: 'fasilitas-masjid-sekolah.svg', label: 'Masjid Sekolah', hue: 96 },
  { file: 'fasilitas-uks-ruang-konseling.svg', label: 'UKS dan Ruang Konseling', hue: 8 },
  { file: 'fasilitas-kantin-sehat.svg', label: 'Kantin Sehat', hue: 44 },
]

for (const item of facilities) {
  write(
    item.file,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360" role="img" aria-label="${item.label}">
  <rect width="640" height="360" fill="hsl(${item.hue},28%,96%)"/>
  <rect x="0" y="240" width="640" height="120" fill="hsl(${item.hue},22%,88%)"/>
  <circle cx="520" cy="80" r="46" fill="hsl(${item.hue},45%,72%)"/>
  <rect x="70" y="120" width="180" height="120" rx="8" fill="hsl(${item.hue},38%,44%)"/>
  <rect x="290" y="150" width="150" height="90" rx="8" fill="hsl(${item.hue},38%,52%)"/>
  <text x="320" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="600" fill="hsl(${item.hue},40%,22%)" text-anchor="middle">${item.label}</text>
</svg>
`,
  )
}
