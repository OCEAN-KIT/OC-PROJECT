import Link from "next/link";

export default function AreaDetailNotFound() {
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-[var(--ds-bg)] px-4 text-slate-50">
      <div className="oc-detail-shell w-full max-w-md rounded-xl px-6 py-6 text-center">
        <h1 className="text-base font-semibold">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm leading-relaxed text-indigo-100/72">
          요청한 작업영역이 존재하지 않거나 삭제되었습니다.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:border-indigo-300/60 hover:bg-indigo-500/20"
        >
          지도 보기로 돌아가기
        </Link>
      </div>
    </main>
  );
}
