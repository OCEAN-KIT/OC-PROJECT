"use client";

import { useWatch } from "react-hook-form";
import type { SubmissionFormValues } from "./DiveFormProvider";

import TransplantWrapper from "@/components/dive-create/transplant-section/TransplantWrapper";
import GrazingWrapper from "@/components/dive-create/grazing-section/GrazingWrapper";
import SubstrateWrapper from "@/components/dive-create/substrate-section/SubstrateWrapper";
import MonitoringWrapper from "@/components/dive-create/monitoring-section/MonitoringWrapper";
import CleanupWrapper from "@/components/dive-create/cleanup-section/CleanupWrapper";

export default function WorkTypeSection() {
  const workType = useWatch<SubmissionFormValues, "basic.workType">({
    name: "basic.workType",
  });

  switch (workType) {
    case "이식":
      return <TransplantWrapper />;
    case "조식동물 작업":
      return <GrazingWrapper />;
    case "부착기질 개선":
      return <SubstrateWrapper />;
    case "모니터링":
      return <MonitoringWrapper />;
    case "해양정화":
      return <CleanupWrapper />;
    default:
      return null;
  }
}
