import { Outlet } from '@tanstack/react-router'

export function AppFrame() {
  return (
    <div
      className="min-h-screen bg-black/5 text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900"
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="mx-auto min-h-screen max-w-[420px] bg-white shadow-sm">
        <Outlet />
      </div>
    </div>
  )
}
