import type { SubmissionDetailServer } from '../api/reviewDetail'
import { ActivitySection } from './ActivitySection'
import { CommonSection } from './CommonSection'
import { PhotoGallery } from './PhotoGallery'

type ReviewDetailCardProps = {
  detail: SubmissionDetailServer
  photos: string[]
  onOpenPhoto: (index: number) => void
}

export function ReviewDetailCard({
  detail,
  photos,
  onOpenPhoto,
}: ReviewDetailCardProps) {
  return (
    <div className="rounded-2xl bg-white px-4 py-5 ring-1 ring-black/5 sm:px-6">
      <CommonSection detail={detail} />
      <ActivitySection detail={detail} />

      {detail.workDescription && (
        <section className="mt-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            작업 설명
          </h2>
          <p className="whitespace-pre-wrap break-words text-sm text-gray-800 [overflow-wrap:anywhere]">
            {detail.workDescription}
          </p>
        </section>
      )}

      <PhotoGallery photos={photos} onOpen={onOpenPhoto} />
    </div>
  )
}
