import type { SubmissionDetailServer } from '../../api/reviewDetail'
import { DetailField } from '../DetailField'
import {
  CLEANUP_METHOD_LABEL,
  UNCOLLECTED_SCALE_LABEL,
  WASTE_TYPE_LABEL,
  toLabel,
  toLabels,
} from '../../utils/enumLabels'

type CleanupSectionProps = {
  detail: SubmissionDetailServer
}

export function CleanupSection({ detail }: CleanupSectionProps) {
  const activity = detail.marineCleanupActivity
  if (!activity) return null

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        해양정화 상세
      </h2>
      <div className="grid gap-x-6 lg:grid-cols-2">
        <DetailField
          label="폐기물 유형"
          value={toLabels(WASTE_TYPE_LABEL, activity.wasteTypes)}
        />
        <DetailField
          label="인양 방식"
          value={toLabel(CLEANUP_METHOD_LABEL, activity.method)}
        />
        <DetailField label="수거량" value={activity.collectionAmount} />
        <DetailField
          label="미수거 폐기물 규모"
          value={toLabel(UNCOLLECTED_SCALE_LABEL, activity.uncollectedScale)}
        />
      </div>
    </section>
  )
}
