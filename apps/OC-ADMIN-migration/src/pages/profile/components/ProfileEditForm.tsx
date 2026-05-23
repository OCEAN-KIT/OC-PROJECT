import type { FormEvent } from 'react'
import type { ProfileFormField, ProfileFormValues } from '../types'

type ProfileEditFormProps = {
  form: ProfileFormValues
  saveError: string
  isSaving: boolean
  onFieldChange: (field: ProfileFormField, value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

export function ProfileEditForm({
  form,
  saveError,
  isSaving,
  onFieldChange,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="space-y-4" aria-busy={isSaving} onSubmit={handleSubmit}>
      {saveError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {saveError}
        </p>
      )}

      <div>
        <label
          htmlFor="profile-nickname"
          className="block text-sm font-medium text-gray-700"
        >
          닉네임
        </label>
        <input
          id="profile-nickname"
          type="text"
          value={form.nickname}
          onChange={(event) => onFieldChange('nickname', event.target.value)}
          disabled={isSaving}
          className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm text-gray-900 focus:border-[#34609E] focus:outline-none focus:ring-2 focus:ring-[#34609E]/20 disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="profile-email"
          className="block text-sm font-medium text-gray-700"
        >
          이메일
        </label>
        <input
          id="profile-email"
          type="email"
          value={form.email}
          onChange={(event) => onFieldChange('email', event.target.value)}
          disabled={isSaving}
          className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm text-gray-900 focus:border-[#34609E] focus:outline-none focus:ring-2 focus:ring-[#34609E]/20 disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="profile-phone"
          className="block text-sm font-medium text-gray-700"
        >
          전화번호
        </label>
        <input
          id="profile-phone"
          type="text"
          value={form.phone}
          onChange={(event) => onFieldChange('phone', event.target.value)}
          disabled={isSaving}
          className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm text-gray-900 focus:border-[#34609E] focus:outline-none focus:ring-2 focus:ring-[#34609E]/20 disabled:opacity-60"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 rounded-md bg-[#3263F1] px-3 py-2 text-sm font-semibold text-white hover:brightness-105 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          취소
        </button>
      </div>
    </form>
  )
}
