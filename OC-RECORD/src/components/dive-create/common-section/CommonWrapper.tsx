"use client";

import type { OcRecordForm } from "@/types/form";

import SiteNameInput from "./SiteNameInput";
import DateTimeInput from "./DateTimeInput";
import DiveRoundSelector from "./DiveRoundSelector";
import DepthTempInput from "@/components/dive-create/common-section/DepthTempInput";
import VisibilitySelector from "./VisibilitySelector";
import CurrentSelector from "./CurrentSelector";

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

      <DepthTempInput
        avgDepthM={form.env.avgDepthM}
        waterTempC={form.env.waterTempC}
        setEnv={setEnv}
      />

      <VisibilitySelector visibility={form.env.visibility} setEnv={setEnv} />

      <CurrentSelector 
    </>
  );
}
