import type { SubmissionDetailServer } from '../api/reviewDetail'
import { CleanupSection } from './activity-sections/CleanupSection'
import { GrazerRemovalSection } from './activity-sections/GrazerRemovalSection'
import { MonitoringSection } from './activity-sections/MonitoringSection'
import { SubstrateSection } from './activity-sections/SubstrateSection'
import { TransplantSection } from './activity-sections/TransplantSection'

type ActivitySectionProps = {
  detail: SubmissionDetailServer
}

export function ActivitySection({ detail }: ActivitySectionProps) {
  switch (detail.activityType) {
    case 'TRANSPLANT':
      return <TransplantSection detail={detail} />
    case 'GRAZER_REMOVAL':
      return <GrazerRemovalSection detail={detail} />
    case 'SUBSTRATE_IMPROVEMENT':
      return <SubstrateSection detail={detail} />
    case 'MONITORING':
      return <MonitoringSection detail={detail} />
    case 'MARINE_CLEANUP':
      return <CleanupSection detail={detail} />
    case 'OTHER':
    default:
      return null
  }
}
