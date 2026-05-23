/*
 * 로그인 feature 내부에서 공유하는 폼 타입입니다.
 * 필드 이름을 LoginFormValues에서 파생해 input 업데이트 시
 * 문자열 key가 코드 곳곳에 흩어지는 일을 줄입니다.
 */
export type LoginFormValues = {
  id: string
  password: string
}

export type LoginFormField = keyof LoginFormValues
