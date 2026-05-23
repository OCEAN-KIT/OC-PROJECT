/*
 * 회원가입 폼의 입력 상태, 클라이언트 검증, 제출 의도를 관리합니다.
 * 실제 인증 API 호출과 성공 후 라우팅은 useRegisterMutation에 위임합니다.
 */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { RegisterFormField, RegisterFormValues } from '../types'
import { validateRegisterForm } from '../validation/register'
import { useRegisterMutation } from './useRegisterMutation'

const initialRegisterFormValues: RegisterFormValues = {
  id: '',
  password: '',
  email: '',
  phone: '',
  nickname: '',
}

export function useRegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()
  const [values, setValues] = useState<RegisterFormValues>(
    initialRegisterFormValues,
  )
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const updateField = (field: RegisterFormField, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isAllFilled = Boolean(
    values.id.trim() &&
    values.password.trim() &&
    confirmPassword.trim() &&
    values.email.trim() &&
    values.phone.trim() &&
    values.nickname.trim(),
  )

  const isPasswordMatched =
    !confirmPassword || values.password === confirmPassword

  const canSubmit =
    isAllFilled && isPasswordMatched && !registerMutation.isPending

  const submitRegister = async () => {
    if (registerMutation.isPending) {
      return
    }

    if (values.password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    const validationMessage = validateRegisterForm(values)
    if (validationMessage) {
      setErrorMessage(validationMessage)
      return
    }

    try {
      setErrorMessage('')
      await registerMutation.mutateAsync(values)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage('회원가입 중 오류가 발생했습니다.')
    }
  }

  const goToLogin = () => {
    void navigate({ to: '/login' })
  }

  return {
    values,
    confirmPassword,
    errorMessage,
    isSubmitting: registerMutation.isPending,
    isPasswordMatched,
    canSubmit,
    updateField,
    setConfirmPassword,
    submitRegister,
    goToLogin,
  }
}
