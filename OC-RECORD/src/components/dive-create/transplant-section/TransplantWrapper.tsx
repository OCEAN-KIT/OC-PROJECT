"use client";

import type { OcRecordForm } from "@/types/form";
import TransplantTypeSelector from "./TransplantTypeSelector";
import TransplantPlaceSelector from "./TransplantPlaceSelector";

type Props = {
  form: OcRecordForm;
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
};

export default function TransplantWrapper({ form, setTransplant }: Props) {
  return (
    <>
      <TransplantTypeSelector
        transplantType={form.transplant.transplantType}
        setTransplant={setTransplant}
      />
      <TransplantPlaceSelector
        transplantPlace={form.transplant.transplantPlace}
        setTransplant={setTransplant}
      />
    </>
  );
}
