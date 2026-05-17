/*
 * / 경로의 진입 정책을 담당하는 route 파일입니다.
 * 루트 화면을 별도로 렌더링하지 않고 beforeLoad에서 /home으로 이동시켜
 * 첫 진입 경로를 명확하게 고정합니다.
 */
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/home' })
  },
})
