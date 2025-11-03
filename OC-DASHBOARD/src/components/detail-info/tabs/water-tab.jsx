export default function WaterTab({ data, aiOn }) {
  const cards = [
    { title: "수온(°C)", key: "temp" },
    { title: "용존산소량(DO)", key: "do" },
    { title: "영양염류", key: "nutrient" },
  ];

  return (
    <section className="grid grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.key}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{c.title}</div>
            {aiOn && (
              <span className="text-[10px] rounded-full px-2 py-[2px] bg-cyan-400/20 border border-cyan-400/30">
                AI 예측
              </span>
            )}
          </div>
          <div className="mt-2 h-44 rounded bg-white/5 flex items-center justify-center text-white/60">
            라인 차트
          </div>
          <div className="mt-2 text-[11px] text-white/60">
            {data.water.map((w) => w.month).join(" · ")}
          </div>
        </div>
      ))}
    </section>
  );
}
