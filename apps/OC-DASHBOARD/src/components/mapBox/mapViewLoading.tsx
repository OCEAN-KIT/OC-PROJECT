export default function MapViewLoading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[var(--ds-bg)] px-4 text-slate-50"
      style={{ height: "var(--app-height, 100dvh)" }}
    >
      <div className="oc-panel w-full max-w-sm rounded-2xl px-5 py-4">
        <div className="h-4 w-28 animate-pulse rounded bg-indigo-100/20" />
        <div className="mt-4 space-y-2">
          <div className="h-3 animate-pulse rounded bg-indigo-100/14" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-indigo-100/14" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-indigo-100/14" />
        </div>
      </div>
    </div>
  );
}
