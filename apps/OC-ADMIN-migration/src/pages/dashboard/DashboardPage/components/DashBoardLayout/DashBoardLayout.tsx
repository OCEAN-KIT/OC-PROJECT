import type { ReactNode } from 'react'

type DashBoardLayoutProps = {
  children: ReactNode
}

export default function DashBoardLayout({ children }: DashBoardLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-[1500px] p-4">{children}</div>
    </div>
  )
}
