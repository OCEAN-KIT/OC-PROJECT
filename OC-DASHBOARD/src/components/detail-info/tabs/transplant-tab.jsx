// componenets/detail-info/tabs/TransplantTab.jsx (또는 transplant-tab.jsx)
"use client";
import BarBasic from "@/components/charts/BarBasic";
import DonutBasic from "@/components/charts/DonuntBasic";

export default function TransplantTab({ data }) {
  const labels = data.transplant.map((t) => t.name);
  const counts = data.transplant.map((t) => t.count);
  const areas = data.transplant.map((t) =>
    Number(String(t.area).replace(/[^0-9.]/g, ""))
  );

  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold mb-2">종류별 이식 개체수</div>
        <BarBasic
          categories={labels}
          values={counts}
          label="개체수"
          height={220}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 ">
        <div className="text-sm font-semibold -mb-4">이식 면적 분포</div>
        <DonutBasic labels={labels} values={areas} />
      </div>
    </section>
  );
}
