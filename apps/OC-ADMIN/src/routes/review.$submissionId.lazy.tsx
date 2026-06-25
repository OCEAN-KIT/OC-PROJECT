import { createLazyFileRoute } from '@tanstack/react-router'
import { ReviewDetailPage } from '#/pages/review-detail/ReviewDetailPage'
import { AuthGuard } from '#/shared/auth/AuthGuard'

export const Route = createLazyFileRoute('/review/$submissionId')({
  component: ReviewDetailRoute,
})

function ReviewDetailRoute() {
  return (
    <AuthGuard mode="gotoLogin">
      <ReviewDetailPage />
    </AuthGuard>
  )
}
