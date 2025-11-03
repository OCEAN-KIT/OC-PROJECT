export default function BiodiversityTab({ data }) {
  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold mb-2">전후 종 수 비교</div>
        <div className="h-48 rounded bg-white/5 flex items-center justify-center text-white/60">
          막대 그래프
        </div>
        <div className="mt-2 text-xs text-white/70">
          어류: {data.biodiversity.before.fish} → {data.biodiversity.after.fish}
          종, 무척추: {data.biodiversity.before.inverts} →{" "}
          {data.biodiversity.after.inverts}종
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold mb-2">샤논지수 (전/후)</div>
        <div className="h-48 rounded bg-white/5 flex items-center justify-center text-white/60">
          지수 비교 차트
        </div>
        <div className="mt-2 text-xs text-white/70">
          {data.biodiversity.shannon.before} → {data.biodiversity.shannon.after}
        </div>
      </div>
    </section>
  );
}
