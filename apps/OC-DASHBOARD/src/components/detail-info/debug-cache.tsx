import RevalidateButton from "./revalidate-button";

type Props = {
  path: string;
};

export default function DebugCache({ path }: Props) {
  const renderedAt = Date.now();

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-lg border border-white/15 bg-slate-950/85 px-3 py-2 text-xs text-slate-100 shadow-lg backdrop-blur">
      <div className="font-semibold text-indigo-100">ISR Debug</div>
      <div className="mt-1 text-slate-300">path: {path}</div>
      <div className="mt-1 text-slate-300">renderedAt: {renderedAt}</div>
      <div className="mt-2">
        <RevalidateButton path={path} />
      </div>
    </div>
  );
}
