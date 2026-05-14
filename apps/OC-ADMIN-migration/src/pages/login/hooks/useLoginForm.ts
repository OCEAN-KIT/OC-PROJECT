import { useState } from 'react'
import type { LoginFormField, LoginFormValues } from '../types'
import { useLoginMutation } from './useLoginMutation'

const initialLoginFormValues: LoginFormValues = {
  id: '',
  password: '',
}

export function useLoginForm() {
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

  return {
    values,
    updateField,
    submitLogin,
    errorMessage:
      loginMutation.error instanceof Error ? loginMutation.error.message : '',
    isSubmitting: loginMutation.isPending,
  }
}
