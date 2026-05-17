/*
 * 리뷰 카드 클릭 시 상세 페이지로 이동하는 route side effect를 담당합니다.
 * 카드 UI는 openDetail 함수만 호출하고, TanStack Router 경로 조립은 이 hook에 숨깁니다.
 */
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export function useReviewCardNavigation(submissionId: string) {
  const navigate = useNavigate();

  return useCallback(
    () =>
      navigate({
        to: "/review/$submissionId",
        params: { submissionId },
      }),
    [navigate, submissionId],
  );
}
