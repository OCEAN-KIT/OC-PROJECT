"use client";

export default function StageFilter({
  activeStage,
  setActiveStage,
  stageMeta,
}) {
  return (
    <div className="flex flex-wrap justify-between">
      {Object.keys(stageMeta).map((stage) => {
        const on = activeStage === stage;
        const color = stageMeta[stage]?.color;
        return (
          <button
            key={stage}
            onClick={() => setActiveStage((s) => (s === stage ? null : stage))}
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
  );
}
