// record 잠수기록 폼 상태를 활동 제출 payload로 바꾸는 어댑터.
// 업로드가 끝난 첨부 정보와 화면 입력값을 서버 요청 형태로 정리한다.

import {
  BARREN_EXTENT_MAP,
  CLEANUP_METHOD_MAP,
  DENSITY_MAP,
  GRAZER_DISTRIBUTION_MAP,
  GRAZING_SCOPE_MAP,
  LOCATION_TYPE_MAP,
  METHOD_TYPE_MAP,
  RATING_MAP,
  ROCK_FEATURES_MAP,
  SEAWEED_HEALTH_MAP,
  SPECIES_TYPE_MAP,
  SUBSTRATE_TARGET_MAP,
  SUITABILITY_MAP,
  TARGET_SPECIES_MAP,
  TERRAIN_MAP,
  UNCOLLECTED_SCALE_MAP,
  WASTE_TYPE_MAP,
  WORK_TYPE_MAP,
} from "@ocean-kit/submission-domain/constants/formMappings";
import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import type {
  SubmissionCreateRequest,
  SubmissionAttachment,
} from "@ocean-kit/submission-domain/types/submission";

export interface FormToPayloadParams {
  form: OcRecordForm;
  details: string;
  attachments: SubmissionAttachment[];
}

export function formToPayload({
  form,
  details,
  attachments,
}: FormToPayloadParams): SubmissionCreateRequest {
  const activityType = WORK_TYPE_MAP[form.basic.workType];

  const payload: SubmissionCreateRequest = {
    siteName: form.basic.siteName,
    siteNameOptionId: null,
    recordDate: form.basic.date,
    divingRound: form.basic.diveRound,
    activityType,
    workDescription: details,
    basicEnv: {
      recordDate: form.basic.date,
      avgDepthM: parseFloat(form.env.avgDepthM) || 0,
      maxDepthM: parseFloat(form.env.maxDepthM) || 0,
      waterTempC: parseFloat(form.env.waterTempC) || 0,
      visibilityStatus: RATING_MAP[form.env.visibilityStatus],
      waveStatus: RATING_MAP[form.env.waveStatus],
      surgeStatus: RATING_MAP[form.env.surgeStatus],
      currentStatus: RATING_MAP[form.env.currentStatus],
    },
    participants: {
      participantNames: form.basic.workers,
    },
    attachments: attachments.map((attachment) => ({
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      mimeType: attachment.mimeType,
      fileSize: attachment.fileSize,
    })),
  };

  switch (form.basic.workType) {
    case "이식":
      payload.transplantActivity = {
        speciesType: SPECIES_TYPE_MAP[form.transplant.speciesType],
        locationType: LOCATION_TYPE_MAP[form.transplant.locationType],
        methodType: METHOD_TYPE_MAP[form.transplant.methodType],
        scale: form.transplant.scale,
        healthStatus: form.transplant.healthStatus,
      };
      break;

    case "조식동물 작업":
      payload.grazerRemovalActivity = {
        targetSpecies: form.grazing.targetSpecies.map(
          (target) => TARGET_SPECIES_MAP[target],
        ),
        densityBeforeWork: DENSITY_MAP[form.grazing.densityBeforeWork],
        workScope: GRAZING_SCOPE_MAP[form.grazing.workScope],
        note: form.grazing.note,
        collectionAmount: form.grazing.collectionAmount,
      };
      break;

    case "부착기질 개선":
      payload.substrateImprovementActivity = {
        targetType: SUBSTRATE_TARGET_MAP[form.substrate.targetType],
        workScope: form.substrate.workScope,
        substrateState: form.substrate.substrateState,
      };
      break;

    case "모니터링":
      payload.monitoringActivity = {
        entryCoordinate: form.monitoring.entryCoordinate,
        exitCoordinate: form.monitoring.exitCoordinate,
        direction: form.monitoring.direction,
        terrain: TERRAIN_MAP[form.monitoring.terrain],
        barrenExtent: BARREN_EXTENT_MAP[form.monitoring.barrenExtent],
        grazerDistribution:
          GRAZER_DISTRIBUTION_MAP[form.monitoring.grazerDistribution],
        rockFeatures: form.monitoring.rockFeatures.map(
          (feature) => ROCK_FEATURES_MAP[feature],
        ),
        suitability: SUITABILITY_MAP[form.monitoring.suitability],
        seaweedIdNumber: form.monitoring.seaweedIdNumber,
        seaweedHealthStatus:
          SEAWEED_HEALTH_MAP[form.monitoring.seaweedHealthStatus],
        leafLength: form.monitoring.leafLength,
        maxLeafWidth: form.monitoring.maxLeafWidth,
      };
      break;

    case "해양정화":
      payload.marineCleanupActivity = {
        wasteTypes: form.cleanup.wasteTypes.map(
          (wasteType) => WASTE_TYPE_MAP[wasteType],
        ),
        method: CLEANUP_METHOD_MAP[form.cleanup.method],
        collectionAmount: form.cleanup.collectionAmount,
        uncollectedScale: UNCOLLECTED_SCALE_MAP[form.cleanup.uncollectedScale],
      };
      break;
  }

  return payload;
}
