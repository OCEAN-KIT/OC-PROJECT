import { useCallback, useState } from 'react'
import { ConfirmDialog } from '#/shared/components/ConfirmDialog'
import { useDeleteArea } from '../../hooks/useAreas'
import AreaCard from './AreaCard/AreaCard'
import type { AreaItem } from './constants'

type Props = {
  areas: AreaItem[]
}

export default function AreaList({ areas }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<AreaItem | null>(null)
  const { mutate: deleteArea, isPending: isDeletePending } = useDeleteArea()

  const handleRequestDelete = useCallback((area: AreaItem) => {
    setDeleteTarget(area)
  }, [])

  const handleCloseDeleteConfirm = useCallback(() => {
    if (isDeletePending) {
      return
    }

    setDeleteTarget(null)
  }, [isDeletePending])

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) {
      return
    }

    deleteArea(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    })
  }, [deleteArea, deleteTarget])

  const deleteDescription = deleteTarget
    ? `"${deleteTarget.name}" 작업구역을 삭제합니다. 삭제한 작업구역은 되돌릴 수 없습니다.`
    : '삭제할 작업구역을 선택해 주세요.'

  return (
    <>
      <div className="grid gap-4">
        {areas.length === 0 ? (
          <div className="p-10 bg-gray-50 text-center">
            <p className="text-sm text-gray-700 font-medium">
              조건에 맞는 작업영역이 없습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              검색어나 필터를 변경해 보세요.
            </p>
          </div>
        ) : (
          areas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onRequestDelete={handleRequestDelete}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="작업구역을 삭제하시겠습니까?"
        description={deleteDescription}
        confirmLabel="삭제"
        cancelLabel="취소"
        loading={isDeletePending}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteConfirm}
      />
    </>
  )
}
