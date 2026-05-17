"use client";

/*
 * 홈 목록에서 선택 가능한 제출 항목의 선택 상태를 관리합니다.
 * pending 상태인 항목만 선택 대상으로 계산하고,
 * 단일/전체 토글, 초기화, 목록 변경 시 사라진 선택 id 정리를 제공합니다.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Submission } from "../api/submissions";

export function useSubmissionSelection(items: Submission[]) {
  const selectableIds = useMemo(
    () =>
      items
        .filter((i) => i.status === "pending")
        .map((i) => String(i.id)),
    [items]
  );
  const selectableIdSet = useMemo(() => new Set(selectableIds), [selectableIds]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const total = selectableIds.length;
  const allSelected = selected.size > 0 && selected.size === total;

  useEffect(() => {
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => selectableIdSet.has(id)));

      return next.size === prev.size ? prev : next;
    });
  }, [selectableIdSet]);

  const toggleOne = useCallback(
    (id: string) => {
      if (!selectableIdSet.has(id)) return;
      setSelected((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    },
    [selectableIdSet]
  );
  const toggleAll = useCallback(() => {
    setSelected((prev) =>
      prev.size === total ? new Set() : new Set(selectableIds)
    );
  }, [selectableIds, total]);
  const clear = useCallback(() => setSelected(new Set()), []);
  return {
    selected,
    toggleOne,
    toggleAll,
    clear,
    total,
    allSelected,
    count: selected.size,
  };
}
