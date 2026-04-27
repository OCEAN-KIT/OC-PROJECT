"use client";

import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
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
        targetType={form.substrate.targetType}
        setSubstrate={setSubstrate}
      />
      <SubstrateRange workScope={form.substrate.workScope} setSubstrate={setSubstrate} />
      <SubstrateCondition
        substrateState={form.substrate.substrateState}
        setSubstrate={setSubstrate}
      />
    </>
  );
}
