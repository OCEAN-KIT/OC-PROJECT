export default function OverviewTab({ data, aiOn }) {
  return (
    <section className="grid grid-cols-12 gap-4">
      {/* 좌측: 전경 + KPI */}
      <div className="col-span-8">
        <div className="rounded-xl border border-white/10 bg-white/5 h-64 flex items-center justify-center text-white/60">
          지도 + 해역 전경 (Placeholder)
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            { label: "착생률", val: aiOn ? "83% (예측)" : "82%" },
            { label: "생존률", val: aiOn ? "83% → 81%" : "84%" },
            { label: "성장률", val: aiOn ? "2.6 mm/일" : "2.4 mm/일" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="text-xs text-white/60">{k.label}</div>
              <div className="text-xl font-semibold">{k.val}</div>
              <div className="mt-2 h-10 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>

      {/* 우측: 이식 해조류 개요만 유지 (높이 맞춤) */}
      <div className="col-span-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 h-64">
          <div className="text-sm font-semibold mb-2">이식 해조류 개요</div>
          <div className="space-y-2 overflow-auto pr-1">
            {data.transplant.map((it) => (
              <div key={it.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  <span className="text-sm">{it.name}</span>
                </div>
                <div className="text-sm text-white/80">
                  {it.count.toLocaleString()}개체 · {it.area}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
