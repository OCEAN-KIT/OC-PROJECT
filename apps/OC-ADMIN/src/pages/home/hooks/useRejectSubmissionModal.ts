/*
 * 제출 반려 모달의 open 상태와 대상 id 목록만 관리합니다.
 * 반려 API 호출이나 선택 상태 초기화는 action hook의 책임으로 두고,
 * 이 hook은 모달 표시 상태만 좁게 소유합니다.
 */
import { useCallback, useState } from 'react'

export type RejectReason = {
  templateCode?: string
  message: string
}

export type RejectSubmitPayload = {
  ids: string[]
  reason: RejectReason
}

export function useRejectSubmissionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [ids, setIds] = useState<string[]>([])

  const open = useCallback((nextIds: string[]) => {
    if (nextIds.length === 0) {
      return
    }

    setIds(nextIds)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setIds([])
  }, [])

  return {
    isOpen,
    ids,
    open,
    close,
  }
}
