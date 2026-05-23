import type { SubmissionDetailServer } from '../../api/reviewDetail'
import { DetailField } from '../DetailField'
import { SUBSTRATE_TARGET_LABEL, toLabel } from '../../utils/enumLabels'

type SubstrateSectionProps = {
  detail: SubmissionDetailServer
}

export function SubstrateSection({ detail }: SubstrateSectionProps) {
  const activity = detail.substrateImprovementActivity
  if (!activity) return null

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        부착기질 개선 상세
      </h2>
      <div className="grid gap-x-8 md:grid-cols-2">
        <DetailField
          label="작업 대상"
          value={toLabel(SUBSTRATE_TARGET_LABEL, activity.targetType)}
        />
        <DetailField label="작업 범위" value={activity.workScope} />
        <DetailField label="작업 후 기질 상태" value={activity.substrateState} />
      </div>
    </section>
  )
}
