import { Link } from '@tanstack/react-router'
import { Calendar, MapPin, Waves } from 'lucide-react'
import {
  habitatLabels,
  levelLabels,
  regionLabels,
  statusColors,
  statusLabels,
} from '../../constants'
import type { AreaItem } from '../../constants'

type Props = {
  area: AreaItem
}

function formatDateLabel(value: string | null) {
  return value ? value.replaceAll('-', '.') : ''
}

function getMappedValue(
  map: Partial<Record<string, string>>,
  key: string,
  fallback: string,
) {
  return map[key] ?? fallback
}

export default function AreaCardContent({ area }: Props) {
  const startDate = formatDateLabel(area.startDate)
  const endDate = formatDateLabel(area.endDate)
  const attachmentStatusClass = getMappedValue(
    statusColors,
    area.attachmentStatus,
    'bg-gray-100 text-gray-700',
  )
  const attachmentStatusLabel = getMappedValue(
    statusLabels,
    area.attachmentStatus,
    area.attachmentStatus,
  )
  const regionLabel = getMappedValue(
    regionLabels,
    area.restorationRegion,
    area.restorationRegion,
  )
  const levelLabel = getMappedValue(levelLabels, area.level, area.level)
  const habitatLabel = getMappedValue(habitatLabels, area.habitat, area.habitat)

  return (
    <Link
      to="/dashboard/$areaId"
      params={{ areaId: String(area.id) }}
      className="min-w-0 flex-1 p-5"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-[#2C67BC]/10 flex items-center justify-center">
            <Waves className="h-5 w-5 text-[#2C67BC]" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2C67BC] transition-colors truncate">
            {area.name}
          </h3>

          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
              attachmentStatusClass
            }`}
          >
            {attachmentStatusLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:grid-cols-4 xl:grid-cols-9">
        <div className="min-w-0">
          <p className="text-xs text-gray-400">지역</p>
          <p className="flex min-w-0 items-center gap-1 font-medium text-gray-900">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="truncate">{regionLabel}</span>
          </p>
        </div>

        <div className="col-span-2 min-w-0">
          <p className="text-xs text-gray-400">기간</p>
          <p
            className="flex min-w-0 items-center gap-1 font-medium text-gray-900"
            title={`${startDate}${endDate ? ` ~ ${endDate}` : ' ~'}`}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="truncate">
              {startDate}
              {endDate ? ` ~ ${endDate}` : ' ~'}
            </span>
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">단계</p>
          <p className="truncate font-medium text-gray-900">{levelLabel}</p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">서식지</p>
          <p className="truncate font-medium text-gray-900">{habitatLabel}</p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">수심</p>
          <p className="truncate font-medium text-gray-900">{area.depth}m</p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">면적</p>
          <p className="truncate font-medium text-gray-900">
            {area.areaSize.toLocaleString()}m²
          </p>
        </div>

        <div className="col-span-2 min-w-0">
          <p className="text-xs text-gray-400">좌표</p>
          <p
            className="truncate font-medium text-gray-900"
            title={`${area.lat}, ${area.lon}`}
          >
            {area.lat}, {area.lon}
          </p>
        </div>
      </div>
    </Link>
  )
}
