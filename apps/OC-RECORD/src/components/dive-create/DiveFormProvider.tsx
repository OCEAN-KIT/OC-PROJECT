import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

// 제출 항목들 상태를 들고있는 Provider입니다.

export type SubmissionFormValues = OcRecordForm & {
  details: string;
};

export const createDefaultForm = (): OcRecordForm => ({
  basic: {
    siteName: "",
    date: new Date().toISOString().slice(0, 10),
    time: (() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    })(),
    diveRound: 1,
    workType: "이식",
    workers: "",
  },
  env: {
    avgDepthM: "",
    maxDepthM: "",
    waterTempC: "",
    visibilityStatus: "보통",
    waveStatus: "보통",
    surgeStatus: "보통",
    currentStatus: "보통",
  },
  transplant: {
    speciesType: "감태",
    locationType: "어초",
    methodType: "로프 연승",
    scale: "",
    healthStatus: "A",
  },
  grazing: {
    targetSpecies: ["성게"],
    densityBeforeWork: "적음",
    workScope: "국소",
    note: "",
    collectionAmount: "",
  },
  substrate: {
    targetType: "암반",
    workScope: "",
    substrateState: "",
  },
  monitoring: {
    entryCoordinate: "",
    exitCoordinate: "",
    direction: "",
    terrain: "암반",
    barrenExtent: "없음",
    grazerDistribution: "낮음",
    rockFeatures: ["매끈"],
    suitability: "적합",
    seaweedIdNumber: "",
    seaweedHealthStatus: "양호",
    precisionMeasurement: false,
    leafLength: "",
    maxLeafWidth: "",
  },
  cleanup: {
    wasteTypes: [],
    method: "수작업",
    collectionAmount: "",
    uncollectedScale: "소",
  },
});

export const createDefaultFormValues = (): SubmissionFormValues => ({
  ...createDefaultForm(),
  details: "",
});

export function DiveFormProvider({ children }: { children: ReactNode }) {
  const methods = useForm<SubmissionFormValues>({
    defaultValues: createDefaultFormValues(),
    mode: "onSubmit",
    shouldUnregister: false,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}
