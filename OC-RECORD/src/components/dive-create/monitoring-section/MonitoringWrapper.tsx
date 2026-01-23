"use client";

import type { OcRecordForm } from "@/types/form";

type Props = {
  form: OcRecordForm;
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
};

export default function MonitoringWrapper({}: Props) {
  return (
    <>
      <>모니터링 섹션</>
    </>
  );
}
