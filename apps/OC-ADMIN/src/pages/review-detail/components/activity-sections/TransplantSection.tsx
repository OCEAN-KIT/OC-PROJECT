import type { SubmissionDetailServer } from '../../api/reviewDetail'
import { DetailField } from '../DetailField'
import {
  LOCATION_TYPE_LABEL,
  METHOD_TYPE_LABEL,
  SPECIES_TYPE_LABEL,
  toLabel,
} from '../../utils/enumLabels'

type TransplantSectionProps = {
  detail: SubmissionDetailServer
}

export function TransplantSection({ detail }: TransplantSectionProps) {
  const activity = detail.transplantActivity
  if (!activity) return null

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        이식 상세
      </h2>
      <div className="grid gap-x-8 md:grid-cols-2">
        <DetailField
          label="이식 대상 종류"
          value={toLabel(SPECIES_TYPE_LABEL, activity.speciesType)}
        />
        <DetailField
          label="이식 장소"
          value={toLabel(LOCATION_TYPE_LABEL, activity.locationType)}
        />
        <DetailField
          label="이식 방식"
          value={toLabel(METHOD_TYPE_LABEL, activity.methodType)}
        />
        <DetailField label="이식 규모" value={activity.scale} />
        <DetailField label="건강 상태 등급" value={activity.healthStatus} />
      </div>
    </section>
  )
}
