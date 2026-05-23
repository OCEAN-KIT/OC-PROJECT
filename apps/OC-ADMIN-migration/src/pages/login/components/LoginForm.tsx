/*
 * 로그인 입력 폼 UI입니다.
 * 이메일/비밀번호 입력, 에러 표시, 제출 버튼 렌더링을 담당하고
 * 실제 상태 변경과 로그인 요청은 useLoginForm의 계약을 통해 사용합니다.
 */
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginForm() {
  const {
    values,
    updateField,
    submitLogin,
    goToRegister,
    errorMessage,
    isSubmitting,
  } = useLoginForm()

  return (
    <>
      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form
        method="post"
        action="#"
        noValidate
        className="space-y-4"
        aria-busy={isSubmitting}
        onSubmit={(event) => {
          event.preventDefault()
          submitLogin()
        }}
      >
        <div className="space-y-2">
          <label
            htmlFor="login-id"
            className="block text-[13px] font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            id="login-id"
            name="id"
            type="text"
            value={values.id}
            onChange={(event) => updateField('id', event.target.value)}
            placeholder="get@ziontutorial.com"
            autoComplete="username"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border-0 bg-white px-4 text-[15px] ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34609E] disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="block text-[13px] font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border-0 bg-white px-4 text-[15px] ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34609E] disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#3263F1] text-[15px] font-semibold text-white shadow-md hover:brightness-105 active:translate-y-[1px]"
        >
          {isSubmitting ? '로그인 중...' : 'Log in'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={goToRegister}
          disabled={isSubmitting}
          className="text-[13px] font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900 disabled:opacity-60"
        >
          회원가입
        </button>
      </div>
    </>
  )
}
