import fs from 'node:fs'
import path from 'node:path'

const allowed = new Set([
  0x00c0, 0x00c1, 0x00c2, 0x00c3, 0x00c4, 0x00c5, 0x00c6, 0x00c7, 0x00c8, 0x00c9, 0x00ca, 0x00cb,
  0x00cc, 0x00cd, 0x00ce, 0x00cf, 0x00d1, 0x00d2, 0x00d3, 0x00d4, 0x00d5, 0x00d6, 0x00d9, 0x00da,
  0x00db, 0x00dc, 0x00dd, 0x00df, 0x00e0, 0x00e1, 0x00e2, 0x00e3, 0x00e4, 0x00e5, 0x00e6, 0x00e7,
  0x00e8, 0x00e9, 0x00ea, 0x00eb, 0x00ec, 0x00ed, 0x00ee, 0x00ef, 0x00f1, 0x00f2, 0x00f3, 0x00f4,
  0x00f5, 0x00f6, 0x00f9, 0x00fa, 0x00fb, 0x00fc, 0x00fd, 0x00ff, 0x2013, 0x2014, 0x2018, 0x2019,
  0x201c, 0x201d, 0x2026, 0x00a3, 0x00b0, 0x2192, 0x00b7,
])

const roots = process.argv.slice(2)
const targets = roots.length > 0 ? roots : ['src']

let problems = 0

function walk(target: string): void {
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) {
      walk(path.join(target, entry))
    }
    return
  }

  if (!/\.(ts|tsx|md|css|json)$/.test(target)) return

  const lines = fs.readFileSync(target, 'utf8').split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const ch of line) {
      const code = ch.codePointAt(0) ?? 0
      if (code > 126 && !allowed.has(code)) {
        console.log(`${target}:${index + 1}  U+${code.toString(16).toUpperCase().padStart(4, '0')}  ${line.trim().slice(0, 90)}`)
        problems += 1
        return
      }
    }
  })
}

for (const root of targets) {
  walk(root)
}

if (problems === 0) {
  console.log('OK: tidak ada karakter di luar daftar yang diizinkan')
} else {
  console.log(`\n${problems} baris memakai karakter di luar daftar yang diizinkan. Periksa manual.`)
  process.exitCode = 1
}
