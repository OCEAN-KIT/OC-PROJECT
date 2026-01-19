"use client";

import { Activity } from "lucide-react";
import type { HealthGrade, OcRecordForm } from "@/types/form";
import { cardCls } from "../dive-create/styles";

type Props = {
  healthGrade: OcRecordForm["transplant"]["healthGrade"];
  setTransplant: (patch: Partial<OcRecordForm["transplant"]>) => void;
};

const GRADES: HealthGrade[] = ["A", "B", "C", "D"];

export default function HealthGradeSelector({
  healthGrade,
  setTransplant,
}: Props) {
  return (
    <section className={cardCls}>
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-4 w-4 text-sky-600" />
        <h2 className="text-[14px] font-semibold text-gray-800">건강 상태</h2>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {GRADES.map((grade) => {
          const active = healthGrade === grade;
          return (
            <button
              key={grade}
              type="button"
              onClick={() => setTransplant({ healthGrade: grade })}
              className={[
                "h-10 rounded-xl text-[14px] font-semibold transition",
                active
                  ? "bg-white border border-emerald-200 text-emerald-700 ring-2 ring-emerald-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {grade}
            </button>
          );
        })}
      </div>
    </section>
  );
}
