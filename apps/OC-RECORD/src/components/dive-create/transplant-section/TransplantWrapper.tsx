"use client";

import TransplantTypeSelector from "./TransplantTypeSelector";
import TransplantPlaceSelector from "./TransplantPlaceSelector";
import TransplantSystemSelector from "./TransplantSystem";
import TransplantScale from "./TransplantScale";
import HealthGradeSelector from "./HealthGradeSelector";

export default function TransplantWrapper() {
  return (
    <>
      <TransplantTypeSelector />
      <TransplantPlaceSelector />
      <TransplantSystemSelector />
      <TransplantScale />
      <HealthGradeSelector />
    </>
  );
}
