import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Camera,
  Cloud,
  Leaf,
  MapPin,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BASIC_PAYLOAD_INIT } from '@ocean-kit/dashboard-domain/types/areaBasicInfo'
import type { BasicPayload } from '@ocean-kit/dashboard-domain/types/areaBasicInfo'
import BasicInfoSection from '../components/BasicInfoSection'
import { DashboardSection } from '../components/DashboardSection'
import EnvironmentLogSection from './components/environment-log'
import type { EnvironmentLogEntry } from './components/environment-log'
import GrowthLogSection from './components/growth-log'
import type { GrowthSpeciesSection } from './components/growth-log'
import MediaLogSection from './components/MediaLogSection'
import type { MediaLogEntry } from './components/MediaLogSection'
import TransplantLogSection from './components/transplant-log'
import type { SpeciesSection } from './components/transplant-log'
import useAreaDetail from './hooks/useAreaDetail'
import useEnvironmentLogs from './hooks/useEnvironmentLogs'
import useGrowthLogs from './hooks/useGrowthLogs'
import useMediaLogs from './hooks/useMediaLogs'
import useTransplantLogs from './hooks/useTransplantLogs'
import useUpdateBasicInfo from './hooks/useUpdateBasicInfo'

type Props = {
  areaId: number
}

function SkeletonBar({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
}

function BasicInfoSectionSkeleton() {
  return (
    <DashboardSection.Root>
      <DashboardSection.Header>
        <DashboardSection.Title icon={MapPin}>
          작업영역 기본 정보
        </DashboardSection.Title>
        <SkeletonBar className="h-8 w-24" />
      </DashboardSection.Header>
      <DashboardSection.Body className="space-y-5">
        <SkeletonBar className="h-11 w-full" />
        <SkeletonBar className="h-11 w-full" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SkeletonBar className="h-11 w-full" />
          <SkeletonBar className="h-11 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <SkeletonBar className="h-11 w-full" />
          <SkeletonBar className="h-11 w-full" />
          <SkeletonBar className="h-11 w-full" />
        </div>
      </DashboardSection.Body>
    </DashboardSection.Root>
  )
}

function SectionCardSkeleton({
  icon,
  title,
  actionLabel,
  description,
}: {
  icon: LucideIcon
  title: string
  actionLabel: string
  description?: string
}) {
  return (
    <DashboardSection.Root>
      <DashboardSection.Header>
        <DashboardSection.Title icon={icon} description={description}>
          {title}
        </DashboardSection.Title>
        <div className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-400">
          {actionLabel}
        </div>
      </DashboardSection.Header>
      <DashboardSection.Body className="space-y-4">
        <SkeletonBar className="h-24 w-full" />
        <SkeletonBar className="h-24 w-full" />
      </DashboardSection.Body>
    </DashboardSection.Root>
  )
}

function SectionErrorCard({
  title,
  onRetry,
}: {
  title: string
  onRetry: () => void
}) {
  return (
    <DashboardSection.Root className="border-rose-100">
      <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50 px-6 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-rose-700">
          <TriangleAlert className="h-5 w-5" />
          {title}
        </h2>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100"
        >
          다시 시도
        </button>
      </div>
      <DashboardSection.Body className="text-sm text-rose-700">
        섹션 데이터를 불러오지 못했습니다.
      </DashboardSection.Body>
    </DashboardSection.Root>
  )
}

function DashboardDetailNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-4">
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <TriangleAlert className="mx-auto h-8 w-8 text-rose-500" />
        <h1 className="mt-4 text-lg font-semibold text-gray-900">
          작업영역 데이터를 찾을 수 없습니다.
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 rounded-lg bg-[#2C67BC] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C67BC]/90"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default function DashboardDetailPage({ areaId }: Props) {
  const navigate = useNavigate()
  const isValidAreaId = Number.isFinite(areaId) && areaId > 0

  const {
    data: basicData,
    isLoading: isBasicLoading,
    isError: isBasicError,
  } = useAreaDetail(areaId)
  const {
    data: transplantData,
    isLoading: isTransplantLoading,
    isError: isTransplantError,
    refetch: refetchTransplant,
  } = useTransplantLogs(areaId)
  const {
    data: growthData,
    isLoading: isGrowthLoading,
    isError: isGrowthError,
    refetch: refetchGrowth,
  } = useGrowthLogs(areaId)
  const {
    data: environmentData,
    isLoading: isEnvironmentLoading,
    isError: isEnvironmentError,
    refetch: refetchEnvironment,
  } = useEnvironmentLogs(areaId)
  const {
    data: mediaData,
    isLoading: isMediaLoading,
    isError: isMediaError,
    refetch: refetchMedia,
  } = useMediaLogs(areaId)
  const { mutate: updateBasic, isPending: isUpdatingBasic } =
    useUpdateBasicInfo(areaId)

  const [basicPayload, setBasicPayload] =
    useState<BasicPayload>(BASIC_PAYLOAD_INIT)
  const [transplantPayload, setTransplantPayload] = useState<SpeciesSection[]>(
    [],
  )
  const [growthPayload, setGrowthPayload] = useState<GrowthSpeciesSection[]>([])
  const [environmentPayload, setEnvironmentPayload] = useState<
    EnvironmentLogEntry[]
  >([])
  const [mediaPayload, setMediaPayload] = useState<MediaLogEntry[]>([])

  const goDashboard = () => {
    void navigate({ to: '/dashboard' })
  }

  const handleBasicChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target
    setBasicPayload((currentPayload) => ({
      ...currentPayload,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  useEffect(() => {
    if (basicData) setBasicPayload(basicData)
  }, [basicData])

  useEffect(() => {
    if (transplantData) setTransplantPayload(transplantData)
  }, [transplantData])

  useEffect(() => {
    if (growthData) setGrowthPayload(growthData)
  }, [growthData])

  useEffect(() => {
    if (environmentData) setEnvironmentPayload(environmentData)
  }, [environmentData])

  useEffect(() => {
    if (mediaData) setMediaPayload(mediaData)
  }, [mediaData])

  if (!isValidAreaId || isBasicError) {
    return <DashboardDetailNotFound onBack={goDashboard} />
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-[900px] p-4">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={goDashboard}
              className="-ml-2 rounded-lg p-2 transition-colors hover:bg-gray-200"
              aria-label="목록으로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex w-full justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                작업영역 수정
              </h1>
              <p className="self-end text-sm text-gray-500">
                작업영역의 정보를 수정합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isBasicLoading ? (
            <BasicInfoSectionSkeleton />
          ) : (
            <BasicInfoSection
              basicPayload={basicPayload}
              onBasicChange={handleBasicChange}
              onEdit={() => updateBasic(basicPayload)}
              isEditing={isUpdatingBasic}
            />
          )}

          {isTransplantLoading ? (
            <SectionCardSkeleton
              icon={Leaf}
              title="이식 현황 (종별 · 기록 누적)"
              actionLabel="종 추가"
            />
          ) : isTransplantError ? (
            <SectionErrorCard
              title="이식 현황"
              onRetry={() => {
                void refetchTransplant()
              }}
            />
          ) : (
            <TransplantLogSection
              areaId={areaId}
              transplantPayload={transplantPayload}
              onTransplantChange={setTransplantPayload}
            />
          )}

          {isGrowthLoading ? (
            <SectionCardSkeleton
              icon={TrendingUp}
              title="성장 현황 (종별 · 기록 누적)"
              actionLabel="종 추가"
              description="반드시 대표 종 한개를 선택해 주세요."
            />
          ) : isGrowthError ? (
            <SectionErrorCard
              title="성장 현황"
              onRetry={() => {
                void refetchGrowth()
              }}
            />
          ) : (
            <GrowthLogSection
              areaId={areaId}
              growthPayload={growthPayload}
              onGrowthChange={setGrowthPayload}
            />
          )}

          {isEnvironmentLoading ? (
            <SectionCardSkeleton
              icon={Cloud}
              title="환경 로그 (날짜별 기록 누적)"
              actionLabel="기록 추가"
            />
          ) : isEnvironmentError ? (
            <SectionErrorCard
              title="환경 로그"
              onRetry={() => {
                void refetchEnvironment()
              }}
            />
          ) : (
            <EnvironmentLogSection
              areaId={areaId}
              environmentPayload={environmentPayload}
              onEnvironmentChange={setEnvironmentPayload}
            />
          )}

          {isMediaLoading ? (
            <SectionCardSkeleton
              icon={Camera}
              title="미디어 등록"
              actionLabel="기록 추가"
            />
          ) : isMediaError ? (
            <SectionErrorCard
              title="미디어 등록"
              onRetry={() => {
                void refetchMedia()
              }}
            />
          ) : (
            <MediaLogSection
              areaId={areaId}
              mediaPayload={mediaPayload}
              onMediaChange={setMediaPayload}
            />
          )}
        </div>
      </div>
    </div>
  )
}
