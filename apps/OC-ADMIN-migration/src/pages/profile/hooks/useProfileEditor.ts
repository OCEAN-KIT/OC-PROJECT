/*
 * 프로필 화면의 편집 모드와 입력 값을 관리합니다.
 * 서버 저장은 useUpdateMyInfoMutation에 위임하고, 이 hook은 UI 상태만 소유합니다.
 */
import { useState } from 'react'
import type { MyInfoData } from '@ocean-kit/shared-auth/user'
import type { ProfileFormField, ProfileFormValues } from '../types'
import { useUpdateMyInfoMutation } from './useUpdateMyInfoMutation'

const emptyProfileForm: ProfileFormValues = {
  nickname: '',
  email: '',
  phone: '',
}

function toProfileFormValues(profile: MyInfoData): ProfileFormValues {
  return {
    nickname: profile.nickname ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
  }
}

export function useProfileEditor(profile: MyInfoData | undefined) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<ProfileFormValues>(emptyProfileForm)
  const updateMutation = useUpdateMyInfoMutation()

  const startEditing = () => {
    if (!profile) {
      return
    }

    updateMutation.reset()
    setForm(toProfileFormValues(profile))
    setIsEditing(true)
  }

  const cancelEditing = () => {
    updateMutation.reset()
    setIsEditing(false)
  }

  const updateField = (field: ProfileFormField, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveProfile = async () => {
    if (updateMutation.isPending) {
      return
    }

    try {
      await updateMutation.mutateAsync(form)
      setIsEditing(false)
    } catch {
      // mutation.error를 UI에 그대로 노출합니다.
    }
  }

  return {
    form,
    isEditing,
    isSaving: updateMutation.isPending,
    saveError:
      updateMutation.error instanceof Error ? updateMutation.error.message : '',
    startEditing,
    cancelEditing,
    updateField,
    saveProfile,
  }
}
