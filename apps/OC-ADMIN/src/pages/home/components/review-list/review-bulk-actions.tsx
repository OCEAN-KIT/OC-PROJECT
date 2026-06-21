"use client";

/*
 * 선택된 제출 항목에 대한 일괄 작업 버튼 묶음입니다.
 * 선택 개수와 disabled 상태를 표시하고,
 * 실제 승인/반려 동작은 props로 받은 핸들러에 위임합니다.
 */

type Props = {
  className?: string;
  total: number;
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
  onExportCsv: () => void;
  onBulkApprove: () => void;
  onOpenReject: () => void;
  exportingCsv?: boolean;
  disabled?: boolean;
};

export default function ReviewBulkActions({
  className = "",
  total,
  selectedCount,
  allSelected,
  onToggleAll,
  onExportCsv,
  onBulkApprove,
  onOpenReject,
  exportingCsv = false,
  disabled = false,
}: Props) {
  const any = selectedCount > 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500">
        선택 {selectedCount}/{total}
      </span>

      <button
        type="button"
        onClick={onToggleAll}
        disabled={disabled || total === 0}
        className="h-9 px-3 rounded-md text-sm border border-white/10 bg-white/5
                   hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {allSelected ? "전체 해제" : "전체 선택"}
      </button>

      <button
        type="button"
        onClick={onExportCsv}
        disabled={disabled || exportingCsv || !any}
        className="h-9 px-3 rounded-md text-sm border border-blue-400/30 bg-blue-400/15
                   hover:bg-blue-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {exportingCsv ? "내보내는 중" : "CSV 내보내기"}
      </button>

      <button
        type="button"
        onClick={onOpenReject}
        disabled={disabled || !any}
        className="h-9 px-3 rounded-md text-sm border border-rose-400/30 bg-rose-400/15
                   hover:bg-rose-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        일괄 반려
      </button>

      <button
        type="button"
        onClick={onBulkApprove}
        disabled={disabled || !any}
        className="h-9 px-3 rounded-md text-sm border border-emerald-400/30 bg-emerald-400/15
                   hover:bg-emerald-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        일괄 승인
      </button>

    </div>
  );
}
