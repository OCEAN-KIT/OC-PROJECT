"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useFormContext } from "react-hook-form";

import { useCreateSubmission } from "@/hooks/useCreateSubmission";
import { validateSubmission } from "@/utils/validateSubmission";

import WorkTypeSelector from "@/components/dive-create/common-section/WorkTypeSelector";
import DetailsInput from "@/components/dive-create/common-section/DetailsInput";
import MediaUploadSection from "@/components/dive-create/common-section/MediaUploadSection";
import WorkTypeSection from "@/components/dive-create/WorkTypeSection";
import CommonWrapper from "@/components/dive-create/common-section/CommonWrapper";
import UnsavedChangesModal from "@/components/ui/UnsavedChangesModal";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useIsLoggined } from "@/hooks/useIsLoggined";
import { useDiveDraft } from "@/hooks/useDiveDraft";
import type { SubmissionFormValues } from "./DiveFormProvider";

export default function DiveCreateContent() {
  const router = useRouter();
  const isLoggedIn = useIsLoggined();
  const { getValues, setValue, reset, control } =
    useFormContext<SubmissionFormValues>();

  // ========= 디바이스 =========
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // ========= 첨부(사진/영상) =========
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const {
    currentForm,
    currentDetails,
    isExitConfirmOpen,
    handleSaveDraft,
    handleBack,
    handleKeepEditing,
    handleLeaveWithoutSave,
    handleSaveAndLeave,
  } = useDiveDraft({
    getValues,
    reset,
    control,
    attachments,
  });

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const next = [...attachments, ...files].slice(0, 10);
    setAttachments(next);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeOne = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  // ========= 유효성 검증 에러 =========
  const [validationError, setValidationError] = useState<string | null>(null);
  useEffect(() => {
    if (validationError) setValidationError(null);
  }, [currentForm, currentDetails]);

  // ========= Date/Time Picker refs + helpers =========
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  const openDatePicker = () => {
    const el = dateInputRef.current;
    if (el && typeof el.showPicker === "function") el.showPicker();
    else {
      const v = prompt("날짜 (YYYY-MM-DD)", getValues("basic.date"));
      if (v) setValue("basic.date", v);
    }
  };

  const openTimePicker = () => {
    const el = timeInputRef.current;
    if (el && typeof el.showPicker === "function") el.showPicker();
    else {
      const v = prompt("시간 (HH:MM)", getValues("basic.time"));
      if (v) setValue("basic.time", v);
    }
  };

  // ========= 제출 =========
  const { mutate: submitMutation, isPending: loading } = useCreateSubmission();
  const isOnline = useOnlineStatus();
  const isSubmitDisabled = loading || !isOnline || !isLoggedIn;
  const submitDisabledMessages = [
    !isOnline ? "오프라인 상태에선 제출 불가합니다." : null,
    !isLoggedIn ? "로그인 후 제출해주세요." : null,
  ].filter((message): message is string => Boolean(message));

  const handleSubmit = () => {
    if (!isOnline) {
      alert("오프라인 상태에선 제출 불가합니다.");
      return;
    }

    if (!isLoggedIn) {
      alert("로그인 후 제출해주세요.");
      return;
    }

    const values = getValues();
    const { details: submitDetails, ...formValues } = values;

    const error = validateSubmission(formValues, submitDetails);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    submitMutation(
      {
        form: formValues,
        details: submitDetails,
        files: attachments,
      },
      {
        onSuccess: () => {
          alert("제출이 완료되었습니다.");
          router.push("/");
        },
        onError: (err) => {
          alert(err.message || "제출 중 오류가 발생했습니다.");
        },
      },
    );
  };

  return (
    <div className="relative min-h-dvh ">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-105 px-4 h-14 flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl p-1.5 hover:bg-gray-100 active:scale-[0.98] transition"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-[16px] font-semibold tracking-tight">
            활동 제출
          </h1>
        </div>
      </header>

      <UnsavedChangesModal
        isOpen={isExitConfirmOpen}
        onCancel={handleKeepEditing}
        onKeepEditing={handleKeepEditing}
        onSaveAndLeave={handleSaveAndLeave}
        onLeaveWithoutSave={handleLeaveWithoutSave}
        disabled={loading}
      />

      <main className="mx-auto max-w-105 px-4 pt-4 pb-40 space-y-4">
        <CommonWrapper
          isMobile={isMobile}
          openDatePicker={openDatePicker}
          openTimePicker={openTimePicker}
          dateInputRef={dateInputRef}
          timeInputRef={timeInputRef}
        />

        <WorkTypeSelector />

        <WorkTypeSection />

        <DetailsInput />

        <MediaUploadSection
          attachments={attachments}
          fileRef={fileRef}
          onPickFiles={onPickFiles}
          onRemove={removeOne}
          maxCount={10}
        />

        {validationError && (
          <p className="text-[13px] text-red-500 text-center">
            {validationError}
          </p>
        )}

        {submitDisabledMessages.length > 0 && (
          <div className="space-y-1 text-center">
            {submitDisabledMessages.map((message) => (
              <p key={message} className="text-[13px] text-red-500">
                {message}
              </p>
            ))}
          </div>
        )}

        <div className="mx-auto max-w-105 py-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSaveDraft()}
            className="h-12 rounded-xl bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 active:translate-y-px"
          >
            임시 저장
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="h-12 rounded-xl bg-[#2F80ED] text-white font-semibold hover:brightness-105 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "제출하기"}
          </button>
        </div>
      </main>
    </div>
  );
}
