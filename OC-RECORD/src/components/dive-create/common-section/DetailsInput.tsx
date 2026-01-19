"use client";

import { ClipboardList } from "lucide-react";
import { cardCls, inputCls } from "../styles";

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
  return (
    <section className={cardCls}>
      <div className="flex items-center gap-2 mb-2">
        <ClipboardList className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">작업 내용</h2>
      </div>

      <label className="block">
        <textarea
          className={`${inputCls} h-44 resize-none`}
          placeholder="수중에서 관찰한 사실, 판단 근거, 특이사항을 기록하세요."
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLen))}
        />
      </label>

      <div className="mt-2 text-right text-[11px] text-gray-400">
        {value.length}/{maxLen}
      </div>
    </section>
  );
}
