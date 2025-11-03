"use client";
import BeforeAfterBar from "@/components/charts/BeforeAfterBar";
import GaugePair from "@/components/charts/GaugePair";

export default function BiodiversityTab({ data }) {
  const categories = ["어류", "무척추"];
  const before = [
    data.biodiversity.before.fish,
    data.biodiversity.before.inverts,
  ];
  const after = [data.biodiversity.after.fish, data.biodiversity.after.inverts];

  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold mb-2">전후 종 수 비교</div>
        <BeforeAfterBar categories={categories} before={before} after={after} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold mb-2">샤논지수 (전/후)</div>
        <GaugePair
          left={{
            label: "전",
            value: data.biodiversity.shannon.before,
            max: 3,
          }}
          right={{
            label: "후",
            value: data.biodiversity.shannon.after,
            max: 3,
          }}
          height={220}
        />
      </div>
    </section>
  );
}
