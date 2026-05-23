'use client'

import { useState } from 'react'
import { Cloud, Plus, ChevronUp } from 'lucide-react'
import { DashboardSection } from '#/pages/dashboard/components/DashboardSection'
import type { EnvironmentLogEntry } from './constants'
import EnvironmentLogList from './EnvironmentLogList'

export type { EnvironmentLogEntry } from './constants'

type Props = {
  areaId: number
  environmentPayload: EnvironmentLogEntry[]
  onEnvironmentChange: (_entries: EnvironmentLogEntry[]) => void
}

export default function EnvironmentLogSection({
  areaId,
  environmentPayload,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <DashboardSection.Root>
      <DashboardSection.Header>
        <DashboardSection.Title icon={Cloud}>
          환경 로그 (날짜별 기록 누적)
        </DashboardSection.Title>
        <DashboardSection.Action>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
          >
            {showAddForm ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            기록 추가
          </button>
        </DashboardSection.Action>
      </DashboardSection.Header>

      <EnvironmentLogList
        areaId={areaId}
        entries={environmentPayload}
        showAddForm={showAddForm}
        onShowAddForm={() => setShowAddForm(true)}
        onCloseAddForm={() => setShowAddForm(false)}
      />
    </DashboardSection.Root>
  )
}
