"use client";

import type { OcRecordForm } from "@ocean-kit/submission-domain/types/form";
import { cardCls } from "../styles";
import { Hash } from "lucide-react";

type Props = {
  diveRound: OcRecordForm["basic"]["diveRound"];
  setBasic: (patch: Partial<OcRecordForm["basic"]>) => void;
};

const ROUNDS: OcRecordForm["basic"]["diveRound"][] = [1, 2, 3, 4, 5];

export default function DiveRoundSelector({ diveRound, setBasic }: Props) {
  return (
    <section className="mb-7">
      <div className="flex items-center gap-2 mb-2">
        <Hash className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">다이빙 회차</h2>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {ROUNDS.map((round) => {
          const active = diveRound === round;
          return (
            <button
              key={round}
              type="button"
              onClick={() => setBasic({ diveRound: round })}
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
