"use client";

import type { OcRecordForm } from "@/types/form";

type Props = {
  form: OcRecordForm;
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
  setGrazing: (patch: Partial<OcRecordForm["grazing"]>) => void;
};

export default function SubstrateWrapper({}: Props) {
  return (
    <>
      <>부착기질 개선 섹션</>
    </>
  );
}
