"use client";

import type { OcRecordForm } from "@/types/form";
import TransplantTypeSelector from "./TransplantTypeSelector";
import TransplantPlaceSelector from "./TransplantPlaceSelector";
import TransplantSystemSelector from "./TransplantSystem";
import TransplantScale from "./TransplantScale";
import HealthGradeSelector from "./HealthGradeSelector";

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
      <TransplantSystemSelector
        transplantSystem={form.transplant.transplantSystem}
        setTransplant={setTransplant}
      />
      <TransplantScale
        transplantScale={form.transplant.transplantScale}
        setTransplant={setTransplant}
      />
      <HealthGradeSelector
        healthGrade={form.transplant.healthGrade}
        setTransplant={setTransplant}
      />
    </>
  );
}
