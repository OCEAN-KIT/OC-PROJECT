/*
 * 헤더 계정 드롭다운의 열림/닫힘 상태를 관리합니다.
 * 버튼 ref와 메뉴 ref를 함께 소유해서 외부 클릭과 Escape 닫기 처리를
 * UI 컴포넌트 밖으로 분리합니다.
 */
import { useEffect, useRef, useState } from 'react'

export function useHeaderAccountMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as Node
      const menuElement = menuRef.current
      const anchorElement = anchorRef.current

      if (menuElement === null || anchorElement === null) {
        return
      }

      if (!menuElement.contains(target) && !anchorElement.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)

    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)

    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [isOpen])

  return {
    isOpen,
    anchorRef,
    menuRef,
    toggleMenu,
    closeMenu,
  }
}
