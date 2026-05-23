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

export default function AreaCardContent({ area }: Props) {
  return (
    <Link
      to="/dashboard/$areaId"
      params={{ areaId: String(area.id) }}
      className="flex-1 p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-[#2C67BC]/10 flex items-center justify-center">
            <Waves className="h-5 w-5 text-[#2C67BC]" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2C67BC] transition-colors truncate">
            {area.name}
          </h3>

          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
              statusColors[area.attachmentStatus]
            }`}
          >
            {statusLabels[area.attachmentStatus]}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-y-3 gap-x-4 text-sm sm:grid-cols-4 lg:grid-cols-7">
        <div>
          <p className="text-xs text-gray-400">지역</p>
          <p className="font-medium text-gray-900 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {regionLabels[area.restorationRegion]}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">기간</p>
          <p className="font-medium text-gray-900 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {area.startDate[0]}.{area.startDate[1]}.{area.startDate[2]}
            {area.endDate
              ? ` ~ ${area.endDate[0]}.${area.endDate[1]}.${area.endDate[2]}`
              : ' ~'}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">단계</p>
          <p className="font-medium text-gray-900">{levelLabels[area.level]}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">서식지</p>
          <p className="font-medium text-gray-900">
            {habitatLabels[area.habitat]}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">수심</p>
          <p className="font-medium text-gray-900">{area.depth}m</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">면적</p>
          <p className="font-medium text-gray-900">
            {area.areaSize.toLocaleString()}m²
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">좌표</p>
          <p className="font-medium text-gray-900">
            {area.lat}, {area.lon}
          </p>
        </div>
      </div>
    </Link>
  )
}
