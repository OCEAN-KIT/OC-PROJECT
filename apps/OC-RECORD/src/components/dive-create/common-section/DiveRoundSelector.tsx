"use client";

import { useController } from "react-hook-form";
import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import type { SubmissionFormValues } from "../DiveFormProvider";
import { cardCls } from "../styles";
import { Hash } from "lucide-react";

const ROUNDS: OcRecordForm["basic"]["diveRound"][] = [1, 2, 3, 4, 5];

export default function DiveRoundSelector() {
  const { field } = useController<
    SubmissionFormValues,
    "basic.diveRound"
  >({
    name: "basic.diveRound",
  });

  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-2">
        <Hash className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">다이빙 회차</h2>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {ROUNDS.map((round) => {
          const active = field.value === round;
          return (
            <button
              key={round}
              type="button"
              onClick={() => field.onChange(round)}
              className={[
                "h-10 rounded-xl text-[13px] font-semibold transition",
                active
                  ? "bg-white border border-sky-200 text-sky-700 ring-2 ring-sky-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {round}
            </button>
          );
        })}
      </div>
    </section>
  );
}
