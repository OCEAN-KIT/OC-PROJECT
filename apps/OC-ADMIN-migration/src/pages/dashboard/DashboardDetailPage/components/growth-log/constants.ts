import type {
  GrowthLogPayload,
  GrowthStatus,
} from '@ocean-kit/dashboard-domain/types/areaLogPayloads'

// ── 상태 옵션 ──

export const statusOptions: { value: GrowthStatus; label: string }[] = [
  { value: 'GOOD', label: '양호' },
  { value: 'NORMAL', label: '보통' },
  { value: 'POOR', label: '미흡' },
]

// ── 폼 초기값 ──

export const EMPTY_FORM: GrowthLogPayload = {
  speciesId: 0,
  recordDate: '',
  growthLength: 0,
  status: '',
}
