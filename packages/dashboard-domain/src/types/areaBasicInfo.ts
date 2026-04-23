// 작업영역 기본 정보 생성/수정 폼에서 함께 사용하는 타입과 초기값.

import type {
  AreaAttachmentStatus,
  HabitatType,
  ProjectLevel,
  RestorationRegion,
} from "./areas";

export type BasicPayload = {
  name: string;
  restorationRegion: RestorationRegion | "";
  startDate: string;
  endDate?: string;
  habitat: HabitatType | "";
  depth: number;
  areaSize: number;
  level: ProjectLevel | "";
  attachmentStatus: AreaAttachmentStatus | "";
  lat: number;
  lon: number;
};

export const BASIC_PAYLOAD_INIT: BasicPayload = {
  name: "",
  restorationRegion: "",
  startDate: "",
  habitat: "",
  depth: 0,
  areaSize: 0,
  level: "",
  attachmentStatus: "",
  lat: 0,
  lon: 0,
};
