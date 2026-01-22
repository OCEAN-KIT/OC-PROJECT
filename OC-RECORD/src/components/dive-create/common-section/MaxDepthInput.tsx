"use client";

import SelectCard from "@/components/ui/SelectCard";
import { ArrowDown } from "lucide-react";
import type { OcRecordForm } from "@/types/form";
import { cardCls } from "../styles";

type Props = {
  maxDepthM: OcRecordForm["env"]["maxDepthM"];
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;
};

export default function MaxDepthInput({ maxDepthM, setEnv }: Props) {
  return (
    <SelectCard
      className={cardCls}
      title="최대 수심"
      icon={<ArrowDown className="h-4 w-4 text-sky-600" />}
    >
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          className="w-full h-11 rounded-xl border px-3 text-[14px] outline-none"
          value={maxDepthM}
          placeholder="예) 12.5"
          onChange={(e) => setEnv({ maxDepthM: e.target.value })}
        />
        <div className="text-[13px] font-semibold text-gray-600">m</div>
      </div>
    </SelectCard>
  );
}
