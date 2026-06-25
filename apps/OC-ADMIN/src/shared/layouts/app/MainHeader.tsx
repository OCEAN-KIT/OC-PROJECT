/*
 * 앱 공통 헤더의 조립 컴포넌트입니다.
 * 헤더 UI의 큰 배치만 담당하고, 계정 메뉴 상태/사용자 라벨/액션 처리는
 * 각각 전용 hook과 HeaderAccountDropdown에 위임합니다.
 */
import { Link } from '@tanstack/react-router'
import { HeaderAccountDropdown } from './components/HeaderAccountDropdown'
import { useHeaderAccountMenu } from './hooks/useHeaderAccountMenu'
import { useMainHeaderActions } from './hooks/useMainHeaderActions'
import { useMainHeaderUser } from './hooks/useMainHeaderUser'

export function MainHeader() {
  const accountMenu = useHeaderAccountMenu()
  const headerUser = useMainHeaderUser()
  const headerActions = useMainHeaderActions({
    closeMenu: accountMenu.closeMenu,
  })

  return (
    <header className="w-full bg-[#2C67BC] text-white">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4">
        <Link
          to="/home"
          className="shrink-0 text-3xl font-extrabold tracking-tight"
        >
          OceanCampus
        </Link>

        <HeaderAccountDropdown
          accountLabel={headerUser.accountLabel}
          accountMenuLabel={headerUser.accountMenuLabel}
          isOpen={accountMenu.isOpen}
          buttonRef={accountMenu.anchorRef}
          menuRef={accountMenu.menuRef}
          onToggle={accountMenu.toggleMenu}
          onDashboardLinkClick={accountMenu.closeMenu}
          onLogoutClick={headerActions.handleLogoutClick}
          logoutError={headerActions.logoutError}
          isLoggingOut={headerActions.isLoggingOut}
        />
      </div>
    </header>
  )
}
