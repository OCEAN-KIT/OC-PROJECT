/*
 * 여러 feature에서 공유하는 React Query key 모음입니다.
 * 로그인 성공, 헤더 사용자 정보 조회처럼 feature 경계를 넘나드는 캐시는
 * 이 shared key를 기준으로 invalidate/remove 범위를 맞춥니다.
 */
export const queryKeys = {
  myInfo: ['myInfo'] as const,
}
