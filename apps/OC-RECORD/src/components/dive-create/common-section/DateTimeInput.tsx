"use client";

import { Calendar as CalendarIcon, Clock3 } from "lucide-react";
import { useController } from "react-hook-form";
import type { SubmissionFormValues } from "../DiveFormProvider";
import { cardCls } from "../styles";

type Props = {
  isMobile: boolean;
  openDatePicker: () => void;
  openTimePicker: () => void;

  dateInputRef: React.RefObject<HTMLInputElement | null>;
  timeInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function DateTimeInput({
  isMobile,
  openDatePicker,
  openTimePicker,
  dateInputRef,
  timeInputRef,
}: Props) {
  const { field: dateField } = useController<
    SubmissionFormValues,
    "basic.date"
  >({
    name: "basic.date",
  });
  const { field: timeField } = useController<
    SubmissionFormValues,
    "basic.time"
  >({
    name: "basic.time",
  });

  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-3">
        <CalendarIcon className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">날짜/시간</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 날짜 */}
        <button
          type="button"
          onClick={!isMobile ? openDatePicker : undefined}
          className="relative text-left"
        >
          <div className={cardCls}>
            <div className="flex justify-between">
              <div className="text-[12px] text-gray-500 mb-1">날짜</div>
              <div className="text-[12px] text-sky-600 font-medium">변경</div>
            </div>
            <div className="flex items-center gap-2 text-[15px] text-gray-800">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span>{dateField.value}</span>
            </div>

            <input
              ref={dateInputRef}
              type="date"
              value={dateField.value}
              onBlur={dateField.onBlur}
              onChange={dateField.onChange}
              className={
                isMobile
                  ? "absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                  : "absolute right-2 top-2 h-0 w-0 opacity-0 pointer-events-none"
              }
              inputMode="none"
            />
          </div>
        </button>

        {/* 시간 */}
        <button
          type="button"
          onClick={!isMobile ? openTimePicker : undefined}
          className="relative text-left"
        >
          <div className={cardCls}>
            <div className="flex justify-between">
              <div className="text-[12px] text-gray-500 mb-1">시간</div>
              <div className="text-[12px] text-sky-600 font-medium">변경</div>
            </div>

            <div className="flex items-center gap-2 text-[15px] text-gray-800">
              <Clock3 className="h-4 w-4 shrink-0" />
              <span>{timeField.value}</span>
            </div>

            <input
              ref={timeInputRef}
              type="time"
              value={timeField.value}
              onBlur={timeField.onBlur}
              onChange={timeField.onChange}
              className={
                isMobile
                  ? "absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                  : "absolute right-2 top-2 h-0 w-0 opacity-0 pointer-events-none"
              }
              step="60"
              inputMode="none"
            />
          </div>
        </button>
      </div>
    </section>
  );
}
