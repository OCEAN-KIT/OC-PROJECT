export default function TransplantTab() {
  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold mb-2">종류별 이식 개체수</div>
        <div className="h-48 rounded bg-white/5 flex items-center justify-center text-white/60">
          막대 차트
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold mb-2">이식 면적 분포</div>
        <div className="h-48 rounded bg-white/5 flex items-center justify-center text-white/60">
          도넛 차트
        </div>
      </div>
    </section>
  );
}
