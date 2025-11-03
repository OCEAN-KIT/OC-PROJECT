export default function GrowthTab({ data, aiOn }) {
  const items = [
    { title: "착생률(%)", series: data.growth.attachment },
    { title: "생존률(%)", series: data.growth.survival },
    { title: "성장률(mm/일)", series: data.growth.growthMM },
  ];

  return (
    <section className="grid grid-cols-3 gap-4">
      {items.map((g) => (
        <div
          key={g.title}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{g.title}</div>
            {aiOn && (
              <span className="text-[10px] rounded-full px-2 py-[2px] bg-cyan-400/20 border border-cyan-400/30">
                AI 예측
              </span>
            )}
          </div>
          <div className="mt-2 h-44 rounded bg-white/5 flex items-center justify-center text-white/60">
            시계열 그래프
          </div>
          <div className="mt-2 text-[11px] text-white/60">
            {data.growth.months.join(" · ")}
          </div>
        </div>
      ))}
    </section>
  );
}
