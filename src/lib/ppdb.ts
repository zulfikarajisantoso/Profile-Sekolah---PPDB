export type PpdbStatus = 'baru' | 'diverifikasi' | 'diterima' | 'ditolak'

export const ppdbStatuses: PpdbStatus[] = ['baru', 'diverifikasi', 'diterima', 'ditolak']

export const ppdbStatusLabels: Record<PpdbStatus, string> = {
  baru: 'Baru',
  diverifikasi: 'Diverifikasi',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
}

export const genderOptions = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
] as const

export const religionOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'] as const

export function isPpdbStatus(value: string): value is PpdbStatus {
  return (ppdbStatuses as string[]).includes(value)
}
