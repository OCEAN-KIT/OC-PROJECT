import type { MouseEvent } from 'react'
import { Trash2 } from 'lucide-react'
import type { AreaItem } from '../constants'

import AreaCardContent from './components/AreaCardContent'

type Props = {
  area: AreaItem
  onRequestDelete: (area: AreaItem) => void
}

export default function AreaCard({ area, onRequestDelete }: Props) {
  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onRequestDelete(area)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group overflow-hidden">
      <div className="flex">
        <AreaCardContent area={area} />

        <div className="shrink-0 w-14 sm:w-16 border-l border-gray-100">
          <button
            type="button"
            onClick={handleDelete}
            className="h-full w-full grid place-items-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label="삭제"
            title="삭제"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
