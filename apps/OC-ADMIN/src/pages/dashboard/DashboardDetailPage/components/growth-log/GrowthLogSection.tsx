'use client'

import { useState } from 'react'
import { TrendingUp, Plus, ChevronUp } from 'lucide-react'
import type { GrowthLogPayload } from '@ocean-kit/dashboard-domain/types/areaLogPayloads'
import {
  usePostGrowthLog,
  usePatchRepresentativeSpecies,
} from '../../hooks/useGrowthLogMutations'
import { useRepresentativeSpecies } from '../../hooks/useGrowthLogs'
import { useSpecies } from '#/pages/dashboard/hooks/useSpecies'
import { DashboardSection } from '#/pages/dashboard/components/DashboardSection'
import { EMPTY_FORM } from './constants'
import type {
  GrowthLogEntry,
  GrowthSpeciesSection,
} from '../../types/growthLogs'
import GrowthLogList from './GrowthLogList'

export type { GrowthSpeciesSection } from '../../types/growthLogs'

type Props = {
  areaId: number
  growthPayload: GrowthSpeciesSection[]
  onGrowthChange: (_sections: GrowthSpeciesSection[]) => void
}

export default function GrowthLogSection({
  areaId,
  growthPayload,
  onGrowthChange,
}: Props) {
  const { mutate: postLog } = usePostGrowthLog(areaId)
  const { mutate: patchRepresentativeSpecies } =
    usePatchRepresentativeSpecies(areaId)
  const { data: representativeSpecies } = useRepresentativeSpecies(areaId)
  const { data: speciesList = [] } = useSpecies()
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState<GrowthLogPayload>({ ...EMPTY_FORM })

  const setField = <TKey extends keyof GrowthLogPayload>(
    key: TKey,
    value: GrowthLogPayload[TKey],
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  // ── 종 추가 (첫 기록까지 한번에) ──

  const handleAddSpeciesWithFirstLog = () => {
    const sp = speciesList.find((s) => s.id === form.speciesId)
    if (!sp || !form.recordDate || !form.status) return
    if (growthPayload.some((s) => s.speciesId === sp.id)) return

    const entry: GrowthLogEntry = {
      ...form,
      id: Date.now(),
    }

    onGrowthChange([
      ...growthPayload,
      { speciesId: sp.id, speciesName: sp.name, logs: [entry] },
    ])
    postLog(form)

    setShowAddForm(false)
    setForm({ ...EMPTY_FORM })
  }

  // ── 대표종 토글 ──

  const handleToggleRepresentative = (targetSpeciesId: number) => {
    // 같은 종이면 해제, 다른 종이면 새로 설정
    if (representativeSpecies?.speciesId === targetSpeciesId) {
      patchRepresentativeSpecies(null)
    } else {
      patchRepresentativeSpecies(targetSpeciesId)
    }
  }

  return (
    <DashboardSection.Root>
      <DashboardSection.Header>
        <DashboardSection.Title
          icon={TrendingUp}
          description="반드시 대표 종 한개를 선택해 주세요."
        >
          성장 현황 (종별 · 기록 누적)
        </DashboardSection.Title>
        <DashboardSection.Action>
          <button
            type="button"
            onClick={() => {
              setShowAddForm((v) => !v)
              setForm({ ...EMPTY_FORM })
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
          >
            {showAddForm ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            종 추가
          </button>
        </DashboardSection.Action>
      </DashboardSection.Header>

      <GrowthLogList
        areaId={areaId}
        sections={growthPayload}
        representativeSpeciesId={representativeSpecies?.speciesId ?? null}
        showAddForm={showAddForm}
        onShowAddForm={() => {
          setShowAddForm(true)
          setForm({ ...EMPTY_FORM })
        }}
        form={form}
        onFieldChange={setField}
        onSaveNewSpecies={handleAddSpeciesWithFirstLog}
        onCancelAddForm={() => setShowAddForm(false)}
        onToggleRepresentative={handleToggleRepresentative}
      />
    </DashboardSection.Root>
  )
}
