// src/app/profile/page.tsx
"use client";

import { updateMyInfo } from "@/api/user";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMyInfo } from "@/hooks/useMyInfo";
import { useState } from "react";

export default function ProfilePage() {
  const { data, isLoading, error, refetch } = useMyInfo();
  const { checking, isLoggedIn } = useAuthGuard({ mode: "gotoLogin" });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string>("");

  const [form, setForm] = useState({
    nickname: "",
    email: "",
    phone: "",
  });

  if (checking || !isLoggedIn) return null;

  const profile = data?.data;

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">내 정보 불러오는 중…</p>
      </div>
    );
  }

  if (error) {
    console.error("[ProfilePage] useMyInfo error:", error);
    return (
      <div className="p-6">
        <p className="text-red-600">내 정보를 불러오는 데 실패했어요.</p>
        <button
          onClick={() => refetch?.()}
          className="mt-2 rounded-md border px-3 py-1"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">표시할 프로필 정보가 없어요.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = () => {
    setForm({
      nickname: profile.nickname ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
    });
    setIsEditing(true);
    setSaveErr("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveErr("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveErr("");

      const res = await updateMyInfo(form.nickname, form.email, form.phone);
      if (!res?.success) throw new Error("update failed");

      await refetch();

      setIsEditing(false);
    } catch (e) {
      console.error("update error:", e);
      setSaveErr("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-3">
      {!isEditing ? (
        <>
          <div>
            <span className="font-semibold">nickname:</span>{" "}
            {profile.nickname ?? "-"}
          </div>
          <div>
            <span className="font-semibold">email:</span> {profile.email ?? "-"}
          </div>
          <div>
            <span className="font-semibold">phone:</span> {profile.phone ?? "-"}
          </div>
          <button
            onClick={handleEditClick}
            className="mt-3 rounded-md border px-3 py-1 hover:bg-gray-50"
          >
            수정하기
          </button>
        </>
      ) : (
        <>
          {saveErr && <p className="text-sm text-red-600">{saveErr}</p>}

          <div>
            <label className="block text-sm font-medium">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">전화번호</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-md bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 rounded-md border px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </>
      )}
    </div>
  );
}
