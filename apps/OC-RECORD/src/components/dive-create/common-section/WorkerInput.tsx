"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Users, X } from "lucide-react";
import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import { cardCls } from "../styles";

type Props = {
  workers: OcRecordForm["basic"]["workers"];
  setBasic: (patch: Partial<OcRecordForm["basic"]>) => void;
};

function normalizeName(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function parseWorkersToChips(workers: string) {
  return workers
    .split(",")
    .map((x) => normalizeName(x))
    .filter(Boolean);
}

export default function WorkersInput({ workers, setBasic }: Props) {
  const [chips, setChips] = useState<string[]>(() =>
    parseWorkersToChips(workers),
  );
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const workersString = useMemo(() => chips.join(", "), [chips]);

  // 외부에서 workers가 바뀌는 케이스(초기 로드/리셋) 대비
  useEffect(() => {
    const next = parseWorkersToChips(workers);
    if (next.join("|") !== chips.join("|")) setChips(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers]);

  // chips -> workers 문자열 동기화
  useEffect(() => {
    setBasic({ workers: workersString });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workersString]);

  const commitToken = (token: string) => {
    const v = normalizeName(token);
    if (!v) return;

    setChips((prev) => {
      if (prev.includes(v)) return prev; // 중복 방지 (원하면 제거)
      return [...prev, v];
    });
  };

  // ✅ 콤마가 입력되면: 콤마 이전 토큰들은 칩으로 확정하고, 마지막 토큰만 draft로 남김
  const onDraftChange = (raw: string) => {
    if (raw.includes(",")) {
      const parts = raw.split(",");
      const last = parts.pop() ?? "";

      for (const p of parts) commitToken(p);

      // 콤마까지 포함된 입력은 draft에 남기지 않음 (즉시 사라짐)
      setDraft(normalizeName(last));
      return;
    }

    setDraft(raw);
  };

  const commitDraft = () => {
    commitToken(draft);
    setDraft("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 입력 시 확정
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
      return;
    }

    // Backspace: draft가 비어있으면 마지막 칩 삭제
    if (e.key === "Backspace" && draft.length === 0 && chips.length > 0) {
      e.preventDefault();
      setChips((prev) => prev.slice(0, -1));
    }
  };

  const removeChip = (idx: number) => {
    setChips((prev) => prev.filter((_, i) => i !== idx));
    inputRef.current?.focus();
  };

  const onContainerClick = () => inputRef.current?.focus();

  return (
    <section className="mb-7">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-sky-600" />
          <h2 className="text-[14px] font-semibold text-gray-800">작업자</h2>
        </div>

        <span className="text-[12px] text-gray-500">
          쉼표(,)로 입력하면 박스로 분리돼요
        </span>
      </div>

      <div className={`${cardCls} py-2! px-3!`}>
        <div
          className="flex items-center gap-2 flex-wrap cursor-text min-h-[30px]"
          onClick={onContainerClick}
        >
          {chips.map((name, idx) => (
            <span
              key={`${name}-${idx}`}
              className="inline-flex items-center gap-1 px-2 h-7 rounded-md border text-[13px] text-gray-800 bg-white"
            >
              {name}
              <button
                type="button"
                onClick={() => removeChip(idx)}
                className="p-0.5 -mr-0.5 text-gray-500 hover:text-gray-800"
                aria-label="remove worker"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={chips.length ? "" : "예) 홍길동, 김철수, 박영희"}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-[15px] text-gray-800 placeholder:text-gray-400 h-[40px]"
            inputMode="text"
          />
        </div>
      </div>
    </section>
  );
}
