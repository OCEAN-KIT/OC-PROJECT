"use client";

type Props = {
  total: number;
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  className?: string;
};

export default function ReviewBulkActions({
  total,
  selectedCount,
  allSelected,
  onToggleAll,
  onBulkApprove,
  onBulkReject,
  className = "",
}: Props) {
  const anySelected = selectedCount > 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="mr-2 text-sm text-gray-500">
        선택 {selectedCount}/{total}
      </div>
      <button
        onClick={onToggleAll}
        className="h-9 px-3 rounded-md text-sm border border-gray-200 bg-white hover:bg-gray-50"
      >
        {allSelected ? "전체 해제" : "전체 선택"}
      </button>
      <button
        onClick={onBulkReject}
        disabled={!anySelected}
        className="h-9 px-3 rounded-md text-sm border border-rose-300 bg-rose-50
                   hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        일괄 반려
      </button>
      <button
        onClick={onBulkApprove}
        disabled={!anySelected}
        className="h-9 px-3 rounded-md text-sm border border-emerald-300 bg-emerald-50
                   hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        일괄 승인
      </button>
    </div>
  );
}
