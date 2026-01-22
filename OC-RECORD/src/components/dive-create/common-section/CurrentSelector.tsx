"use client";

import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import { Waves } from "lucide-react";

import type { CurrentStrength, OcRecordForm } from "@/types/form";
import { cardCls } from "../styles";

type Props = {
  current: OcRecordForm["env"]["current"];
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;
};

const OPTIONS: CurrentStrength[] = ["잔잔", "중간", "강함"];

export default function CurrentSelector({ current, setEnv }: Props) {
  return (
    <SelectCard title="조류" icon={<Waves className="h-4 w-4 text-sky-600" />}>
      <OptionGrid<CurrentStrength>
        options={OPTIONS}
        value={current}
        columns={3}
        onChange={(opt) => setEnv({ current: opt })}
      />
    </SelectCard>
  );
}
