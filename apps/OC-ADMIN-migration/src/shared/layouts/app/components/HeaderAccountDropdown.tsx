/*
 * 헤더 우측 계정 버튼과 드롭다운 메뉴를 묶는 composition 컴포넌트입니다.
 * 버튼을 눌렀을 때 메뉴가 보이는 구조 자체를 이 파일이 소유하고,
 * 메뉴 안의 실제 액션은 props로 받은 핸들러에 위임합니다.
 */
import type { RefObject } from 'react'
import { HeaderAccountButton } from './HeaderAccountButton'
import { HeaderAccountMenu } from './HeaderAccountMenu'

type HeaderAccountDropdownProps = {
  accountLabel: string
  accountMenuLabel: string
  isOpen: boolean
  buttonRef: RefObject<HTMLButtonElement | null>
  menuRef: RefObject<HTMLDivElement | null>
  onToggle: () => void
  onDashboardLinkClick: () => void
  onLogoutClick: () => void
  logoutError: string
  isLoggingOut: boolean
}

export function HeaderAccountDropdown({
  accountLabel,
  accountMenuLabel,
  isOpen,
  buttonRef,
  menuRef,
  onToggle,
  onDashboardLinkClick,
  onLogoutClick,
  logoutError,
  isLoggingOut,
}: HeaderAccountDropdownProps) {
  return (
    <div className="relative">
      <HeaderAccountButton
        accountLabel={accountLabel}
        isMenuOpen={isOpen}
        buttonRef={buttonRef}
        onClick={onToggle}
      />

      {isOpen && (
        <HeaderAccountMenu
          accountMenuLabel={accountMenuLabel}
          menuRef={menuRef}
          onDashboardLinkClick={onDashboardLinkClick}
          onLogoutClick={onLogoutClick}
          logoutError={logoutError}
          isLoggingOut={isLoggingOut}
        />
      )}
    </div>
  )
}
