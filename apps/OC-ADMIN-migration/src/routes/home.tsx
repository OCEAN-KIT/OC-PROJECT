/*
 * /home 경로와 HomePage를 연결하는 route 파일입니다.
 * 라우팅 설정만 담당하고, 홈 화면의 상태나 UI 조립은 pages/home 아래에 둡니다.
 */
import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/home/HomePage'

export const Route = createFileRoute('/home')({
  component: HomePage,
})
