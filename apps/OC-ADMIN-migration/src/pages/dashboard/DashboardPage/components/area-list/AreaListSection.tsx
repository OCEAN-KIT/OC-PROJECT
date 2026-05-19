import type { ReactNode } from 'react'
import { ClipLoader } from 'react-spinners'

type AreaListSectionProps = {
  isLoading: boolean
  isError: boolean
  children: ReactNode
}

export default function AreaListSection({
  isLoading,
  isError,
  children,
}: AreaListSectionProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <ClipLoader color="#2C67BC" size={40} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">데이터를 불러오지 못했습니다.</div>
      </div>
    )
  }

  return <>{children}</>
}
