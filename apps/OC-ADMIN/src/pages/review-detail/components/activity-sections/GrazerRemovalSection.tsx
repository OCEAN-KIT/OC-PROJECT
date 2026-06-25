import type { SubmissionDetailServer } from '../../api/reviewDetail'
import { DetailField } from '../DetailField'
import {
  DENSITY_LABEL,
  GRAZING_SCOPE_LABEL,
  TARGET_SPECIES_LABEL,
  toLabel,
  toLabels,
} from '../../utils/enumLabels'

type GrazerRemovalSectionProps = {
  detail: SubmissionDetailServer
}

export function GrazerRemovalSection({ detail }: GrazerRemovalSectionProps) {
  const activity = detail.grazerRemovalActivity
  if (!activity) return null

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        조식동물 작업 상세
      </h2>
      <div className="grid gap-x-6 lg:grid-cols-2">
        <DetailField
          label="대상 생물"
          value={toLabels(TARGET_SPECIES_LABEL, activity.targetSpecies)}
        />
        <DetailField
          label="작업 전 체감 밀도"
          value={toLabel(DENSITY_LABEL, activity.densityBeforeWork)}
        />
        <DetailField
          label="작업 범위"
          value={toLabel(GRAZING_SCOPE_LABEL, activity.workScope)}
        />
        <DetailField label="수거량" value={activity.collectionAmount} />
        {activity.note && (
          <DetailField label="보충 설명" value={activity.note} />
        )}
      </div>
    </section>
  )
}
