import { useParams } from '@tanstack/react-router'

export function ReviewDetailPage() {
  const { submissionId } = useParams({ from: '/review/$submissionId' })

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-6 py-10 text-gray-900">
      <section className="mx-auto max-w-[1500px] rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h1 className="text-2xl font-bold">Review Detail</h1>
        <p className="mt-2 text-sm text-gray-600">
          제출 상세 페이지 이식 전 임시 화면입니다. ID: {submissionId}
        </p>
      </section>
    </main>
  )
}
