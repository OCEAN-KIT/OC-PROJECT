/*
 * 로그인 화면의 페이지 shell입니다.
 * 배경, 카드, 브랜드 영역 같은 화면 골격만 담당하고
 * 입력 상태와 제출 로직은 LoginForm/useLoginForm 쪽으로 분리합니다.
 */
import { LoginForm } from './components/LoginForm'

export function LoginPage() {
  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-gray-50 px-4 py-10 text-gray-900"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <main className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-100 bg-white/80 px-8 py-10 shadow-xl backdrop-blur">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">
              OceanCampus
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              OceanCampus 관리자 페이지 입니다
            </p>
          </div>

          <LoginForm />
        </div>
      </main>
    </div>
  )
}
