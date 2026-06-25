import type { MyInfoData } from '@ocean-kit/shared-auth/user'

type ProfileViewProps = {
  profile: MyInfoData
  onEditClick: () => void
}

export function ProfileView({ profile, onEditClick }: ProfileViewProps) {
  return (
    <div className="space-y-5">
      <dl className="grid gap-4 md:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-sm font-medium text-gray-500">닉네임</dt>
          <dd className="mt-1 break-words text-base font-semibold text-gray-900 [overflow-wrap:anywhere]">
            {profile.nickname ?? '-'}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm font-medium text-gray-500">이메일</dt>
          <dd className="mt-1 break-all text-base font-semibold text-gray-900">
            {profile.email ?? '-'}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm font-medium text-gray-500">전화번호</dt>
          <dd className="mt-1 break-words text-base font-semibold text-gray-900">
            {profile.phone ?? '-'}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onEditClick}
        className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 active:translate-y-[1px]"
      >
        수정하기
      </button>
    </div>
  )
}
