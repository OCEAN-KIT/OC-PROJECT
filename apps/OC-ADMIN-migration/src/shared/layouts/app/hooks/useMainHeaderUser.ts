/*
 * MainHeader에 표시할 사용자 라벨을 준비합니다.
 * myInfo query를 통해 닉네임을 읽고, 로딩/비로그인 상태까지 포함해
 * 헤더 UI가 바로 사용할 문자열로 변환합니다.
 */
import axiosInstance from '@ocean-kit/shared-axios/axiosInstance'
import { myInfo } from '@ocean-kit/shared-auth/user'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '#/shared/query/queryKeys'

export function useMainHeaderUser() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.myInfo,
    queryFn: () => myInfo(axiosInstance),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const nickname = data?.data.nickname
  const accountLabel = isLoading ? '로그인' : nickname ?? '내 계정'
  const accountMenuLabel = nickname ? `${nickname} 님` : '로그인 필요'

  return {
    accountLabel,
    accountMenuLabel,
  }
}
