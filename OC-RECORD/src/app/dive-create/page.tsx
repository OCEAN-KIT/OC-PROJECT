"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ClipLoader } from "react-spinners";

import {
  generateDraftId,
  getDraftById,
  upsertDraft,
} from "@/utils/diveDraftStorage";

import type { OcRecordForm } from "@/types/form";

import WorkTypeSelector from "@/components/dive-create/common-section/WorkTypeSelector";
import DetailsInput from "@/components/dive-create/common-section/DetailsInput";
import MediaUploadSection from "@/components/dive-create/common-section/MediaUploadSection";
import WorkTypeSection from "@/components/dive-create/WorkTypeSection";
import CommonWrapper from "@/components/dive-create/common-section/CommonWrapper";

const DEBUG = true;

export default function DiveCreatePage() {
  const router = useRouter();

  // ========= 임시저장 draft =========
  const [draftId, setDraftId] = useState<string | null>(null);
  const initializedRef = useRef(false);

  // ========= 디바이스 =========
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // ========= form =========
  const [form, setForm] = useState<OcRecordForm>({
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
      visibility: "보통",
      wave: "보통",
      surge: "보통",
      current: "보통",
    },
    transplant: {
      transplantType: "감태",
      transplantPlace: "기타",
      transplantSystem: "기타",
      transplantScale: "",
      healthGrade: "A",
    },
    grazing: {
      targets: [],
      density: "적음",
      scope: "국소",
      scopeNote: "",
      collectedAmount: "",
    },
  });

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

  // ========= 작업내용 =========
  const DETAILS_MAX = 2000;
  const [details, setDetails] = useState("");

  // ========= 첨부(사진/영상) =========
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

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
    if (!existing) {
      if (DEBUG) console.log("[draft] new draft id =", id);
      return;
    }

    if (DEBUG) console.log("[draft] load existing draft =", existing);

    setBasic({
      siteName: existing.siteName ?? "",
      date: existing.date ?? form.basic.date,
      time: existing.time ?? form.basic.time,
      diveRound: existing.diveRound ?? form.basic.diveRound,
      workType: existing.workType ?? form.basic.workType,
      workers: existing.workers ?? form.basic.workers,
    });

    setEnv({
      avgDepthM: existing.avgDepthM ?? form.env.avgDepthM,
      waterTempC: existing.waterTempC ?? form.env.waterTempC,
      current: existing.current ?? form.env.current,
      visibility: existing.visibility ?? form.env.visibility,
    });

    setTransplant({
      transplantType: existing.transplantType ?? form.transplant.transplantType,
      transplantPlace:
        existing.transplantPlace ?? form.transplant.transplantPlace,
      transplantSystem:
        existing.transplantSystem ?? form.transplant.transplantSystem,
      transplantScale:
        existing.transplantScalse ?? form.transplant.transplantScale,
      healthGrade: existing.healthGrade ?? form.transplant.healthGrade,
    });

    setDetails(existing.details ?? "");
    // attachments(File)은 localStorage 복원 불가 → 유지 안 함
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ========= 임시저장 =========
  const handleSaveDraft = () => {
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
      waterTempC: form.env.waterTempC,
      current: form.env.current,
      visibility: form.env.visibility,

      // transplant
      healthGrade: form.transplant.healthGrade,

      // details
      details,

      updatedAt: nowIso,
    };

    const existing = draftId ? getDraftById(draftId) : null;
    const finalDraft = existing
      ? { ...existing, ...baseDraft, createdAt: existing.createdAt }
      : { ...baseDraft, createdAt: nowIso };

    if (!draftId) setDraftId(finalDraft.id);

    upsertDraft(finalDraft);

    if (DEBUG) {
      console.log("[draft] upserted:", finalDraft);
      console.log("[draft] attachments (not persisted):", attachments.length);
    }

    alert("임시 저장했습니다.");
  };

  // ========= 제출(아직 API 없음) =========
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    // 서버 업로드/제출 로직은 나중에 붙일 거라 지금은 막아둠
    setLoading(true);
    try {
      alert("아직 제출 API 연결 전입니다. (임시 저장만 가능)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh ">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-105 px-4 h-14 flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
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
          setBasic={setBasic}
          setEnv={setEnv}
          setTransplant={setTransplant}
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

        <div className="mx-auto max-w-105 py-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
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
