// src/utils/diveDraftStorage.js

const STORAGE_KEY = "diveDrafts";

/** 간단한 고유 id 생성기 (timestamp + random) */
export function generateDraftId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 전체 임시저장 목록 불러오기 */
export function loadDrafts() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("[diveDraftStorage] loadDrafts error", e);
    return [];
  }
}

/** 전체 임시저장 목록 저장하기 */
export function saveDrafts(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("[diveDraftStorage] saveDrafts error", e);
  }
}

/** id로 하나 찾기 */
export function getDraftById(id) {
  const drafts = loadDrafts();
  return drafts.find((d) => d.id === id) || null;
}

/** 하나 추가 or 업데이트 (id 기준) */
export function upsertDraft(draft) {
  const drafts = loadDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);

  if (idx === -1) {
    // 새로 추가
    saveDrafts([draft, ...drafts]);
  } else {
    // 기존 것 업데이트
    const updated = [...drafts];
    updated[idx] = { ...drafts[idx], ...draft };
    saveDrafts(updated);
  }
}

/** 특정 임시저장 삭제 (나중에 리스트에서 삭제 버튼 쓸 때) */
export function deleteDraft(id) {
  const drafts = loadDrafts();
  const filtered = drafts.filter((d) => d.id !== id);
  saveDrafts(filtered);
}
