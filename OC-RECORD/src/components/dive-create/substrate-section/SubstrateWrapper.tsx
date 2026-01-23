"use client";

import type { OcRecordForm } from "@/types/form";
import SubstrateTargetSelector from "./SubstrateTargetSelector";
import SubstrateRange from "./SubstrateRange";
import SubstrateCondition from "./SubstrateCondition";

type Props = {
  form: OcRecordForm;
  setSubstrate: (patch: Partial<OcRecordForm["substrate"]>) => void;
};

export default function SubstrateWrapper({ form, setSubstrate }: Props) {
  return (
    <>
      <SubstrateTargetSelector
        target={form.substrate.target}
        setSubstrate={setSubstrate}
      />
      <SubstrateRange range={form.substrate.range} setSubstrate={setSubstrate} />
      <SubstrateCondition
        condition={form.substrate.condition}
        setSubstrate={setSubstrate}
      />
    </>
  );
}
