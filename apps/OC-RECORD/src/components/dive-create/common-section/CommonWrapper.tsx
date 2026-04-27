"use client";

import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";

import SiteNameInput from "./SiteNameInput";
import DateTimeInput from "./DateTimeInput";
import DiveRoundSelector from "./DiveRoundSelector";
import DepthTempInput from "@/components/dive-create/common-section/DepthTempInput";
import VisibilitySelector from "./VisibilitySelector";
import CurrentSelector from "./CurrentSelector";
import WaveSelector from "./WaveSelector";
import SurgeSelector from "./SurgeSelector";
import WorkersInput from "./WorkerInput";

type Props = {
  form: OcRecordForm;

  setBasic: (patch: Partial<OcRecordForm["basic"]>) => void;
  setEnv: (patch: Partial<OcRecordForm["env"]>) => void;

  // Date/TimeInput에서 쓰는 값들
  isMobile: boolean;
  openDatePicker: () => void;
  openTimePicker: () => void;
  dateInputRef: React.RefObject<HTMLInputElement | null>;
  timeInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function CommonWrapper({
  form,
  setBasic,
  setEnv,
  isMobile,
  openDatePicker,
  openTimePicker,
  dateInputRef,
  timeInputRef,
}: Props) {
  return (
    <>
      <SiteNameInput
        siteName={form.basic.siteName}
        onChange={(v) => setBasic({ siteName: v })}
      />

      <DateTimeInput
        date={form.basic.date}
        time={form.basic.time}
        setBasic={setBasic}
        isMobile={isMobile}
        openDatePicker={openDatePicker}
        openTimePicker={openTimePicker}
        dateInputRef={dateInputRef}
        timeInputRef={timeInputRef}
      />

      <DiveRoundSelector diveRound={form.basic.diveRound} setBasic={setBasic} />

      <WorkersInput workers={form.basic.workers} setBasic={setBasic} />

      <DepthTempInput
        avgDepthM={form.env.avgDepthM}
        maxDepthM={form.env.maxDepthM}
        waterTempC={form.env.waterTempC}
        setEnv={setEnv}
      />
      <div className="grid grid-cols-4 gap-2">
        <VisibilitySelector
          visibilityStatus={form.env.visibilityStatus}
          setEnv={setEnv}
        />
        <WaveSelector waveStatus={form.env.waveStatus} setEnv={setEnv} />
        <SurgeSelector surgeStatus={form.env.surgeStatus} setEnv={setEnv} />
        <CurrentSelector
          currentStatus={form.env.currentStatus}
          setEnv={setEnv}
        />
      </div>
    </>
  );
}
