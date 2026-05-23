import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { AreaItem } from '../constants'

import { useDeleteArea } from '../../../hooks/useAreas'
import AreaCardContent from './components/AreaCardContent'

type Props = {
  area: AreaItem
}

export default function AreaCard({ area }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { mutate: deleteArea, isPending } = useDeleteArea()

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setConfirmOpen(true)
  }

  const handleConfirm = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    deleteArea(area.id, {
      onSettled: () => setConfirmOpen(false),
    })
  }

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setConfirmOpen(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group overflow-hidden">
      <div className="flex">
        <AreaCardContent area={area} />

        <div className="shrink-0 w-14 sm:w-16 border-l border-gray-100">
          {confirmOpen ? (
            <div
              className="h-full p-2 flex flex-col gap-2 justify-center bg-gray-50"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              role="presentation"
            >
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="w-full px-2 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isPending ? '...' : '확인'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="w-full px-2 py-2 rounded-lg text-xs font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              className="h-full w-full grid place-items-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="삭제"
              title="삭제"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
