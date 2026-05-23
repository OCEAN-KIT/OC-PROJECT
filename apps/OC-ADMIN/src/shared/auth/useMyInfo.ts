/*
 * 현재 로그인한 관리자 정보를 읽는 shared query hook입니다.
 * 헤더와 프로필처럼 feature 경계를 넘는 사용자 캐시는 같은 query key를 공유합니다.
 */
import axiosInstance from '@ocean-kit/shared-axios/axiosInstance'
import { myInfo } from '@ocean-kit/shared-auth/user'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '#/shared/query/queryKeys'

export function useMyInfo() {
  return useQuery({
    queryKey: queryKeys.myInfo,
    queryFn: () => myInfo(axiosInstance),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
