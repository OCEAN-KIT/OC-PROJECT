"use client";

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
  // Date/TimeInput에서 쓰는 값들
  isMobile: boolean;
  openDatePicker: () => void;
  openTimePicker: () => void;
  dateInputRef: React.RefObject<HTMLInputElement | null>;
  timeInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function CommonWrapper({
  isMobile,
  openDatePicker,
  openTimePicker,
  dateInputRef,
  timeInputRef,
}: Props) {
  return (
    <>
      <SiteNameInput />

      <DateTimeInput
        isMobile={isMobile}
        openDatePicker={openDatePicker}
        openTimePicker={openTimePicker}
        dateInputRef={dateInputRef}
        timeInputRef={timeInputRef}
      />

      <DiveRoundSelector />

      <WorkersInput />

      <DepthTempInput />
      <div className="grid grid-cols-4 gap-2">
        <VisibilitySelector />
        <WaveSelector />
        <SurgeSelector />
        <CurrentSelector />
      </div>
    </>
  );
}
