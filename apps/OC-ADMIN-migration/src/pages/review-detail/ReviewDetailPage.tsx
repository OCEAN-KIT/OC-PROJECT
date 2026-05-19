import RejectModal from '#/pages/home/components/reject-reason-modal'
import type { SubmissionDetailServer } from './api/reviewDetail'
import { PhotoLightbox } from './components/PhotoLightbox'
import { RejectReasonBanner } from './components/RejectReasonBanner'
import { ReviewDetailCard } from './components/ReviewDetailCard'
import { ReviewDetailLayout } from './components/ReviewDetailLayout'
import { ReviewDetailState } from './components/ReviewDetailState'
import { ReviewDetailTopBar } from './components/ReviewDetailTopBar'
import { useReviewDetailActions } from './hooks/useReviewDetailActions'
import { useReviewDetailPage } from './hooks/useReviewDetailPage'

export function ReviewDetailPage() {
  const page = useReviewDetailPage()

  if (page.isFetching) {
    return <ReviewDetailState type="loading" />
  }

  if (page.isError || !page.detail) {
    return <ReviewDetailState type="error" onRetry={page.onRetry} />
  }

  return (
    <ReviewDetailLoaded
      detail={page.detail}
      photos={page.photos}
      lightboxIndex={page.lightboxIndex}
      setLightboxIndex={page.setLightboxIndex}
    />
  )
}

type ReviewDetailLoadedProps = {
  detail: SubmissionDetailServer
  photos: string[]
  lightboxIndex: number | null
  setLightboxIndex: (index: number | null) => void
}

function ReviewDetailLoaded({
  detail,
  photos,
  lightboxIndex,
  setLightboxIndex,
}: ReviewDetailLoadedProps) {
  const actions = useReviewDetailActions({ detail })

  return (
    <ReviewDetailLayout>
      <ReviewDetailTopBar detail={detail} {...actions.topBarProps} />
      <RejectReasonBanner reason={detail.rejectReason} />

      <ReviewDetailCard
        detail={detail}
        photos={photos}
        onOpenPhoto={setLightboxIndex}
      />
  
      <RejectModal {...actions.rejectModalProps} />

      {lightboxIndex !== null && photos[lightboxIndex] && (
        <PhotoLightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </ReviewDetailLayout>
  )
}
