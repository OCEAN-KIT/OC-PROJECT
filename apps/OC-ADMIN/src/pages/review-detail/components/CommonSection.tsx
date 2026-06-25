import type { SubmissionDetailServer } from '../api/reviewDetail'
import { activityLabel, envStatusLabel } from '../utils/enumLabels'
import { DetailField } from './DetailField'

type CommonSectionProps = {
  detail: SubmissionDetailServer
}

export function CommonSection({ detail }: CommonSectionProps) {
  const env = detail.basicEnv

  return (
    <>
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          기본 정보
        </h2>
        <div className="grid gap-x-6 lg:grid-cols-2">
          <DetailField label="작업일자" value={detail.submittedAt} />
          <DetailField label="활동 장소" value={detail.siteName} />
          <DetailField
            label="작업 유형"
            value={activityLabel(detail.activityType)}
          />
          <DetailField
            label="다이빙 회차"
            value={
              detail.divingRound != null
                ? `${detail.divingRound}회차`
                : undefined
            }
          />
          <DetailField
            label="참여자"
            value={detail.participants?.participantNames}
          />
          <DetailField label="작성자" value={detail.authorName} />
        </div>
      </section>

      {env && (
        <section className="mt-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            환경 정보
          </h2>
          <div className="grid gap-x-6 lg:grid-cols-2">
            <DetailField
              label="수온"
              value={env.waterTempC != null ? `${env.waterTempC}°C` : undefined}
            />
            <DetailField
              label="평균 수심"
              value={env.avgDepthM != null ? `${env.avgDepthM}m` : undefined}
            />
            <DetailField
              label="최대 수심"
              value={env.maxDepthM != null ? `${env.maxDepthM}m` : undefined}
            />
            <DetailField
              label="시야"
              value={envStatusLabel(env.visibilityStatus)}
            />
            <DetailField label="파도" value={envStatusLabel(env.waveStatus)} />
            <DetailField label="서지" value={envStatusLabel(env.surgeStatus)} />
            <DetailField
              label="조류"
              value={envStatusLabel(env.currentStatus)}
            />
          </div>
        </section>
      )}
    </>
  )
}
