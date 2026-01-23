"use client";

import { useMemo, useRef, useState } from "react";
import { MapPin, Compass, Mountain } from "lucide-react";
import SelectCard from "@/components/ui/SelectCard";
import OptionGrid from "@/components/ui/OptionGrid";
import CheonjiinKeyboard from "@/components/keyboard/CheonjiinKeyboard";

import type {
  OcRecordForm,
  TerrainType,
  WhiteningLevel,
  GrazerDistribution,
  RockCharacteristic,
  TransplantSuitability,
} from "@/types/form";

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

type Props = {
  monitoring: OcRecordForm["monitoring"];
  setMonitoring: (patch: Partial<OcRecordForm["monitoring"]>) => void;
};

type TextFieldType = "entryCoord" | "exitCoord" | "direction";

export default function SiteSurvey({ monitoring, setMonitoring }: Props) {
  const [activeField, setActiveField] = useState<TextFieldType | null>(null);
  const inputRefs = {
    entryCoord: useRef<HTMLInputElement | null>(null),
    exitCoord: useRef<HTMLInputElement | null>(null),
    direction: useRef<HTMLInputElement | null>(null),
  };

  const openKeyboard = (field: TextFieldType) => {
    setActiveField(field);
    requestAnimationFrame(() => inputRefs[field].current?.blur());
  };

  const closeKeyboard = () => setActiveField(null);

  const setValue = (field: TextFieldType, value: string) => {
    setMonitoring({ [field]: value.slice(0, 100) });
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
                ref={inputRefs.entryCoord}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                value={monitoring.entryCoord}
                readOnly
                inputMode="none"
                onFocus={() => openKeyboard("entryCoord")}
                onClick={() => openKeyboard("entryCoord")}
              />
            </div>
            <div>
              <label className="block text-[12px] text-gray-600 mb-1.5">
                출수 좌표
              </label>
              <input
                ref={inputRefs.exitCoord}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                value={monitoring.exitCoord}
                readOnly
                inputMode="none"
                onFocus={() => openKeyboard("exitCoord")}
                onClick={() => openKeyboard("exitCoord")}
              />
            </div>
            <div>
              <label className="block text-[12px] text-gray-600 mb-1.5">
                진행 방위
              </label>
              <input
                ref={inputRefs.direction}
                className="w-full h-11 rounded-xl border border-gray-200 px-3 text-[14px] outline-none"
                value={monitoring.direction}
                readOnly
                inputMode="none"
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
            value={monitoring.terrainType}
            columns={4}
            onChange={(opt) => setMonitoring({ terrainType: opt })}
          />
        </SelectCard>

        {/* 갯녹음 정도 */}
        <SelectCard
          title="갯녹음 정도"
          icon={<Compass className="h-4 w-4 text-sky-600" />}
        >
          <OptionGrid<WhiteningLevel>
            options={WHITENING_LEVELS}
            value={monitoring.whiteningLevel}
            columns={3}
            onChange={(opt) => setMonitoring({ whiteningLevel: opt })}
          />
        </SelectCard>

        {/* 조식동물 분포 */}
        <SelectCard title="조식동물 분포">
          <OptionGrid<GrazerDistribution>
            options={GRAZER_DISTRIBUTIONS}
            value={monitoring.grazerDistribution}
            columns={3}
            onChange={(opt) => setMonitoring({ grazerDistribution: opt })}
          />
        </SelectCard>

        {/* 암반 특성 */}
        <SelectCard title="암반 특성">
          <OptionGrid<RockCharacteristic>
            options={ROCK_CHARACTERISTICS}
            value={monitoring.rockCharacteristic}
            columns={3}
            onChange={(opt) => setMonitoring({ rockCharacteristic: opt })}
          />
        </SelectCard>

        {/* 해조 이식 적합성 */}
        <SelectCard title="해조 이식 적합성">
          <OptionGrid<TransplantSuitability>
            options={TRANSPLANT_SUITABILITIES}
            value={monitoring.transplantSuitability}
            columns={2}
            onChange={(opt) => setMonitoring({ transplantSuitability: opt })}
          />
        </SelectCard>
      </div>

      {/* 키보드 */}
      {activeField && (
        <>
          <div
            className="fixed inset-0 z-40"
            onMouseDown={closeKeyboard}
            onTouchStart={closeKeyboard}
          />

          <div className="fixed left-0 right-0 bottom-0 z-50">
            <div
              className="mx-auto max-w-105 bg-white"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <CheonjiinKeyboard
                onChange={(val) => setValue(activeField, val)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
