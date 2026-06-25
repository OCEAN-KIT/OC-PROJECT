/*
 * 계정 메뉴를 여는 헤더 버튼 UI입니다.
 * aria 상태와 ref 연결, 아이콘/라벨 렌더링만 담당하며
 * 메뉴 열림 상태를 직접 소유하지 않습니다.
 */
import { UserRound } from 'lucide-react'
import type { RefObject } from 'react'

type HeaderAccountButtonProps = {
  accountLabel: string
  isMenuOpen: boolean
  buttonRef: RefObject<HTMLButtonElement | null>
  onClick: () => void
}

export function HeaderAccountButton({
  accountLabel,
  isMenuOpen,
  buttonRef,
  onClick,
}: HeaderAccountButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-haspopup="menu"
      aria-expanded={isMenuOpen}
      aria-label={accountLabel}
      className="inline-flex min-w-0 items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:translate-y-[1px]"
    >
      <UserRound className="h-5 w-5" aria-hidden />
      <span className="hidden max-w-48 truncate text-sm sm:inline">
        {accountLabel}
      </span>
    </button>
  )
}
