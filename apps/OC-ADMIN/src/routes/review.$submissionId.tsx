/*
 * /review/$submissionId 동적 경로와 리뷰 상세 페이지를 연결합니다.
 * submissionId 파라미터를 가진 URL만 선언하고, 상세 데이터 처리는 페이지 쪽 책임입니다.
 */
import { createFileRoute } from '@tanstack/react-router'
import { ReviewDetailPage } from '#/pages/review-detail/ReviewDetailPage'

export const Route = createFileRoute('/review/$submissionId')({
  component: ReviewDetailPage,
})
