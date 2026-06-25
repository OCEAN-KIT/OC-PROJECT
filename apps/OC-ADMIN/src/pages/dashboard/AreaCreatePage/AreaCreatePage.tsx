import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { BASIC_PAYLOAD_INIT } from '@ocean-kit/dashboard-domain/types/areaBasicInfo'
import type { BasicPayload } from '@ocean-kit/dashboard-domain/types/areaBasicInfo'
import { LoadingSpinner } from '#/shared/components/LoadingSpinner'
import BasicInfoSection from '../components/BasicInfoSection'
import usePostBasicInfo from './hooks/usePostBasicInfo'

export default function AreaCreatePage() {
  const navigate = useNavigate()
  const { mutate, isPending } = usePostBasicInfo()
  const [basicPayload, setBasicPayload] =
    useState<BasicPayload>(BASIC_PAYLOAD_INIT)

  const handleBasicChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target
    setBasicPayload((currentPayload) => ({
      ...currentPayload,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }))
  }

  const isValid =
    basicPayload.name.trim() !== '' &&
    basicPayload.restorationRegion !== '' &&
    basicPayload.startDate !== '' &&
    basicPayload.habitat !== '' &&
    basicPayload.level !== '' &&
    basicPayload.attachmentStatus !== '' &&
    basicPayload.depth > 0 &&
    basicPayload.areaSize > 0 &&
    basicPayload.lat !== 0 &&
    basicPayload.lon !== 0

  const handleSubmit = () => {
    mutate(basicPayload, {
      onSuccess: (response) => {
        void navigate({
          to: '/dashboard/$areaId',
          params: { areaId: String(response.data.id) },
          replace: true,
        })
      },
    })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-[900px] p-4">
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => {
                void navigate({ to: '/dashboard' })
              }}
              className="-ml-2 rounded-lg p-2 transition-colors hover:bg-gray-200"
              aria-label="목록으로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex min-w-0 flex-1 flex-wrap justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                새 작업영역 추가
              </h1>
              <p className="min-w-0 break-words text-sm text-gray-500">
                해양 생태 복원 프로젝트의 새로운 작업영역을 등록합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BasicInfoSection
            basicPayload={basicPayload}
            onBasicChange={handleBasicChange}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={isPending || !isValid}
            >
              {isPending ? (
                <LoadingSpinner size={20} color="#FFFFFF" />
              ) : (
                '다음단계'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
