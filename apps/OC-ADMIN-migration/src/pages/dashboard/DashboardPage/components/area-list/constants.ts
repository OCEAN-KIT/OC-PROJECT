import type { AreaAttachmentStatus } from '@ocean-kit/dashboard-domain/types/areas'

export type AreaItem = {
  id: number
  name: string
  restorationRegion: 'POHANG' | 'ULJIN'
  startDate: string
  endDate: string | null
  habitat: 'ROCKY' | 'MIXED' | 'OTHER'
  depth: number
  areaSize: number
  level: 'OBSERVATION' | 'SETTLEMENT' | 'GROWTH' | 'MANAGEMENT'
  attachmentStatus: AreaAttachmentStatus
  lat: number
  lon: number
}

export const regionLabels: Record<string, string> = {
  POHANG: '포항',
  ULJIN: '울진',
}

export const levelLabels: Record<string, string> = {
  OBSERVATION: '관측',
  SETTLEMENT: '정착',
  GROWTH: '성장',
  MANAGEMENT: '관리',
}

export const habitatLabels: Record<string, string> = {
  ROCKY: '암반',
  MIXED: '혼합',
  OTHER: '기타',
}

export const statusLabels: Record<AreaAttachmentStatus, string> = {
  STABLE: '안정',
  DECREASED: '일부 감소',
  UNSTABLE: '불안정',
}

export const statusColors: Record<AreaAttachmentStatus, string> = {
  STABLE: 'bg-emerald-100 text-emerald-700',
  DECREASED: 'bg-yellow-100 text-yellow-700',
  UNSTABLE: 'bg-rose-100 text-rose-700',
}
