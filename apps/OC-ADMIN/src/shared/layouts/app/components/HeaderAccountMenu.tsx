/*
 * 계정 드롭다운의 메뉴 UI입니다.
 * 대시보드 이동, 로그아웃 버튼, 로그아웃 에러/로딩 표시를 렌더링하고
 * 실제 navigation/logout mutation은 상위에서 전달한 콜백으로 실행합니다.
 */
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, LogOut } from 'lucide-react'
import type { RefObject } from 'react'

type HeaderAccountMenuProps = {
  accountMenuLabel: string
  menuRef: RefObject<HTMLDivElement | null>
  onDashboardLinkClick: () => void
  onLogoutClick: () => void
  logoutError: string
  isLoggingOut: boolean
}

export function HeaderAccountMenu({
  accountMenuLabel,
  menuRef,
  onDashboardLinkClick,
  onLogoutClick,
  logoutError,
  isLoggingOut,
}: HeaderAccountMenuProps) {
  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="user menu"
      className="absolute right-0 z-50 mt-2 min-w-44 max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-black/5 bg-white text-gray-900 shadow-lg"
    >
      <div className="break-words px-3 py-2 text-xs text-gray-500">
        {accountMenuLabel}
      </div>
      <div className="h-px bg-gray-100" />
      <Link
        to="/dashboard"
        role="menuitem"
        onClick={onDashboardLinkClick}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
      >
        <LayoutDashboard className="h-4 w-4" />
        대시보드 관리
      </Link>
      <div className="h-px bg-gray-100" />
      {logoutError && (
        <p className="break-words px-3 py-2 text-xs text-red-600">
          {logoutError}
        </p>
      )}
      <button
        type="button"
        role="menuitem"
        onClick={onLogoutClick}
        disabled={isLoggingOut}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
      </button>
    </div>
  )
}
