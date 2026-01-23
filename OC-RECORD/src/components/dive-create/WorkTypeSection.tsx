"use client";

import type { OcRecordForm, WorkType } from "@/types/form";

import TransplantWrapper from "@/components/dive-create/transplant-section/TransplantWrapper";
import GrazingWrapper from "@/components/dive-create/grazing-section/GrazingWrapper";
import SubstrateWrapper from "@/components/dive-create/substrate-section/SubstrateWrapper";
import MonitoringWrapper from "@/components/dive-create/monitoring-section/MonitoringWrapper";
import CleanupWrapper from "@/components/dive-create/cleanup-section/CleanupWrapper";

type SectionProps = {
  form: OcRecordForm;
  setBasic: (patch: Partial<OcRecordForm["basic"]>) => void;
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
  setSubstrate: (patch: Partial<OcRecordForm["substrate"]>) => void;
};

const WORKTYPE_TO_SECTION: Record<
  WorkType,
  React.ComponentType<SectionProps> | null
> = {
  이식: TransplantWrapper,
  "조식동물 작업": GrazingWrapper,
  "부착기질 개선": SubstrateWrapper,
  모니터링: MonitoringWrapper,
  해양정화: CleanupWrapper,
  기타: null,
};

export default function WorkTypeSection({
  form,
  setBasic,
  setEnv,
  setTransplant,
  setGrazing,
  setSubstrate,
}: SectionProps) {
  const Section = WORKTYPE_TO_SECTION[form.basic.workType];
  if (!Section) return null;
  return (
    <Section
      form={form}
      setBasic={setBasic}
      setEnv={setEnv}
      setTransplant={setTransplant}
      setGrazing={setGrazing}
      setSubstrate={setSubstrate}
    />
  );
}
