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
        speciesType={form.transplant.speciesType}
        setTransplant={setTransplant}
      />
      <TransplantPlaceSelector
        locationType={form.transplant.locationType}
        setTransplant={setTransplant}
      />
      <TransplantSystemSelector
        methodType={form.transplant.methodType}
        setTransplant={setTransplant}
      />
      <TransplantScale
        scale={form.transplant.scale}
        setTransplant={setTransplant}
      />
      <HealthGradeSelector
        healthStatus={form.transplant.healthStatus}
        setTransplant={setTransplant}
      />
    </>
  );
}
