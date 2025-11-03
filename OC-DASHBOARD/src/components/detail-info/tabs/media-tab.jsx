import { useMemo } from "react";

export default function MediaTab({ media, frame, setFrame }) {
  const active = useMemo(
    () => media[Math.min(frame, media.length - 1)],
    [frame, media]
  );

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">복원 전/후 타임라인</div>
          <div className="text-xs text-white/70">{active.label}</div>
        </div>

        <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <img
            src={active.url}
            alt={active.label}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={media.length - 1}
            value={frame}
            onChange={(e) => setFrame(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-white/70 w-16 text-right">
            {media[frame].label}
          </div>
        </div>
      </div>
    </section>
  );
}
