"use client";

export default function AreaItemCard({ area, color, onClick, days }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl hover:bg-white/12 transition border-white/10 px-3 py-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: color ?? "rgba(255,255,255,.6)" }}
          />
          <span className="text-[13px]">{area.label}</span>
          <span className="text-[11px] text-white/60">
            {area.habitat} · {area.depth}m
          </span>
        </div>
        <div className="text-xs text-white/60">
          {days === null ? "-" : `업데이트 ${days}일 전`}
        </div>
      </div>
    </button>
  );
}
