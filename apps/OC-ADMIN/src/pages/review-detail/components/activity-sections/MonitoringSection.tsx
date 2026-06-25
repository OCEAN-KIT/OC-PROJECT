import type { SubmissionDetailServer } from '../../api/reviewDetail'
import { DetailField } from '../DetailField'
import {
  BARREN_EXTENT_LABEL,
  GRAZER_DISTRIBUTION_LABEL,
  ROCK_FEATURES_LABEL,
  SEAWEED_HEALTH_LABEL,
  SUITABILITY_LABEL,
  TERRAIN_LABEL,
  toLabel,
  toLabels,
} from '../../utils/enumLabels'

type MonitoringSectionProps = {
  detail: SubmissionDetailServer
}

export function MonitoringSection({ detail }: MonitoringSectionProps) {
  const activity = detail.monitoringActivity
  if (!activity) return null

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        모니터링 상세
      </h2>

      <h3 className="mb-1 mt-3 text-xs font-medium text-gray-500">적지조사</h3>
      <div className="grid gap-x-6 lg:grid-cols-2">
        <DetailField label="입수 좌표" value={activity.entryCoordinate} />
        <DetailField label="출수 좌표" value={activity.exitCoordinate} />
        <DetailField label="진행 방위" value={activity.direction} />
        <DetailField
          label="지형 구성"
          value={toLabel(TERRAIN_LABEL, activity.terrain)}
        />
        <DetailField
          label="갯녹음 정도"
          value={toLabel(BARREN_EXTENT_LABEL, activity.barrenExtent)}
        />
        <DetailField
          label="조식동물 분포"
          value={toLabel(
            GRAZER_DISTRIBUTION_LABEL,
            activity.grazerDistribution,
          )}
        />
        <DetailField
          label="암반 특성"
          value={toLabels(ROCK_FEATURES_LABEL, activity.rockFeatures)}
        />
        <DetailField
          label="해조 이식 적합성"
          value={toLabel(SUITABILITY_LABEL, activity.suitability)}
        />
      </div>

      <h3 className="mb-1 mt-4 text-xs font-medium text-gray-500">
        해조류 상태
      </h3>
      <div className="grid gap-x-6 lg:grid-cols-2">
        <DetailField label="측정 식별번호" value={activity.seaweedIdNumber} />
        <DetailField
          label="생육 상태"
          value={toLabel(SEAWEED_HEALTH_LABEL, activity.seaweedHealthStatus)}
        />
        <DetailField label="엽장" value={activity.leafLength} />
        <DetailField label="최대엽폭" value={activity.maxLeafWidth} />
      </div>
    </section>
  )
}
