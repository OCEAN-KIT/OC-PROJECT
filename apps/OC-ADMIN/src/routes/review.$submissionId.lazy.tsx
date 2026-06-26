import { createLazyFileRoute } from '@tanstack/react-router'
import { ReviewDetailPage } from '#/pages/review-detail/ReviewDetailPage'

export const Route = createLazyFileRoute('/review/$submissionId')({
  component: ReviewDetailPage,
})
