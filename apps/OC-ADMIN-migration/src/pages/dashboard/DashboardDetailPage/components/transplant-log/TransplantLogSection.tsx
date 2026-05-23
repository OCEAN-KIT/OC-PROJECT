'use client'

import { useState } from 'react'
import { Leaf, Plus, ChevronUp } from 'lucide-react'
import type { TransplantLogPayload } from '@ocean-kit/dashboard-domain/types/areaLogPayloads'
import { usePostTransplantLog } from '../../hooks/useTransplantLogMutations'
import { useSpecies } from '#/pages/dashboard/hooks/useSpecies'
import { DashboardSection } from '#/pages/dashboard/components/DashboardSection'
import { transplantMethods, EMPTY_FORM } from './constants'
import type { TransplantLogEntry, SpeciesSection } from './constants'
import TransplantLogList from './TransplantLogList'

export type { SpeciesSection } from './constants'

type Props = {
  areaId: number
  transplantPayload: SpeciesSection[]
  onTransplantChange: (sections: SpeciesSection[]) => void
}

export default function TransplantLogSection({
  areaId,
  transplantPayload,
  onTransplantChange,
}: Props) {
  const { mutate: postLog } = usePostTransplantLog(areaId)
  const { data: speciesList = [] } = useSpecies()
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState<TransplantLogPayload>({ ...EMPTY_FORM })

  const setField = <TKey extends keyof TransplantLogPayload>(
    key: TKey,
    value: TransplantLogPayload[TKey],
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  // ── 종 추가 (첫 기록까지 한번에) ──

  const handleAddSpeciesWithFirstLog = () => {
    const sp = speciesList.find((s) => s.id === form.speciesId)
    const m = transplantMethods.find((x) => x.value === form.method)
    if (!sp || !m || !form.recordDate || !form.attachmentStatus) return
    if (transplantPayload.some((s) => s.speciesId === sp.id)) return

    const entry: TransplantLogEntry = {
      ...form,
      id: Date.now(),
      methodLabel: m.label,
      unit: m.unit,
    }

    onTransplantChange([
      ...transplantPayload,
      { speciesId: sp.id, speciesName: sp.name, logs: [entry] },
    ])
    postLog(form)

    setShowAddForm(false)
    setForm({ ...EMPTY_FORM })
  }

  return (
    <DashboardSection.Root>
      <DashboardSection.Header>
        <DashboardSection.Title icon={Leaf}>
          이식 현황 (종별 · 기록 누적)
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

      <TransplantLogList
        areaId={areaId}
        sections={transplantPayload}
        showAddForm={showAddForm}
        onShowAddForm={() => {
          setShowAddForm(true)
          setForm({ ...EMPTY_FORM })
        }}
        form={form}
        onFieldChange={setField}
        onSaveNewSpecies={handleAddSpeciesWithFirstLog}
        onCancelAddForm={() => setShowAddForm(false)}
      />
    </DashboardSection.Root>
  )
}
