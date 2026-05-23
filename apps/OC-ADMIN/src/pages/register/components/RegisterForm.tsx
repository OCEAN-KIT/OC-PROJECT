/*
 * 회원가입 입력 폼 UI입니다.
 * 필드 렌더링과 submit event 처리만 담당하고 상태/검증/서버 요청은 useRegisterForm에 둡니다.
 */
import { useRegisterForm } from '../hooks/useRegisterForm'

export function RegisterForm() {
  const {
    values,
    confirmPassword,
    errorMessage,
    isSubmitting,
    isPasswordMatched,
    canSubmit,
    updateField,
    setConfirmPassword,
    submitRegister,
    goToLogin,
  } = useRegisterForm()

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
          void submitRegister()
        }}
      >
        <div className="space-y-2">
          <label
            htmlFor="register-id"
            className="block text-[13px] font-medium text-gray-700"
          >
            아이디
          </label>
          <input
            id="register-id"
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
            htmlFor="register-password"
            className="block text-[13px] font-medium text-gray-700"
          >
            비밀번호
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="new-password"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border-0 bg-white px-4 text-[15px] ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34609E] disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-confirm-password"
            className="block text-[13px] font-medium text-gray-700"
          >
            비밀번호 확인
          </label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="비밀번호를 한 번 더 입력하세요"
            autoComplete="new-password"
            disabled={isSubmitting}
            className={`h-12 w-full rounded-xl border-0 bg-white px-4 text-[15px] ring-1 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-60 ${
              confirmPassword && !isPasswordMatched
                ? 'ring-red-300 focus:ring-red-400'
                : 'ring-gray-200 focus:ring-[#34609E]'
            }`}
          />
          {confirmPassword && !isPasswordMatched && (
            <p className="text-xs text-red-600">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-email"
            className="block text-[13px] font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border-0 bg-white px-4 text-[15px] ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34609E] disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-phone"
            className="block text-[13px] font-medium text-gray-700"
          >
            전화번호
          </label>
          <input
            id="register-phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="전화번호를 입력하세요"
            autoComplete="tel"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border-0 bg-white px-4 text-[15px] ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34609E] disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-nickname"
            className="block text-[13px] font-medium text-gray-700"
          >
            닉네임
          </label>
          <input
            id="register-nickname"
            name="nickname"
            type="text"
            value={values.nickname}
            onChange={(event) => updateField('nickname', event.target.value)}
            placeholder="닉네임을 입력하세요"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border-0 bg-white px-4 text-[15px] ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34609E] disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          className={`mt-6 h-12 w-full rounded-xl text-[15px] font-semibold text-white shadow-md transition ${
            canSubmit
              ? 'bg-[#3263F1] hover:brightness-105 active:translate-y-[1px]'
              : 'cursor-not-allowed bg-[#3263F1]/50'
          }`}
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="mx-3 whitespace-nowrap text-sm text-gray-500">
            이미 계정이 있으신가요?
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={goToLogin}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            로그인으로 이동
          </button>
        </div>
      </form>
    </>
  )
}
