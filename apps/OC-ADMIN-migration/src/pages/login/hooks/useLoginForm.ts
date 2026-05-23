/*
 * 로그인 폼의 입력 상태와 제출 의도를 관리하는 form hook입니다.
 * UI는 values/updateField/submitLogin만 알면 되게 만들고,
 * 실제 인증 요청과 라우팅은 useLoginMutation에 위임합니다.
 */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { LoginFormField, LoginFormValues } from '../types'
import { useLoginMutation } from './useLoginMutation'

const initialLoginFormValues: LoginFormValues = {
  id: '',
  password: '',
}

export function useLoginForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<LoginFormValues>(initialLoginFormValues)
  const loginMutation = useLoginMutation()

  const updateField = (field: LoginFormField, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const submitLogin = () => {
    if (loginMutation.isPending) {
      return
    }

    loginMutation.mutate(values)
  }

  const goToRegister = () => {
    void navigate({ to: '/register' })
  }

  return {
    values,
    updateField,
    submitLogin,
    goToRegister,
    errorMessage:
      loginMutation.error instanceof Error ? loginMutation.error.message : '',
    isSubmitting: loginMutation.isPending,
  }
}
