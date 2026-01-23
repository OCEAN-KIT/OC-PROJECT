"use client";

import { useRef, useState } from "react";
import { ClipboardList } from "lucide-react";
import { inputCls } from "../styles";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";

type Props = {
  value: string;
  onChange: (v: string) => void;
  maxLen?: number;
};

export default function DetailsInput({
  value,
  onChange,
  maxLen = 2000,
}: Props) {
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const setValue = (next: string) => {
    const clipped = next.slice(0, maxLen);
    onChange(clipped);
  };

  const openKeyboard = () => {
    setOpen(true);
    requestAnimationFrame(() => textareaRef.current?.blur()); // 시스템 키보드 방지
  };

  const closeKeyboard = () => setOpen(false);

  return (
    <>
      <section className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-sky-600" />
            <h2 className="text-[14px] font-semibold text-gray-800">작업 내용</h2>
          </div>
          <div className="text-right text-[11px] text-gray-400">
            {value.length}/{maxLen}
          </div>
        </div>

        <label className="block">
          <textarea
            ref={textareaRef}
            className={`${inputCls} h-44 resize-none`}
            placeholder="수중에서 관찰한 사실, 판단 근거, 특이사항을 기록하세요."
            value={value}
            readOnly
            inputMode="none"
            onFocus={openKeyboard}
            onClick={openKeyboard}
          />
        </label>
      </section>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onMouseDown={closeKeyboard}
            onTouchStart={closeKeyboard}
          />

          <div className="fixed left-0 right-0 bottom-0 z-50">
            <div
              className="mx-auto max-w-105 bg-white"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <CheonjiinKeyboard onChange={setValue} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
