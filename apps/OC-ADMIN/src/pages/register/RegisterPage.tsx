/*
 * 회원가입 화면의 페이지 shell입니다.
 * 입력/검증/제출 로직은 RegisterForm과 hooks에 위임합니다.
 */
import { RegisterForm } from './components/RegisterForm'

export function RegisterPage() {
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
            <p className="mt-2 text-sm text-gray-500">관리자 계정 생성</p>
          </div>

          <RegisterForm />
        </div>
      </main>
    </div>
  )
}
