import type { RegisterFormValues } from '../types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LETTER_PATTERN = /[a-zA-Z]/
const NUMBER_PATTERN = /[0-9]/
const PHONE_PATTERN = /^[0-9]+$/

export function validateRegisterForm(
  values: RegisterFormValues,
): string | null {
  const id = values.id.trim()
  const password = values.password.trim()
  const email = values.email.trim()
  const phone = values.phone.trim()
  const nickname = values.nickname.trim()

  if (!id) {
    return '아이디를 입력하세요.'
  }

  if (id.length > 20) {
    return '아이디는 20자 이내여야 합니다.'
  }

  if (password.length < 8) {
    return '비밀번호는 최소 8자 이상이어야 합니다.'
  }

  if (!LETTER_PATTERN.test(password)) {
    return '비밀번호에 영문이 포함되어야 합니다.'
  }

  if (!NUMBER_PATTERN.test(password)) {
    return '비밀번호에 숫자가 포함되어야 합니다.'
  }

  if (!EMAIL_PATTERN.test(email)) {
    return '올바른 이메일 형식이 아닙니다.'
  }

  if (phone.length < 10) {
    return '전화번호를 입력하세요.'
  }

  if (!PHONE_PATTERN.test(phone)) {
    return '전화번호는 숫자만 입력 가능합니다.'
  }

  if (!nickname) {
    return '닉네임을 입력하세요.'
  }

  return null
}
