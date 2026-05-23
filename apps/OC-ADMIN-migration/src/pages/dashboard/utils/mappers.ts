const regionMap: Record<string, string> = {
  포항: 'POHANG',
  울진: 'ULJIN',
}

const habitatMap: Record<string, string> = {
  암반: 'ROCKY',
  혼합: 'MIXED',
  기타: 'OTHER',
}

const levelMap: Record<string, string> = {
  관측: 'OBSERVATION',
  정착: 'SETTLEMENT',
  성장: 'GROWTH',
  관리: 'MANAGEMENT',
}

const attachmentStatusMap: Record<string, string> = {
  안정: 'STABLE',
  '일부 감소': 'DECREASED',
  불안정: 'UNSTABLE',
}

export function toRegionCode(value: string): string {
  return regionMap[value] ?? value
}

export function toHabitatCode(value: string): string {
  return habitatMap[value] ?? value
}

export function toLevelCode(value: string): string {
  return levelMap[value] ?? value
}

export function toAttachmentStatusCode(value: string): string {
  return attachmentStatusMap[value] ?? value
}

export function toDateString(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
      2,
      '0',
    )}`
  }
  return ''
}
