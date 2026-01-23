"use client";

import type { OcRecordForm } from "@/types/form";

type Props = {
  form: OcRecordForm;
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
  setSubstrate: (patch: Partial<OcRecordForm["substrate"]>) => void;
};

export default function CleanupWrapper({}: Props) {
  return (
    <>
      <>해양정화 섹션</>
    </>
  );
}
