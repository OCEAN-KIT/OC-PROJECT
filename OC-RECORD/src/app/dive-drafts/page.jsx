// app/dive-drafts/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Calendar as CalendarIcon,
  Clock3,
  Trash2,
} from "lucide-react";

const DRAFT_STORAGE_KEY = "diveDrafts";

function loadDraftsSafe() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("[drafts] load error", e);
    return [];
  }
}

function saveDraftsSafe(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("[drafts] save error", e);
  }
}

function formatDateTime(isoOrNull) {
  if (!isoOrNull) return "";
  const d = new Date(isoOrNull);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function DraftCard({ draft, onOpen, onDelete }) {
  const createdLabel =
    formatDateTime(draft.createdAt) ||
    (draft.date && draft.time ? `${draft.date} ${draft.time}` : "");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 flex justify-between items-center gap-3">
      <button
        type="button"
        className="flex-1 text-left"
        onClick={() => onOpen(draft.id)}
      >
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="h-4 w-4 text-sky-600" />
          <p className="text-[14px] font-semibold text-gray-800 truncate">
            {draft.siteName || "미지정 현장"}
          </p>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-gray-500">
          {draft.date && (
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {draft.date}
            </span>
          )}
          {draft.time && (
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              {draft.time}
            </span>
          )}
        </div>

        {createdLabel && (
          <p className="mt-1 text-[11px] text-gray-400">
            임시 저장 시각: {createdLabel}
          </p>
        )}
      </button>

      <button
        type="button"
        onClick={() => onDelete(draft.id)}
        className="shrink-0 rounded-full p-1.5 hover:bg-red-50"
        aria-label="삭제"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
}

export default function DiveDraftListPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    setDrafts(loadDraftsSafe());
  }, []);

  const handleOpenDraft = (id) => {
    router.push(`/dive-create?draftId=${id}`);
  };

  const handleDeleteDraft = (id) => {
    const next = drafts.filter((d) => d.id !== id);
    setDrafts(next);
    saveDraftsSafe(next);
  };

  const handleClearAll = () => {
    if (!drafts.length) return;
    if (!confirm("모든 임시 저장을 삭제하시겠어요?")) return;
    setDrafts([]);
    saveDraftsSafe([]);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-50 to-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-[420px] px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl p-1.5 hover:bg-gray-100 active:scale-[0.98] transition"
              aria-label="뒤로가기"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-[16px] font-semibold tracking-tight">
              임시 저장 목록
            </h1>
          </div>

          {drafts.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[12px] text-gray-500 hover:text-red-500"
            >
              전체 삭제
            </button>
          )}
        </div>
      </header>

      {/* 본문 */}
      <main className="mx-auto max-w-[420px] px-4 pt-4 pb-16 space-y-3">
        {drafts.length === 0 ? (
          <div className="mt-10 text-center text-[13px] text-gray-500">
            저장된 임시 데이터가 없습니다.
            <br />
            <span className="text-gray-400">
              활동 생성 화면에서 &quot;임시 저장&quot;을 눌러보세요.
            </span>
          </div>
        ) : (
          drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onOpen={handleOpenDraft}
              onDelete={handleDeleteDraft}
            />
          ))
        )}
      </main>
    </div>
  );
}
