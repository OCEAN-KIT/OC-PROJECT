/*
 * /register 경로와 RegisterPage를 연결하는 route 파일입니다.
 * 회원가입 폼 상태와 서버 요청은 pages/register 내부에서 관리합니다.
 */
import { RegisterPage } from '#/pages/register/RegisterPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})
