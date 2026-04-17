import type { OcRecordForm } from "@/types/form";

interface RequiredField {
  value: string;
  label: string;
}

/**
 * 제출 폼의 필수 텍스트 필드를 검증한다.
 * 비어있는 필수 필드가 있으면 첫 번째 에러 메시지를 반환하고,
 * 모두 통과하면 null을 반환한다.
 */
export function validateSubmission(form: OcRecordForm, details: string): string | null {
  const common: RequiredField[] = [
    { value: form.basic.siteName, label: "현장명" },
    { value: form.env.avgDepthM, label: "평균 수심" },
    { value: form.env.maxDepthM, label: "최대 수심" },
    { value: form.env.waterTempC, label: "수온" },
  ];

  for (const field of common) {
    if (!field.value.trim()) {
      return `${field.label}은(는) 필수 입력입니다`;
    }
  }

  const workTypeFields: RequiredField[] = [];

  switch (form.basic.workType) {
    case "이식":
      workTypeFields.push({ value: form.transplant.scale, label: "이식 규모" });
      break;
    case "조식동물 작업":
      workTypeFields.push({ value: form.grazing.collectionAmount, label: "수거량" });
      break;
    case "부착기질 개선":
      workTypeFields.push({ value: form.substrate.workScope, label: "작업 범위" });
      workTypeFields.push({ value: form.substrate.substrateState, label: "작업 후 기질 상태" });
      break;
    case "해양정화":
      workTypeFields.push({ value: form.cleanup.collectionAmount, label: "수거량" });
      break;
  }

  for (const field of workTypeFields) {
    if (!field.value.trim()) {
      return `${field.label}은(는) 필수 입력입니다`;
    }
  }

  return null;
}
