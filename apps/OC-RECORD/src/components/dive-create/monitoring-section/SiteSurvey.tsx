"use client";

import { useRef, useState } from "react";
import { MapPin, Compass, Mountain } from "lucide-react";
import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import MultiOptionGrid from "@/components/ui/MultiOptionGrid";
import { useController } from "react-hook-form";
import CheonjiinKeyboardSheet from "../CheonjiinKeyboardSheet";

import type {
  TerrainType,
  WhiteningLevel,
  GrazerDistribution,
  RockCharacteristic,
  TransplantSuitability,
} from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";

const TERRAIN_TYPES: TerrainType[] = ["암반", "모래", "혼합", "기타"];
const WHITENING_LEVELS: WhiteningLevel[] = ["없음", "진행", "심각"];
const GRAZER_DISTRIBUTIONS: GrazerDistribution[] = ["낮음", "중간", "높음"];
const ROCK_CHARACTERISTICS: RockCharacteristic[] = [
  "매끈",
  "균열",
  "석회조류 우점",
  "혼합",
  "해조류 식생",
];
const TRANSPLANT_SUITABILITIES: TransplantSuitability[] = ["적합", "부적합"];

type TextFieldType = "entryCoordinate" | "exitCoordinate" | "direction";

export default function SiteSurvey() {
  const { field: entryCoordinateField } = useController<
    SubmissionFormValues,
    "monitoring.entryCoordinate"
  >({
    name: "monitoring.entryCoordinate",
  });
  const { field: exitCoordinateField } = useController<
    SubmissionFormValues,
    "monitoring.exitCoordinate"
  >({
    name: "monitoring.exitCoordinate",
  });
  const { field: directionField } = useController<
    SubmissionFormValues,
    "monitoring.direction"
  >({
    name: "monitoring.direction",
  });
  const { field: terrainField } = useController<
    SubmissionFormValues,
    "monitoring.terrain"
  >({
    name: "monitoring.terrain",
  });
  const { field: barrenExtentField } = useController<
    SubmissionFormValues,
    "monitoring.barrenExtent"
  >({
    name: "monitoring.barrenExtent",
  });
  const { field: grazerDistributionField } = useController<
    SubmissionFormValues,
    "monitoring.grazerDistribution"
  >({
    name: "monitoring.grazerDistribution",
  });
  const { field: rockFeaturesField } = useController<
    SubmissionFormValues,
    "monitoring.rockFeatures"
  >({
    name: "monitoring.rockFeatures",
  });
  const { field: suitabilityField } = useController<
    SubmissionFormValues,
    "monitoring.suitability"
  >({
    name: "monitoring.suitability",
  });

  const [activeField, setActiveField] = useState<TextFieldType | null>(null);
  const inputRefs = {
    entryCoordinate: useRef<HTMLInputElement | null>(null),
    exitCoordinate: useRef<HTMLInputElement | null>(null),
    direction: useRef<HTMLInputElement | null>(null),
  };
  const textFields = {
    entryCoordinate: entryCoordinateField,
    exitCoordinate: exitCoordinateField,
    direction: directionField,
  };

  const openKeyboard = (field: TextFieldType) => {
    setActiveField(field);
    requestAnimationFrame(() => inputRefs[field].current?.blur());
  };

  const closeKeyboard = () => setActiveField(null);

  const setValue = (field: TextFieldType, value: string) => {
    textFields[field].onChange(value.slice(0, 100));
  };

  return (
    <>
      <div className="space-y-4">
        {/* 좌표 및 방위 */}
        <SelectCard
          title="적지조사"
          icon={<Mountain className="h-4 w-4 text-sky-600" />}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] text-gray-600 mb-1.5">
                입수 좌표
              </label>
              <input
                ref={(element) => {
                  inputRefs.entryCoordinate.current = element;
                  entryCoordinateField.ref(element);
                }}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                value={entryCoordinateField.value}
                readOnly
                inputMode="none"
                onBlur={entryCoordinateField.onBlur}
                onFocus={() => openKeyboard("entryCoordinate")}
                onClick={() => openKeyboard("entryCoordinate")}
              />
            </div>
            <div>
              <label className="block text-[12px] text-gray-600 mb-1.5">
                출수 좌표
              </label>
              <input
                ref={(element) => {
                  inputRefs.exitCoordinate.current = element;
                  exitCoordinateField.ref(element);
                }}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                value={exitCoordinateField.value}
                readOnly
                inputMode="none"
                onBlur={exitCoordinateField.onBlur}
                onFocus={() => openKeyboard("exitCoordinate")}
                onClick={() => openKeyboard("exitCoordinate")}
              />
            </div>
            <div>
              <label className="block text-[12px] text-gray-600 mb-1.5">
                진행 방위
              </label>
              <input
                ref={(element) => {
                  inputRefs.direction.current = element;
                  directionField.ref(element);
                }}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                value={directionField.value}
                readOnly
                inputMode="none"
                onBlur={directionField.onBlur}
                onFocus={() => openKeyboard("direction")}
                onClick={() => openKeyboard("direction")}
              />
            </div>
          </div>
        </SelectCard>

        {/* 지형 구성 */}
        <SelectCard
          title="지형 구성"
          icon={<MapPin className="h-4 w-4 text-sky-600" />}
        >
          <OptionGrid<TerrainType>
            options={TERRAIN_TYPES}
            value={terrainField.value}
            columns={4}
            onChange={terrainField.onChange}
          />
        </SelectCard>

        {/* 갯녹음 정도 */}
        <SelectCard
          title="갯녹음 정도"
          icon={<Compass className="h-4 w-4 text-sky-600" />}
        >
          <OptionGrid<WhiteningLevel>
            options={WHITENING_LEVELS}
            value={barrenExtentField.value}
            columns={3}
            onChange={barrenExtentField.onChange}
          />
        </SelectCard>

        {/* 조식동물 분포 */}
        <SelectCard title="조식동물 분포">
          <OptionGrid<GrazerDistribution>
            options={GRAZER_DISTRIBUTIONS}
            value={grazerDistributionField.value}
            columns={3}
            onChange={grazerDistributionField.onChange}
          />
        </SelectCard>

        {/* 암반 특성 - [배열로 변경됨] 복수 선택 */}
        <SelectCard title="암반 특성">
          <MultiOptionGrid<RockCharacteristic>
            options={ROCK_CHARACTERISTICS}
            value={rockFeaturesField.value}
            columns={3}
            onChange={rockFeaturesField.onChange}
          />
        </SelectCard>

        {/* 해조 이식 적합성 */}
        <SelectCard title="해조 이식 적합성">
          <OptionGrid<TransplantSuitability>
            options={TRANSPLANT_SUITABILITIES}
            value={suitabilityField.value}
            columns={2}
            onChange={suitabilityField.onChange}
          />
        </SelectCard>
      </div>

      {/* 키보드 */}
      {activeField && (
        <CheonjiinKeyboardSheet
          key={activeField}
          baseValue={textFields[activeField].value}
          onChange={(value) => setValue(activeField, value)}
          onClose={closeKeyboard}
        />
      )}
    </>
  );
}
