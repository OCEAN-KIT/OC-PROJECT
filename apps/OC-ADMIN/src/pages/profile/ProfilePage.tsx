/*
 * 관리자 프로필 화면입니다.
 * 사용자 정보 query는 shared hook을 쓰고, 편집 상태와 저장 mutation은 profile feature에 둡니다.
 */
import { LoadingSpinner } from '#/shared/components/LoadingSpinner'
import { useMyInfo } from '#/shared/auth/useMyInfo'
import { ProfileEditForm } from './components/ProfileEditForm'
import { ProfileView } from './components/ProfileView'
import { useProfileEditor } from './hooks/useProfileEditor'
// import { useAuthGuard } from './hooks/useAuthGuard'

export function ProfilePage() {
  const { data, isLoading, error, refetch } = useMyInfo()
  // const { checking, isLoggedIn } = useAuthGuard({ mode: "gotoLogin" });
  const profile = data?.data
  const editor = useProfileEditor(profile)

  // if (checking || !isLoggedIn) return null;

  if (isLoading) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3 text-sm text-gray-500">
          <LoadingSpinner size={18} />내 정보 불러오는 중...
        </div>
      </main>
    )
  }

  if (error) {
    console.error('[ProfilePage] useMyInfo error:', error)

    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-8">
        <section className="mx-auto max-w-3xl rounded-lg border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-600">
            내 정보를 불러오는 데 실패했어요.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
          >
            다시 시도
          </button>
        </section>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-8">
        <section className="mx-auto max-w-3xl rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">표시할 프로필 정보가 없어요.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-8 text-gray-900">
      <section className="mx-auto max-w-3xl rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">프로필</h1>
          <p className="mt-1 text-sm text-gray-500">관리자 계정 정보</p>
        </div>

        {editor.isEditing ? (
          <ProfileEditForm
            form={editor.form}
            saveError={editor.saveError}
            isSaving={editor.isSaving}
            onFieldChange={editor.updateField}
            onSubmit={editor.saveProfile}
            onCancel={editor.cancelEditing}
          />
        ) : (
          <ProfileView profile={profile} onEditClick={editor.startEditing} />
        )}
      </section>
    </main>
  )
}
