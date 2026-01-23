"use client";

import type { OcRecordForm } from "@/types/form";

import TransplantWrapper from "@/components/dive-create/transplant-section/TransplantWrapper";
import GrazingWrapper from "@/components/dive-create/grazing-section/GrazingWrapper";
import SubstrateWrapper from "@/components/dive-create/substrate-section/SubstrateWrapper";
import MonitoringWrapper from "@/components/dive-create/monitoring-section/MonitoringWrapper";
import CleanupWrapper from "@/components/dive-create/cleanup-section/CleanupWrapper";

type SectionProps = {
  form: OcRecordForm;
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
  setSubstrate: (patch: Partial<OcRecordForm["substrate"]>) => void;
  setMonitoring: (patch: Partial<OcRecordForm["monitoring"]>) => void;
  setCleanup: (patch: Partial<OcRecordForm["cleanup"]>) => void;
};

export default function WorkTypeSection({
  form,
  setTransplant,
  setGrazing,
  setSubstrate,
  setMonitoring,
  setCleanup,
}: SectionProps) {
  const workType = form.basic.workType;

  switch (workType) {
    case "이식":
      return <TransplantWrapper form={form} setTransplant={setTransplant} />;
    case "조식동물 작업":
      return <GrazingWrapper form={form} setGrazing={setGrazing} />;
    case "부착기질 개선":
      return <SubstrateWrapper form={form} setSubstrate={setSubstrate} />;
    case "모니터링":
      return <MonitoringWrapper form={form} setMonitoring={setMonitoring} />;
    case "해양정화":
      return <CleanupWrapper form={form} setCleanup={setCleanup} />;
    default:
      return null;
  }
}
