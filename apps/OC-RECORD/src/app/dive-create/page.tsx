"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ClipLoader } from "react-spinners";

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
import { useAuthGuard } from "@/hooks/useAuthGuard";

const DEBUG = true;

const createDefaultForm = (): OcRecordForm => ({
  basic: {
    siteName: "",
    date: new Date().toISOString().slice(0, 10),
    time: (() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    })(),
    diveRound: 1,
    workType: "이식",
    workers: "",
  },
  env: {
    avgDepthM: "",
    maxDepthM: "",
    waterTempC: "",
    visibilityStatus: "보통",
    waveStatus: "보통",
    surgeStatus: "보통",
    currentStatus: "보통",
  },
  transplant: {
    speciesType: "감태",
    locationType: "어초",
    methodType: "로프 연승",
    scale: "",
    healthStatus: "A",
  },
  grazing: {
    targetSpecies: ["성게"],
    densityBeforeWork: "적음",
    workScope: "국소",
    note: "",
    collectionAmount: "",
  },
  substrate: {
    targetType: "암반",
    workScope: "",
    substrateState: "",
  },
  monitoring: {
    entryCoordinate: "",
    exitCoordinate: "",
    direction: "",
    terrain: "암반",
    barrenExtent: "없음",
    grazerDistribution: "낮음",
    rockFeatures: ["매끈"], // [배열로 변경됨]
    suitability: "적합",
    seaweedIdNumber: "",
    seaweedHealthStatus: "양호",
    precisionMeasurement: false,
    leafLength: "",
    maxLeafWidth: "",
  },
  cleanup: {
    wasteTypes: [],
    method: "수작업",
    collectionAmount: "",
    uncollectedScale: "소",
  },
});

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

export default function DiveCreatePage() {
  useAuthGuard({ mode: "gotoLogin" });
  const router = useRouter();

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

  // ========= form =========
  const [form, setForm] = useState<OcRecordForm>(createDefaultForm);

  const setBasic = (patch: Partial<OcRecordForm["basic"]>) => {
    setForm((prev) => ({
      ...prev,
      basic: { ...prev.basic, ...patch },
    }));
  };
  const setEnv = (patch: Partial<OcRecordForm["env"]>) => {
    setForm((prev) => ({
      ...prev,
      env: { ...prev.env, ...patch },
    }));
  };
  const setTransplant = (patch: Partial<OcRecordForm["transplant"]>) => {
    setForm((prev) => ({
      ...prev,
      transplant: { ...prev.transplant, ...patch },
    }));
  };
  const setGrazing = (patch: Partial<OcRecordForm["grazing"]>) => {
    setForm((prev) => ({
      ...prev,
      grazing: { ...prev.grazing, ...patch },
    }));
  };
  const setSubstrate = (patch: Partial<OcRecordForm["substrate"]>) => {
    setForm((prev) => ({
      ...prev,
      substrate: { ...prev.substrate, ...patch },
    }));
  };
  const setMonitoring = (patch: Partial<OcRecordForm["monitoring"]>) => {
    setForm((prev) => ({
      ...prev,
      monitoring: { ...prev.monitoring, ...patch },
    }));
  };
  const setCleanup = (patch: Partial<OcRecordForm["cleanup"]>) => {
    setForm((prev) => ({
      ...prev,
      cleanup: { ...prev.cleanup, ...patch },
    }));
  };

  // ========= 작업내용 =========
  const DETAILS_MAX = 2000;
  const [details, setDetails] = useState("");

  // ========= 유효성 검증 에러 =========
  const [validationError, setValidationError] = useState<string | null>(null);
  useEffect(() => {
    if (validationError) setValidationError(null);
  }, [form, details]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const v = prompt("날짜 (YYYY-MM-DD)", form.basic.date);
      if (v) setBasic({ date: v });
    }
  };

  const openTimePicker = () => {
    const el = timeInputRef.current;
    if (el && typeof el.showPicker === "function") el.showPicker();
    else {
      const v = prompt("시간 (HH:MM)", form.basic.time);
      if (v) setBasic({ time: v });
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
      if (DEBUG) console.log("[draft] new draft id =", id);
      setSavedSnapshot(buildDraftSnapshot(baseForm, "", []));
      return;
    }

    if (DEBUG) console.log("[draft] load existing draft =", existing);

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

    setBasic(loadedForm.basic);
    setEnv(loadedForm.env);
    setTransplant(loadedForm.transplant);
    setGrazing(loadedForm.grazing);
    setSubstrate(loadedForm.substrate);
    setMonitoring(loadedForm.monitoring);
    setCleanup(loadedForm.cleanup);

    // workType에 따라 해당 섹션만 복원
    switch (existing.workType) {
      case "이식":
        if (existing.transplant) {
          setTransplant(loadedForm.transplant);
        }
        break;
      case "조식동물 작업":
        if (existing.grazing) {
          setGrazing(loadedForm.grazing);
        }
        break;
      case "부착기질 개선":
        if (existing.substrate) {
          setSubstrate(loadedForm.substrate);
        }
        break;
      case "모니터링":
        if (existing.monitoring) {
          setMonitoring(loadedForm.monitoring);
        }
        break;
      case "해양정화":
        if (existing.cleanup) {
          setCleanup(loadedForm.cleanup);
        }
        break;
    }

    setDetails(loadedDetails);
    setSavedSnapshot(buildDraftSnapshot(loadedForm, loadedDetails, attachments));
    // attachments(File)은 localStorage 복원 불가 → 유지 안 함
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ========= 임시저장 =========
  const handleSaveDraft = (opts: { silent?: boolean } = {}) => {
    const nowIso = new Date().toISOString();

    const baseDraft = {
      id: draftId || generateDraftId(),
      // basic
      siteName: form.basic.siteName,
      date: form.basic.date,
      time: form.basic.time,
      diveRound: form.basic.diveRound,
      workType: form.basic.workType,
      workers: form.basic.workers,

      // env
      avgDepthM: form.env.avgDepthM,
      maxDepthM: form.env.maxDepthM,
      waterTempC: form.env.waterTempC,
      visibilityStatus: form.env.visibilityStatus,
      waveStatus: form.env.waveStatus,
      surgeStatus: form.env.surgeStatus,
      currentStatus: form.env.currentStatus,

      // details
      details,

      updatedAt: nowIso,
    };

    // workType에 따라 해당 섹션만 저장
    let sectionData = {};
    switch (form.basic.workType) {
      case "이식":
        sectionData = { transplant: form.transplant };
        break;
      case "조식동물 작업":
        sectionData = { grazing: form.grazing };
        break;
      case "부착기질 개선":
        sectionData = { substrate: form.substrate };
        break;
      case "모니터링":
        sectionData = { monitoring: form.monitoring };
        break;
      case "해양정화":
        sectionData = { cleanup: form.cleanup };
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

    if (DEBUG) {
      console.log("[draft] upserted:", finalDraft);
      console.log("[draft] attachments (not persisted):", attachments.length);
    }

    setSavedSnapshot(buildDraftSnapshot(form, details, attachments));

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

  const handleSubmit = () => {
    const error = validateSubmission(form, details);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    submitMutation(
      {
        form,
        details,
        files: attachments,
      },
      {
        onSuccess: () => {
          alert("제출이 완료되었습니다.");
          router.push("/");
        },
        onError: (err) => {
          console.error("[submit] error:", err);
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
          form={form}
          setBasic={setBasic}
          setEnv={setEnv}
          isMobile={isMobile}
          openDatePicker={openDatePicker}
          openTimePicker={openTimePicker}
          dateInputRef={dateInputRef}
          timeInputRef={timeInputRef}
        />

        <WorkTypeSelector workType={form.basic.workType} setBasic={setBasic} />

        <WorkTypeSection
          form={form}
          setTransplant={setTransplant}
          setGrazing={setGrazing}
          setSubstrate={setSubstrate}
          setMonitoring={setMonitoring}
          setCleanup={setCleanup}
        />

        <DetailsInput
          value={details}
          onChange={setDetails}
          maxLen={DETAILS_MAX}
        />

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
            disabled={loading}
            className="h-12 rounded-xl bg-[#2F80ED] text-white font-semibold hover:brightness-105 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "제출하기"}
          </button>
        </div>
      </main>
    </div>
  );
}
