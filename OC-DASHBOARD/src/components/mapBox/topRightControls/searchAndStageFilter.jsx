"use client";

export default function SearchAndStageFilter({
  query,
  setQuery,
  activeStage,
  setActiveStage,
  stageMeta,
  activeRegion,
}) {
  return (
    <div className="px-4 py-3 space-y-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="작업영역/해역유형 검색"
        className="w-full h-9 rounded-lg bg-white/10 placeholder-white/50 px-3 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      />
      <div className="flex flex-wrap justify-between">
        {Object.keys(stageMeta).map((stage) => {
          const on = activeStage === stage;
          const color = stageMeta[stage]?.color;
          return (
            <button
              key={stage}
              onClick={() =>
                setActiveStage((s) => (s === stage ? null : stage))
              }
              className={`h-6 px-3 rounded-full text-xs border transition flex items-center gap-2
                ${
                  on
                    ? "border-white/20 bg-white/20"
                    : "border-white/10 bg-white/10 hover:bg-white/15"
                }`}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {stage}
            </button>
          );
        })}
      </div>
    </div>
  );
}
