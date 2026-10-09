import fs from 'node:fs'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

const TEST_SECRET = 'uji-otomatis-secret-panjang-1234567890'
const TEST_USER = 'smokeadmin'
const TEST_PASSWORD = 'SmokeTest123'
const isWindows = process.platform === 'win32'

function run(command: string, args: string[]): string {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, SESSION_SECRET: TEST_SECRET },
    shell: isWindows,
  })

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} gagal:\n${result.stdout ?? ''}\n${result.stderr ?? ''}`)
  }

  return result.stdout ?? ''
}

async function startServer(): Promise<number> {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true })
  const log = fs.openSync(path.join(process.cwd(), 'data', 'test-server.log'), 'w')

  const child = spawn('npm', ['run', 'start'], {
    cwd: process.cwd(),
    detached: true,
    stdio: ['ignore', log, log],
    env: { ...process.env, SESSION_SECRET: TEST_SECRET },
    shell: isWindows,
  })

  child.unref()
  return child.pid ?? 0
}

async function waitForServer(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    try {
      const response = await fetch('http://localhost:3000/')
      if (response.status === 200) return
    } catch {
      // Server belum siap, coba lagi.
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error('Server tidak siap dalam batas waktu')
}

function stopServer(pid: number): void {
  try {
    if (isWindows) {
      run('taskkill', ['/PID', String(pid), '/T', '/F'])
    } else {
      process.kill(-pid)
    }
  } catch {
    // Server sudah berhenti atau proses sudah hilang.
  }
}

async function main(): Promise<void> {
  console.log('Verifikasi penuh: lint, typecheck, build, lalu smoke test di server produksi.\n')

  console.log('[1/6] lint')
  process.stdout.write(run('npx', ['eslint', '.']))

  console.log('[2/6] typecheck')
  process.stdout.write(run('npx', ['tsc', '--noEmit']))

  console.log('[3/6] build')
  process.stdout.write(run('npm', ['run', 'build']))

  console.log('[4/6] menyiapkan sesi uji')
  process.stdout.write(run('npx', ['tsx', 'scripts/make-session.mts', TEST_USER, TEST_PASSWORD, TEST_SECRET]))

  console.log('[5/6] menyalakan server produksi')
  const pid = await startServer()

  try {
    await waitForServer()
    console.log('[6/6] smoke test\n')
    process.stdout.write(run('npx', ['tsx', 'scripts/smoke-ppdb.mts']))
    process.stdout.write(run('npx', ['tsx', 'scripts/smoke-admin.mts']))
    process.stdout.write(run('npx', ['tsx', 'scripts/cleanup-test-data.mts']))
  } finally {
    stopServer(pid)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log('\nSemua pemeriksaan lolos.')
}

main().catch((error) => {
  console.error(typeof error === 'string' ? error : (error as Error).message)
  process.exit(1)
})
