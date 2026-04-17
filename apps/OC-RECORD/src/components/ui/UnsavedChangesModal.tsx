"use client";

import { Save } from "lucide-react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onKeepEditing: () => void;
  onSaveAndLeave: () => void;
  onLeaveWithoutSave: () => void;
  disabled?: boolean;
};

export default function UnsavedChangesModal({
  isOpen,
  onCancel,
  onKeepEditing,
  onSaveAndLeave,
  onLeaveWithoutSave,
  disabled = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0 z-[100] bg-black/45"
        aria-label="모달 닫기"
      />
      <section className="relative z-[101] w-[min(92vw,24rem)] max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-lg p-1 text-gray-500 hover:bg-gray-100"
          aria-label="모달 닫기"
        >
          ×
        </button>

        <h2 className="mb-2 text-[17px] font-semibold text-gray-900">
          변경사항이 있습니다
        </h2>
        <p className="text-sm text-gray-600 leading-6 break-words">
          작성 중인 내용이 변경되어 있습니다. 임시저장 후 나가시겠습니까?
        </p>

        <div className="mt-6 grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={onSaveAndLeave}
            disabled={disabled}
            className="h-11 rounded-xl bg-[#2F80ED] text-white font-semibold text-sm flex items-center justify-center gap-1.5 hover:brightness-105 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            임시저장 후 나가기
          </button>
          <button
            type="button"
            onClick={onLeaveWithoutSave}
            disabled={disabled}
            className="h-11 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
          >
            임시저장 없이 나가기
          </button>
          <button
            type="button"
            onClick={onKeepEditing}
            className="h-11 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200 active:translate-y-px"
          >
            계속 작성
          </button>
        </div>
      </section>
    </div>
  );
}
