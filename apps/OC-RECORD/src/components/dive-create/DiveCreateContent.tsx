"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useFormContext, useWatch } from "react-hook-form";

import {
  generateDraftId,
  getDraftById,
  upsertDraft,
} from "@/utils/diveDraftStorage";
import { useCreateSubmission } from "@/hooks/useCreateSubmission";
import { validateSubmission } from "@/utils/validateSubmission";

import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";

import WorkTypeSelector from "@/components/dive-create/common-section/WorkTypeSelector";
import DetailsInput from "@/components/dive-create/common-section/DetailsInput";
import MediaUploadSection from "@/components/dive-create/common-section/MediaUploadSection";
import WorkTypeSection from "@/components/dive-create/WorkTypeSection";
import CommonWrapper from "@/components/dive-create/common-section/CommonWrapper";
import UnsavedChangesModal from "@/components/ui/UnsavedChangesModal";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useIsLoggined } from "@/hooks/useIsLoggined";
import {
  createDefaultForm,
  createDefaultFormValues,
  type SubmissionFormValues,
} from "./DiveFormProvider";

const buildAttachmentMeta = (attachments: File[]) =>
  attachments.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }));

const buildDraftSnapshot = (
  targetForm: OcRecordForm,
  targetDetails: string,
  targetAttachments: File[],
) =>
  JSON.stringify({
    form: targetForm,
    details: targetDetails,
    attachments: buildAttachmentMeta(targetAttachments),
  });

type WatchedSubmissionFormValues = {
  details?: SubmissionFormValues["details"];
  basic?: Partial<SubmissionFormValues["basic"]>;
  env?: Partial<SubmissionFormValues["env"]>;
  transplant?: Partial<SubmissionFormValues["transplant"]>;
  grazing?: Partial<SubmissionFormValues["grazing"]>;
  substrate?: Partial<SubmissionFormValues["substrate"]>;
  monitoring?: Partial<SubmissionFormValues["monitoring"]>;
  cleanup?: Partial<SubmissionFormValues["cleanup"]>;
};

const completeSubmissionFormValues = (
  values?: WatchedSubmissionFormValues,
): SubmissionFormValues => {
  const defaults = createDefaultFormValues();

  return {
    details: values?.details ?? defaults.details,
    basic: {
      ...defaults.basic,
      ...(values?.basic ?? {}),
    },
    env: {
      ...defaults.env,
      ...(values?.env ?? {}),
    },
    transplant: {
      ...defaults.transplant,
      ...(values?.transplant ?? {}),
    },
    grazing: {
      ...defaults.grazing,
      ...(values?.grazing ?? {}),
    },
    substrate: {
      ...defaults.substrate,
      ...(values?.substrate ?? {}),
    },
    monitoring: {
      ...defaults.monitoring,
      ...(values?.monitoring ?? {}),
    },
    cleanup: {
      ...defaults.cleanup,
      ...(values?.cleanup ?? {}),
    },
  };
};

export default function DiveCreateContent() {
  const router = useRouter();
  const isLoggedIn = useIsLoggined();
  const { getValues, setValue, reset, control } =
    useFormContext<SubmissionFormValues>();

  const watchedValues = completeSubmissionFormValues(
    useWatch<SubmissionFormValues>({ control }),
  );

  const { details, ...form } = watchedValues;

  useEffect(() => {
    router.prefetch("/dive-drafts");
    router.prefetch("/home");
  }, [router]);

  // ========= 임시저장 draft =========
  const [draftId, setDraftId] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const initializedRef = useRef(false);

  // ========= 디바이스 =========
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // ========= 유효성 검증 에러 =========
  const [validationError, setValidationError] = useState<string | null>(null);
  useEffect(() => {
    if (validationError) setValidationError(null);
  }, [form, details]);

  // ========= 첨부(사진/영상) =========
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const currentDraftSnapshot = useMemo(
    () => buildDraftSnapshot(form, details, attachments),
    [form, details, attachments],
  );

  const hasUnsavedChanges =
    savedSnapshot !== null && currentDraftSnapshot !== savedSnapshot;

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const next = [...attachments, ...files].slice(0, 10);
    setAttachments(next);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeOne = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

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

  // ========= draft 로딩 =========
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    const fromParam = sp.get("draftId");

    const id = fromParam ?? generateDraftId();
    setDraftId(id);

    const existing = fromParam ? getDraftById(fromParam) : null;
    const baseForm = createDefaultForm();
    if (!existing) {
      const defaultValues = createDefaultFormValues();
      const { details: defaultDetails, ...defaultForm } = defaultValues;

      reset(defaultValues);
      setSavedSnapshot(buildDraftSnapshot(defaultForm, defaultDetails, []));
      return;
    }

    const loadedDetails = existing.details ?? "";
    const loadedForm: OcRecordForm = {
      ...baseForm,
      basic: {
        ...baseForm.basic,
        siteName: existing.siteName ?? baseForm.basic.siteName,
        date: existing.date ?? baseForm.basic.date,
        time: existing.time ?? baseForm.basic.time,
        diveRound: existing.diveRound ?? baseForm.basic.diveRound,
        workType: existing.workType ?? baseForm.basic.workType,
        workers: existing.workers ?? baseForm.basic.workers,
      },
      env: {
        ...baseForm.env,
        avgDepthM: existing.avgDepthM ?? baseForm.env.avgDepthM,
        maxDepthM: existing.maxDepthM ?? baseForm.env.maxDepthM,
        waterTempC: existing.waterTempC ?? baseForm.env.waterTempC,
        visibilityStatus:
          existing.visibilityStatus ?? baseForm.env.visibilityStatus,
        waveStatus: existing.waveStatus ?? baseForm.env.waveStatus,
        surgeStatus: existing.surgeStatus ?? baseForm.env.surgeStatus,
        currentStatus: existing.currentStatus ?? baseForm.env.currentStatus,
      },
      transplant: existing.transplant
        ? { ...baseForm.transplant, ...existing.transplant }
        : baseForm.transplant,
      grazing: existing.grazing
        ? { ...baseForm.grazing, ...existing.grazing }
        : baseForm.grazing,
      substrate: existing.substrate
        ? { ...baseForm.substrate, ...existing.substrate }
        : baseForm.substrate,
      monitoring: existing.monitoring
        ? { ...baseForm.monitoring, ...existing.monitoring }
        : baseForm.monitoring,
      cleanup: existing.cleanup
        ? { ...baseForm.cleanup, ...existing.cleanup }
        : baseForm.cleanup,
    };

    const loadedValues: SubmissionFormValues = {
      ...loadedForm,
      details: loadedDetails,
    };

    reset(loadedValues);
    setSavedSnapshot(buildDraftSnapshot(loadedForm, loadedDetails, []));
  }, []);

  // ========= 임시저장 =========
  const handleSaveDraft = (opts: { silent?: boolean } = {}) => {
    const nowIso = new Date().toISOString();
    const values = getValues();
    const { details: draftDetails, ...draftForm } = values;

    const baseDraft = {
      id: draftId || generateDraftId(),
      // basic
      siteName: draftForm.basic.siteName,
      date: draftForm.basic.date,
      time: draftForm.basic.time,
      diveRound: draftForm.basic.diveRound,
      workType: draftForm.basic.workType,
      workers: draftForm.basic.workers,

      // env
      avgDepthM: draftForm.env.avgDepthM,
      maxDepthM: draftForm.env.maxDepthM,
      waterTempC: draftForm.env.waterTempC,
      visibilityStatus: draftForm.env.visibilityStatus,
      waveStatus: draftForm.env.waveStatus,
      surgeStatus: draftForm.env.surgeStatus,
      currentStatus: draftForm.env.currentStatus,

      // details
      details: draftDetails,

      updatedAt: nowIso,
    };

    // workType에 따라 해당 섹션만 저장
    let sectionData = {};
    switch (draftForm.basic.workType) {
      case "이식":
        sectionData = { transplant: draftForm.transplant };
        break;
      case "조식동물 작업":
        sectionData = { grazing: draftForm.grazing };
        break;
      case "부착기질 개선":
        sectionData = { substrate: draftForm.substrate };
        break;
      case "모니터링":
        sectionData = { monitoring: draftForm.monitoring };
        break;
      case "해양정화":
        sectionData = { cleanup: draftForm.cleanup };
        break;
    }

    const existing = draftId ? getDraftById(draftId) : null;
    const baseMeta = existing
      ? { id: existing.id, createdAt: existing.createdAt }
      : {};
    const finalDraft = {
      ...baseMeta,
      ...baseDraft,
      ...sectionData,
      createdAt: existing?.createdAt ?? nowIso,
    };

    if (!draftId) setDraftId(finalDraft.id);

    upsertDraft(finalDraft);

    setSavedSnapshot(buildDraftSnapshot(draftForm, draftDetails, attachments));

    if (!opts.silent) alert("임시 저장했습니다.");
  };

  const handleBack = () => {
    if (!hasUnsavedChanges) {
      router.back();
      return;
    }

    setIsExitConfirmOpen(true);
  };

  const handleKeepEditing = () => setIsExitConfirmOpen(false);

  const handleLeaveWithoutSave = () => {
    setIsExitConfirmOpen(false);
    router.back();
  };

  const handleSaveAndLeave = () => {
    setIsExitConfirmOpen(false);
    handleSaveDraft({ silent: true });
    router.back();
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
