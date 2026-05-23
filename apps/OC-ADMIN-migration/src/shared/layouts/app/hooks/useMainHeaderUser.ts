/*
 * MainHeader에 표시할 사용자 라벨을 준비합니다.
 * myInfo query를 통해 닉네임을 읽고, 로딩/비로그인 상태까지 포함해
 * 헤더 UI가 바로 사용할 문자열로 변환합니다.
 */
import { useMyInfo } from '#/shared/auth/useMyInfo'

export function useMainHeaderUser() {
  const { data, isLoading } = useMyInfo()

  const nickname = data?.data.nickname
  const accountLabel = isLoading ? '로그인' : (nickname ?? '내 계정')
  const accountMenuLabel = nickname ? `${nickname} 님` : '로그인 필요'

  return {
    accountLabel,
    accountMenuLabel,
  }
}
