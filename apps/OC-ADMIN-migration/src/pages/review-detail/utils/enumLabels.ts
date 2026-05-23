import type { ActivityType } from '@ocean-kit/submission-domain/types/submission'

export const SPECIES_TYPE_LABEL: Record<string, string> = {
  KAMTAE: '감태',
  DASIMA: '다시마',
  GOMPI: '곰피',
  MOJABAN: '모자반',
  DAEHWANG: '대황',
  OTHER: '기타',
}

export const LOCATION_TYPE_LABEL: Record<string, string> = {
  REEF: '어초',
  ROCK: '암반',
  OTHER: '기타',
}

export const METHOD_TYPE_LABEL: Record<string, string> = {
  ROPE_LINE: '로프 연승',
  SEED_DIRECT: '종자 직접 이식',
  MODULE: '이식용 모듈',
  OTHER: '기타',
}

export const TARGET_SPECIES_LABEL: Record<string, string> = {
  URCHIN: '성게',
  SNAIL: '소라',
  ABALONE: '전복',
  STARFISH: '불가사리',
  OTHER: '기타',
}

export const DENSITY_LABEL: Record<string, string> = {
  LOW: '적음',
  MID: '보통',
  HIGH: '많음',
}

export const GRAZING_SCOPE_LABEL: Record<string, string> = {
  LOCAL: '국소',
  ZONE: '구역',
  WIDE: '광범위',
}

export const SUBSTRATE_TARGET_LABEL: Record<string, string> = {
  ROCK: '암반',
  REEF: '어초',
  STRUCTURE: '구조물',
  OTHER: '기타',
}

export const TERRAIN_LABEL: Record<string, string> = {
  ROCK: '암반',
  SAND: '모래',
  MIXED: '혼합',
  OTHER: '기타',
}

export const BARREN_EXTENT_LABEL: Record<string, string> = {
  NONE: '없음',
  ONGOING: '진행',
  SEVERE: '심각',
}

export const GRAZER_DISTRIBUTION_LABEL: Record<string, string> = {
  LOW: '낮음',
  MID: '중간',
  HIGH: '높음',
}

export const ROCK_FEATURES_LABEL: Record<string, string> = {
  SMOOTH: '매끈',
  CRACKED: '균열',
  CALCAREOUS_ALGAE: '석회조류 우점',
  MIXED: '혼합',
  SEAWEED_VEGETATION: '해조류 식생',
}

export const SUITABILITY_LABEL: Record<string, string> = {
  SUITABLE: '적합',
  UNSUITABLE: '부적합',
}

export const SEAWEED_HEALTH_LABEL: Record<string, string> = {
  GOOD: '양호',
  WEAK: '쇠약',
  DROPPED: '탈락',
}

export const WASTE_TYPE_LABEL: Record<string, string> = {
  NET: '그물',
  TRAP: '통발',
  OTHER_GEAR: '기타 어구',
  FISHING_TOOL: '낚시도구',
  PLASTIC: '플라스틱',
  OTHER: '기타',
}

export const CLEANUP_METHOD_LABEL: Record<string, string> = {
  HAND: '수작업',
  BAG: '인양백',
  CRANE: '크레인',
}

export const UNCOLLECTED_SCALE_LABEL: Record<string, string> = {
  SMALL: '소',
  MEDIUM: '중',
  LARGE: '대',
}

export function activityLabel(type: ActivityType | string | undefined) {
  switch (type) {
    case 'TRANSPLANT':
      return '이식'
    case 'GRAZER_REMOVAL':
      return '조식동물 작업'
    case 'SUBSTRATE_IMPROVEMENT':
      return '부착기질 개선'
    case 'MONITORING':
      return '모니터링'
    case 'MARINE_CLEANUP':
      return '해양정화'
    case 'OTHER':
    default:
      return '기타'
  }
}

export function envStatusLabel(status: string | undefined) {
  switch (status) {
    case 'BAD':
      return '나쁨'
    case 'NORMAL':
      return '보통'
    case 'GOOD':
      return '좋음'
    default:
      return status || undefined
  }
}

export function toLabel(map: Record<string, string>, value?: string) {
  if (!value) return '-'
  return map[value] ?? value
}

export function toLabels(map: Record<string, string>, values?: string[]) {
  if (!values?.length) return '-'
  return values.map((value) => map[value] ?? value).join(', ')
}
