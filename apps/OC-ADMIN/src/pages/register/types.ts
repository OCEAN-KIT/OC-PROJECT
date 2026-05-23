export type RegisterFormValues = {
  id: string
  password: string
  email: string
  phone: string
  nickname: string
}

export type RegisterFormField = keyof RegisterFormValues
