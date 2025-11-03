export default function Header({ areaId, basic, aiOn, setAiOn, onClose }) {
  return (
    <div className="flex items-center justify-between p-5 pb-3">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-emerald-400/30 ring-2 ring-emerald-300/60" />
        <div>
          <div className="text-lg font-semibold">
            작업 영역 상세 (ID: {areaId})
          </div>
          <div className="text-xs text-white/70">
            복원 시작일 {basic.startDate} · {basic.habitat} · {basic.depth}m ·
            면적 {basic.areaSize}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setAiOn((s) => !s)}
          className={[
            "h-8 px-3 rounded-full text-xs border transition",
            aiOn
              ? "border-cyan-400/60 bg-cyan-400/20"
              : "border-white/10 bg-white/10 hover:bg-white/15",
          ].join(" ")}
          title="AI 기반 예측값 보기"
        >
          {aiOn ? "AI 예측 ON" : "AI 예측 OFF"}
        </button>
        <button
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
