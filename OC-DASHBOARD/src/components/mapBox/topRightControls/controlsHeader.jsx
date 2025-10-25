"use client";

export default function ControlsHeader({ open, setOpen, resetView }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="font-semibold tracking-wide">해역 컨트롤</div>
      <div className="flex items-center gap-2">
        <button
          onClick={resetView}
          className="rounded-lg bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
        >
          초기뷰
        </button>
        <button
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
        >
          {open ? "접기" : "펼치기"}
        </button>
      </div>
    </div>
  );
}
